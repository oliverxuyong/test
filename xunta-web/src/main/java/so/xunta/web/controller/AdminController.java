package so.xunta.web.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import redis.clients.jedis.Tuple;
import so.xunta.beans.User;
import so.xunta.persist.ScopeMatchedUserDao;
import so.xunta.persist.U2uCpDetailDao;
import so.xunta.persist.U2uRelationDao;
import so.xunta.server.UserService;

@Controller
public class AdminController {
	@Autowired
	private UserService userService;
	@Autowired
	private U2uRelationDao u2uRelationDao;
	@Autowired
	private ScopeMatchedUserDao scopeMatchedUserDao;
	@Autowired
	private SessionFactory sessionFactory;
	@Autowired
	private U2uCpDetailDao u2uCpDetailDao; 

	
	Logger logger = Logger.getLogger(AdminController.class);
	
	
	@RequestMapping(value="/matchUserOverview")
	public void requestMatchUserOverview(HttpServletRequest request,HttpServletResponse response) {
		//根据请求参数带的group名得到对应的group用户列表
		//根据用户列表分别获取他们的u2u
		//根据myuserId和otheruserId按从小到大串联，并查得username，用“--”符号串联作为value，score作为score，存入redis，key为“group+matchUserOverview”
		//存入完毕后读出返回，并在redis中删除生成的key
		String eventScope = request.getParameter("eventScope");
		response.setContentType("text/html;charset = utf-8");
		if(eventScope==null){
			try {
				response.getWriter().write("参数传入错误");
			} catch (IOException e) {
				logger.error(e.getMessage(),e);
			}
			return;
		}
		logger.info(eventScope);
		
		List<User> users = userService.findUsersByScope(eventScope);
		for(User u:users){
			Long centerUidLong = u.getUserId();
			String centerUid = centerUidLong.toString();
			String centerUserName = u.getName();
			Set<Tuple> relateUsers = u2uRelationDao.getRelatedUsersByRank(centerUid, 0, -1);
			for(Tuple relateUserTp:relateUsers){
				String relateUid = relateUserTp.getElement();
				Long relateUidLong = Long.valueOf(relateUid);
				Double score = relateUserTp.getScore();
				User relateUser = userService.findUser(relateUidLong);
				String relateUserName = relateUser.getName();
				String matchUserPair = null;
				if(centerUidLong > relateUidLong){
					matchUserPair = centerUserName + " - " + relateUserName;
				}else{
					matchUserPair = relateUserName + " - " + centerUserName;
				}
				scopeMatchedUserDao.updatePairMatchedUser(eventScope, matchUserPair, score);
			}
		}
		
		Set<Tuple> scopeMatchedUsers = scopeMatchedUserDao.getPairMatchedUsers(eventScope);
		
		try {
			response.getWriter().write("<table width=\"60%\" border=\"1\" cellpadding=\"3\" cellspacing=\"0\" bgcolor=\"#cccccc\">");
			response.getWriter().write("<caption>两两匹配排名</caption>");
			response.getWriter().write("<thead><td>排名</td><td>两两匹配人</td><td>匹配分</td></thead>");
			response.getWriter().write("<tbody>");
			int rank = 1;
			
			for(Tuple groupMatchUserTuple:scopeMatchedUsers){
				String pairUserName = groupMatchUserTuple.getElement();
				Double relateScore = groupMatchUserTuple.getScore();
				if(relateScore<=0){
					break;
				}
				
				response.getWriter().write("<tr>");
				response.getWriter().write("<td>"+rank+"</td>");
				response.getWriter().write("<td>"+pairUserName+"</td>");
				response.getWriter().write("<td>"+String.format("%.2f",relateScore)+"</td>");
				response.getWriter().write("</tr>");
				
				rank++;
			}
			response.getWriter().write("</tbody>");
			response.getWriter().write("</table>");
			response.flushBuffer();
		} catch (IOException e) {
			logger.error(e.getMessage(),e);
		}
	}
	
	@RequestMapping(value="/initRedisMatchUserDetail")
	public void initRedisMatchUserDetail(HttpServletResponse response) {
		Session session = sessionFactory.getCurrentSession();
		String sql = "SELECT mycpc.user_id my_uid, othercpc.user_id other_uid,mycpc.cp_id cp_id,mycpc.text cp_text, mycpc.property choice_property "
					+"FROM tmp_table mycpc, tmp_table othercpc " 
					+"WHERE mycpc.cp_id = othercpc.cp_id AND mycpc.user_id!=othercpc.user_id AND mycpc.event_scope = othercpc.event_scope AND mycpc.property = othercpc.property "
					+"ORDER BY mycpc.user_id;";
		
		@SuppressWarnings("unchecked")
		List<Map<String,Object>> result=session.createSQLQuery(sql).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).list();
		for(Map<String,Object> resultLine:result){
			String myUid = resultLine.get("my_uid").toString();
			String otherUid = resultLine.get("other_uid").toString();
			String cpId = resultLine.get("cp_id").toString();
			String cpText = resultLine.get("cp_text").toString();
			String choiceProperty = resultLine.get("choice_property").toString();
			u2uCpDetailDao.addU2uOneCp(myUid, otherUid, choiceProperty, cpId, cpText);
		}
		try {
			response.getWriter().write("redisMigration success");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}

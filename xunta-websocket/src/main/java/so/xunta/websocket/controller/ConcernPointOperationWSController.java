package so.xunta.websocket.controller;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.CpChoiceDO;
import so.xunta.beans.CpChoiceDetailDO;
import so.xunta.beans.PushMatchedUserDTO;
import so.xunta.beans.PushRecommendCpDTO;
import so.xunta.beans.RecommendPushDTO;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.persist.CpChoiceDetailDao;
import so.xunta.server.CancelOneSelectedCP;
import so.xunta.server.CpChoiceService;
import so.xunta.server.RecommendService;import so.xunta.server.SelectOneNewCPService;
import so.xunta.server.SocketService;
import so.xunta.server.impl.RecommendServiceImpl;
import so.xunta.utils.RecommendTaskPool;
import so.xunta.websocket.echo.EchoWebSocketHandler;

/**
 * @author Bright_zheng
 * */
@WebSocketTypeAnnotation
@Component
public class ConcernPointOperationWSController {
	@Autowired
	private SocketService socketService;
	@Autowired
	private SelectOneNewCPService selectOneNewCPService;
	@Autowired
	private CancelOneSelectedCP cancelOneSelectedCP;
	@Autowired
	private CpChoiceService cpChoiceService;
	@Autowired
	private RecommendService recommendService;	
	
	Logger logger =Logger.getLogger(RecommendServiceImpl.class);
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1102-1")
	public void selectOneNewCP(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		BigInteger cpid = BigInteger.valueOf(Long.valueOf(params.getString("cpid")));
		String timestamp = params.getString("timestamp");
		//2017.08.08 叶夷  前端请求的接口加上标签文字,为了返回数据里面需要text
		String text=params.getString("cptext");
		
		CpChoiceDetailDO cpChoiceDetailDO = new CpChoiceDetailDO();
		cpChoiceDetailDO.setUser_id(uid);
		cpChoiceDetailDO.setCp_id(cpid);
		cpChoiceDetailDO.setIs_selected(CpChoiceDetailDao.SELECTED);
		cpChoiceDetailDO.setCreate_time(new Timestamp(System.currentTimeMillis()));

		selectOneNewCPService.addNewCP(cpChoiceDetailDO);
		
		RecommendTaskPool.getInstance().getThreadPool().execute(new Runnable() {
			@Override
			public void run() {
				Set<String> pendingPushUids = recommendService.recordU2UChange(cpChoiceDetailDO.getUser_id()+"",cpChoiceDetailDO.getCp_id()+"",RecommendService.SELECT_CP);
				
				//获得在线的匹配用户列表，触发他们的更新任务
				pendingPushUids.add(uid+"");
				filterOffLineUsers(pendingPushUids);
				for(String uid:pendingPushUids){
					RecommendPushDTO recommendPushDTO = recommendService.updateU2C(uid);
					List<PushMatchedUserDTO> pushMatchedUserDTOs = recommendPushDTO.getPushMatchedUsers();
					if(pushMatchedUserDTOs!=null){
						logger.info("给id为”"+uid+"“ 的用户产生了MatchedUsers推送");
						pushChangedMatchedUsers(pushMatchedUserDTOs,session);
					}
					
					List<PushRecommendCpDTO> pushRecommendCpDTOs = recommendPushDTO.getPushMatchedCPs();
					if(pushRecommendCpDTOs!=null){
						logger.info("给id为”"+uid+"“ 的用户产生了CP推送,推送了 "+pushRecommendCpDTOs.size()+" 个");
						pushRecommendCps(pushRecommendCpDTOs,session);
					}
				}
			}
		});
		
		if(cpChoiceDetailDO !=null){
			JSONObject returnJson = new JSONObject();
			returnJson.put("_interface", "1102-2");
			returnJson.put("is_success", "true");
			//2017.08.08 叶夷  在选中标签时返回的数据中加上cpid
			returnJson.put("cpid", cpid);
			returnJson.put("cptext", text);
			returnJson.put("timestamp", timestamp);
			socketService.chat2one(session, returnJson);
		}	
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1103-1")
	public void cancelOneSelectedCP(WebSocketSession session, TextMessage message){
		JSONObject params=new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		BigInteger cpid = BigInteger.valueOf(Long.valueOf(params.getString("cpid")));
		String timestamp = params.getString("timestamp");
		CpChoiceDetailDO cpChoiceDetailDO = new CpChoiceDetailDO();
		cpChoiceDetailDO.setUser_id(uid);
		cpChoiceDetailDO.setCp_id(cpid);
		cpChoiceDetailDO.setIs_selected(CpChoiceDetailDao.UNSELECTED);
		cpChoiceDetailDO.setCreate_time(new Timestamp(System.currentTimeMillis()));
		cpChoiceDetailDO = cancelOneSelectedCP.deleteSelectedCP(cpChoiceDetailDO);
		if(cpChoiceDetailDO !=null){
			JSONObject returnJson = new JSONObject();
			returnJson.put("_interface", "1103-2");
			returnJson.put("is_success", "true");
			//2017.08.08 叶夷  在选中标签时返回的数据中加上cpid
			returnJson.put("cpid", cpid);
			returnJson.put("timestamp", timestamp);
			socketService.chat2one(session, returnJson);
		}	
	}
	
/**2017.08.11 叶夷  通过uid和cpid判断cp是否已经被选择*/
	@WebSocketMethodAnnotation(ws_interface_mapping = "1107-1")
	public void ifCPSelected(WebSocketSession session, TextMessage message){
		JSONObject params=new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		BigInteger cpid = BigInteger.valueOf(Long.valueOf(params.getString("cpid")));
		String timestamp = params.getString("timestamp");
		
		CpChoiceDO cpChoiceDO = cpChoiceService.getCpChoice(uid, cpid);
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1107-2");
		if(cpChoiceDO==null){//这是没有被选择的cp
			returnJson.put("is_select", "false");
		}else{
			returnJson.put("is_select", "true");
		}
		returnJson.put("cpid", cpid);
		returnJson.put("uid", uid);
		returnJson.put("timestamp", timestamp);
		socketService.chat2one(session, returnJson);
	}
	
	private void filterOffLineUsers(Set<String> userids) {
		Iterator<String> iterator = userids.iterator();
		while(iterator.hasNext()){
			String userid = iterator.next();
			Boolean exist = EchoWebSocketHandler.checkExist(userid);
			if(!exist){
				iterator.remove();
			}
		}
	}
	
	private void pushChangedMatchedUsers(List<PushMatchedUserDTO> pushMatchedUserDTOs,WebSocketSession session){
		
		JSONArray newUserArr = new JSONArray();
		for(PushMatchedUserDTO matchedUserDTO:pushMatchedUserDTOs){
			JSONObject pushMatchedUserJson = new JSONObject();
			pushMatchedUserJson.put("userid", matchedUserDTO.getUserid());
			pushMatchedUserJson.put("username", matchedUserDTO.getUsername());
			pushMatchedUserJson.put("img_src", matchedUserDTO.getImg_src());
			pushMatchedUserJson.put("new_rank", matchedUserDTO.getNew_rank());
			newUserArr.put(pushMatchedUserJson);
		}
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "2106-1");
		returnJson.put("interface_name", "push_matched_user");
		returnJson.put("new_user_arr", newUserArr);
		socketService.chat2one(session, returnJson);
	}
	
	private void pushRecommendCps(List<PushRecommendCpDTO> pushRecommendCpDTOs,WebSocketSession session){
		JSONArray cpWrap = new JSONArray();
		for(PushRecommendCpDTO pushRecommendCp:pushRecommendCpDTOs){
			JSONObject pushMatchedUserJson = new JSONObject();
			pushMatchedUserJson.put("cpid", pushRecommendCp.getCpId());
			pushMatchedUserJson.put("cptext", pushRecommendCp.getCpText());
			pushMatchedUserJson.put("howmanypeople_selected", pushRecommendCp.getSelectPepoleNum());
			cpWrap.put(pushMatchedUserJson);
		}
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "2105-1");
		returnJson.put("interface_name", "PushCP");
		returnJson.put("cp_wrap", cpWrap);
		socketService.chat2one(session, returnJson);
	}}

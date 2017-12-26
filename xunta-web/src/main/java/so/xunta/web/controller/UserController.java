package so.xunta.web.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.net.URLDecoder;
import java.sql.Timestamp;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;



import so.xunta.beans.User;
import so.xunta.server.OpenId2EventScopeService;
import so.xunta.server.UserService;
import so.xunta.utils.DateTimeUtils;
import so.xunta.utils.IdWorker;

@Controller
public class UserController {
	@Autowired
	private UserService userService;
	
	@Autowired
	private OpenId2EventScopeService openId2EventScopeService;
	
	Logger logger =Logger.getLogger(UserController.class);
	IdWorker idWorder = new IdWorker(1L, 1L);	
	
	@RequestMapping("/checkuser")
	public void checkUserExist(String userid,String userimage,HttpServletRequest request,HttpServletResponse response) throws IOException{
		logger.debug("checkuser userid:"+userid);
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/json");
		logger.debug("checkuser 请求:"+request.getRequestURI().toString());
		logger.debug("checkuser:"+userid+"  userimage:"+userimage);
		String flag = "0";
		String userName = null;
		//判断userid 是否为空
		if(userid !=null){
			User user = userService.findUser(Long.valueOf(userid));
			if(user!=null){
			/*	int changed = 0;
				if(userimage!=null&&!userimage.trim().equals("")&&!user.getImgUrl().equals(userimage)){
					changed = 1;
					user.setImgUrl(userimage);
				}
				
				if(changed==1){
					System.out.println("更新用户信息");
					userService.updateUser(user);
				}*/
				flag = "1";
				userName = user.getName();
			}
		}
		if (userName == null){
			userName = "未命名";
		}
		JSONObject obj = new JSONObject();
		obj.put("if_exist",flag);
		obj.put("userName", userName);
		logger.debug("返回查询用户结果:"+obj.toString(2));
        responseBack(request, response, obj);
	}
	
	@RequestMapping("/save_user")
	public void addUser(String third_party_id,String unionid,String type,String name,String image_url,String groupname,String openid,HttpServletRequest request,HttpServletResponse response) {
		logger.debug("name:"+name+"   groupname:"+groupname+"   openid:"+openid+"  \n"+"  \n发送save_user登录连接...");
		
		if(isNull(third_party_id)){
			throw new RuntimeException("uid为空");
		}
		if(isNull(type)){
			throw new RuntimeException("type为空");
		}
		if(isNull(name)){
			throw new RuntimeException("name为空");
		}
		if(isNull(image_url)){
			throw new RuntimeException("image为空");
		}
		
		if(isNull(unionid)){
			System.out.println("unionid为空");
		}
		
		try {
			name=URLDecoder.decode(name,"UTF-8");
		} catch (UnsupportedEncodingException e2) {
			// TODO Auto-generated catch block
			logger.error("UserName URLdecode 出错"+name);
		}
		

		
		User user = new User();
		Long user_id = idWorder.nextId();
		user.setUserId(user_id);
		user.setImgUrl(image_url);
		user.setThird_party_id(third_party_id);
		user.setUnion_id(unionid);
		user.setType(type);
		user.setName(name);
		
		user.setUserGroup(groupname);
		Date date = new Date();
		user.setCreate_datetime_long(date.getTime());
		user.setCreate_datetime_str(DateTimeUtils.getTimeStrFromDate(date));
		user.setOpenid(openid);

		user.setLast_update_time(new Timestamp(System.currentTimeMillis()));
		
		String event_scope = null;
		if(openid!=null){
			event_scope=openId2EventScopeService.getEventScope(openid);		
		}
		if(event_scope!=null){
			user.setEvent_scope(event_scope);
		}else{
			user.setEvent_scope(groupname);
		}
		
		JSONObject params = new JSONObject();
		params.put("third_parth_id",third_party_id);
		params.put("type",type);
		params.put("name",name);
		params.put("image_url",image_url);
		params.put("user_id",user_id);
		logger.debug(params.toString(2));
		
		try {
			user = userService.addUser(user);//添加用户
			/*
			 * 查询用户是否存在初始化话题
			 * 		如果不存在初始化话题,就初始化话题
			 */
			if(user.getIfInitedTopics()==0){//代表没有初始化话题列表
				//recommendService.initRecommendParm(user);
				user.setIfInitedTopics(1);
				userService.updateUser(user);		
			}
		} catch (Exception e) {
			logger.error("添加用户失败"+e.getMessage(), e);
		}
		
		response.setCharacterEncoding("utf-8");
		JSONObject obj = new JSONObject();
		obj.put("userid", user.getUserId().toString());
		obj.put("username",user.getName());
		logger.debug(obj.toString(2));
		
		try {
			responseBack(request, response, obj);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}
	private void responseBack(HttpServletRequest request, HttpServletResponse response, JSONObject obj)
			throws IOException {
		logger.debug("执行responseBack...");
		boolean jsonP = false;
		String cb = request.getParameter("callback");
		if (cb != null) {
		    jsonP = true;
		    response.setContentType("text/javascript");
		} else {
		    response.setContentType("application/x-json");
		}
		Writer out = response.getWriter();
		if (jsonP) {
		    out.write(cb + "(");
		}
		out.write(obj.toString(2));
		
		if (jsonP) {
		    out.write(");");
		    logger.debug("返回成功。。。");
		}
	}
	
	
	@RequestMapping("/userlogin")
	public void userlogin(String third_party_id,String type,String name,String image_url,String groupname,HttpServletRequest request,HttpServletResponse response) throws IOException{
		
		logger.info("name:"+name+"   groupname:"+groupname+"  用户登录");
		
		if(isNull(third_party_id)){
			throw new RuntimeException("uid为空");
		}
		if(isNull(type)){
			throw new RuntimeException("type为空");
		}
		if(isNull(name)){
			throw new RuntimeException("name为空");
		}
		if(isNull(image_url)){
			throw new RuntimeException("image为空");
		}
		if(isNull(groupname)){
			throw new RuntimeException("groupname为空");
		}
		
		User user = new User();
		Long user_id = idWorder.nextId();
		user.setUserId(user_id);
		user.setImgUrl(image_url);
		user.setThird_party_id(third_party_id);
		user.setType(type);
		user.setName(name);
		user.setUserGroup(groupname);//设置话题组
		
		JSONObject params = new JSONObject();
		params.put("third_parth_id",third_party_id);
		params.put("type",type);
		params.put("name",name);
		params.put("image_url",image_url);
		params.put("third_parth_id",third_party_id);
		params.put("user_id",user_id);
		logger.debug(params.toString(2));
		
		try {
			user = userService.addUser(user);//添加用户
			
			/*System.out.println("添加用户"+user.getName()+"成功");
			if(groupname!=null&&!"".equals(groupname.trim())){
				List<String> groups = new ArrayList<String>();
				Collections.addAll(groups,groupname);
				topicService.initUsersDefaultTopicsByGroup(user.getUserId(), groups);
			}else{
				topicService.initUsersDefaultTopics(user.getUserId());
			}
			System.out.println("初始化用户的预设话题成功");*/
			//topicService.initUsersTopics(user.getUserId(), groupname);
			
		} catch (Exception e) {
			logger.error("添加用户失败"+e.getMessage(), e);
		}
		
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/json");
		JSONObject obj = new JSONObject();
		obj.put("userid", user.getUserId().toString());
		obj.put("username",user.getName());
		logger.debug(obj.toString(2));
		responseBack(request, response, obj);
	}
	
	/**
	 * 删除用户
	 * @param obj
	 * @return
	 */
	@RequestMapping("/deluser")
	public void delUser(Long userid,HttpServletRequest request,HttpServletResponse response) throws IOException{
		logger.info("收到删除用户："+userid+"  请求");
		int a = userService.delUser(userid);
		if(a==0){
			JSONObject json = new JSONObject( "删除用户成功!");
			responseBack(request, response,json);
		}
	}

	public boolean isNull(String obj){
		return obj==null||"".equals(obj.trim());
	}
}

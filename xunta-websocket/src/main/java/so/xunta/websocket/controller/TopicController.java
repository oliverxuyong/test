package so.xunta.websocket.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.Topic;
import so.xunta.beans.TopicChatmsg;
import so.xunta.beans.TopicHasUnreadMsgNum;
import so.xunta.beans.TopicUnreadMsg;
import so.xunta.beans.TopicUnreadMsgQueue;
import so.xunta.beans.TopicUserMapping;
import so.xunta.beans.User;
import so.xunta.beans.WeChatProperties;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.persist.TopicChatMsgDao;
import so.xunta.persist.TopicDao;
import so.xunta.persist.TopicUserMappingDao;
import so.xunta.server.SocketService;
import so.xunta.server.TopicHasUnreadMsgNumService;
import so.xunta.server.TopicUnreadMsgService;
import so.xunta.server.UserService;
import so.xunta.server.WeChatPropertiesService;
import so.xunta.server.WeChatService;
import so.xunta.utils.DateTimeUtils;
import so.xunta.utils.IdWorker;
import so.xunta.websocket.echo.EchoWebSocketHandler;
import so.xunta.websocket.config.Constants;


/**2018.03.29  
 * @author 叶夷
 * 关于群聊话题的接口
 */
@WebSocketTypeAnnotation
@Component
public class TopicController {
	IdWorker idWorker = new IdWorker(1L, 1L);

	Logger logger =Logger.getLogger(TopicController.class);
	
	@Autowired
	private SocketService socketService;
	@Autowired
	private TopicDao topicDao;
	@Autowired
	private TopicUserMappingDao topicUserMappingDao;
	@Autowired
	private TopicChatMsgDao topicChatMsgDao;
	@Autowired
	private WeChatPropertiesService weChatPropertiesService;
	@Autowired
	private UserService userService;
	@Autowired
	private WeChatService weChatService;
	@Autowired
	private TopicUnreadMsgService userUnreadMsgService;
	@Autowired
	private TopicHasUnreadMsgNumService topicHasUnreadMsgNumService;
	
	/**
	 * 发起群聊话题
	 * @param session
	 * @param message
	 */
	@WebSocketMethodAnnotation(ws_interface_mapping = "1116-1")
	public void createTopic(WebSocketSession session, TextMessage message){
		org.json.JSONObject obj = new org.json.JSONObject(message.getPayload());
		logger.debug("接收发起群聊话题的信息:"+obj.toString());
		String topic_name=obj.getString("topic_name");
		String creator_uid=obj.getString("creator_uid");
		String user_ids=obj.getString("user_ids");
		Date date = new Date();
		String create_datetime=DateTimeUtils.getTimeStrFromDate(date);
		long create_datetime_long=date.getTime();
		long endTimelong=date.getTime()+2*60*1000;//群聊话题失效时间
		date=new Date(endTimelong);
		String end_datetime=DateTimeUtils.getTimeStrFromDate(date);
		logger.debug("接收发起群聊话题的信息解析:topic_name="+topic_name+" creator_uid="+creator_uid
				+" user_ids="+user_ids+" create_datetime="+create_datetime
				+" end_datetime"+end_datetime);
		
		//topic表存储
		Topic topic=new Topic();
		String topic_id=String.valueOf(idWorker.nextId());
		logger.debug("topic_id="+topic_id);
		topic.setTopic_id(topic_id);
		topic.setTopic_name(topic_name);
		topic.setCreator_uid(creator_uid);
		topic.setCreate_datetime(create_datetime);
		topic.setEnd_datetime(end_datetime);
		topicDao.addTopic(topic);
		
		//这是创建人的信息，也要被存进去
		TopicUserMapping topicCreatorUserMapping=new TopicUserMapping();
		topicCreatorUserMapping.setTopic_id(topic_id);
		topicCreatorUserMapping.setUser_id(creator_uid);
		topicCreatorUserMapping.setUser_type("ENTRANT");
		topicUserMappingDao.addTopicUserMapping(topicCreatorUserMapping);
		
		//topic_user_mapping表存储
		String []userIdArray=user_ids.split(",");
		for(int i=0;i<userIdArray.length;i++){
			String user_id=userIdArray[i].toString();
			logger.debug("user_id="+user_id);
			TopicUserMapping topicUserMapping=new TopicUserMapping();
			topicUserMapping.setTopic_id(topic_id);
			topicUserMapping.setUser_id(user_id);
			topicUserMapping.setUser_type("INVITING");
			topicUserMappingDao.addTopicUserMapping(topicUserMapping);
		}
		
		//2018.04.02  将创建话题时的邀请消息存储为系统消息,内容是"你创建了群聊话题[topic_name]"
		TopicChatmsg topicChatmsg=new TopicChatmsg();
		String chatmsg_id=String.valueOf(idWorker.nextId());
		String chatmsg_content="你创建了群聊话题["+topic_name+"]";
		topicChatmsg.setChatmsg_id(chatmsg_id);
		topicChatmsg.setChatmsg_content(chatmsg_content);
		topicChatmsg.setType("SYSTEM");
		topicChatmsg.setSend_uid(creator_uid);
		topicChatmsg.setTopic_id(topic_id);
		topicChatmsg.setCreate_datetime(create_datetime);
		topicChatmsg.setCreate_datetime_long(create_datetime_long);
		topicChatMsgDao.addTopicChatmsg(topicChatmsg);
		
		//返回表示发起群聊话题成功
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1116-2");
		returnJson.put("topic_name", topic_name);
		returnJson.put("topic_id", topic_id);
		returnJson.put("chatmsg_content", chatmsg_content);
		returnJson.put("create_datetime", create_datetime);
		socketService.chat2one(session, returnJson);
	}
	
	/**
	 * 发送群聊消息
	 * @param session
	 * @param message
	 */
	@WebSocketMethodAnnotation(ws_interface_mapping = "1117-1")
	public void sendTopicMsg(WebSocketSession session, TextMessage message){
		org.json.JSONObject obj = new org.json.JSONObject(message.getPayload());
		logger.debug("发送群聊信息:"+obj.toString());
		String chatmsg_id=String.valueOf(idWorker.nextId());
		String chatmsg_content=obj.getString("chatmsg_content");
		String type=obj.getString("type");
		String send_uid=obj.getString("send_uid");
		String topic_id=obj.getString("topic_id");
		Date date = new Date();
		String create_datetime=DateTimeUtils.getTimeStrFromDate(date);
		long create_datetime_long=date.getTime();
		
		//存储topic_chatmsg表
		TopicChatmsg topicChatmsg=new TopicChatmsg();
		topicChatmsg.setChatmsg_id(chatmsg_id);
		topicChatmsg.setChatmsg_content(chatmsg_content);
		topicChatmsg.setType(type);
		topicChatmsg.setSend_uid(send_uid);
		topicChatmsg.setTopic_id(topic_id);
		topicChatmsg.setCreate_datetime(create_datetime);
		topicChatmsg.setCreate_datetime_long(create_datetime_long);
		topicChatMsgDao.addTopicChatmsg(topicChatmsg);
		
		//根据type来区分发送给哪些userid
		List<TopicUserMapping> topicUserMappingList;
		if(type.equals("INVITE")){//表示创建群聊话题的第一句话
			topicUserMappingList=topicUserMappingDao.findTopicUserMappingByTopicIdAndUserType(topic_id,"INVITING");
		}else{
			topicUserMappingList=topicUserMappingDao.findTopicUserMappingByTopicIdAndUserType(topic_id, "ENTRANT");
		}

		List<String> userIdList=new ArrayList<String>();
		for(TopicUserMapping topicUserMapping:topicUserMappingList){
			userIdList.add(topicUserMapping.getUser_id());
		}
		
		List<WebSocketSession> receivers = new ArrayList<WebSocketSession>();//存储话题中的在线用户
		List<Long> offlineUserids = new ArrayList<Long>();//存储话题中的离线用户
		getOnLineReceivers(receivers, offlineUserids, userIdList);
		
		String send_name=obj.getString("send_name");
		String send_userImage=obj.getString("send_userImage");
		/**
		 * 发送消息
		 */
		sendMsgs(receivers,topic_id,send_uid,send_name,send_userImage,chatmsg_content,chatmsg_id,create_datetime,type);//给话题中的在线用户发消息
		String topic_name=obj.getString("topic_name");
		/**
		 * 在普通发言中发送给离线人员模版消息
		 * @author 叶夷
		 */
		sendofflineMsgs(send_uid,offlineUserids,chatmsg_content,send_name,topic_name);
		
		/**
		 * 保存待确认回复消息到队列中
		 */
		for(long userId:offlineUserids){
			saveUnreadMsgs(Long.valueOf(chatmsg_id),Long.valueOf(topic_id),userId);		
		}
	}
	
	/**
	 * 接受或拒绝邀请这个接口不需要
	 * @param session
	 * @param message
	 */
	@WebSocketMethodAnnotation(ws_interface_mapping = "1118-1")
	public void entrantOrRejectTopic(WebSocketSession session, TextMessage message){
		org.json.JSONObject obj = new org.json.JSONObject(message.getPayload());
		logger.debug("接受或拒绝邀请数据:"+obj.toString());
		String topic_id=obj.getString("topic_id");
		String user_id=obj.getString("user_id");
		String user_type=obj.getString("user_type");
		
		TopicUserMapping topicUserMapping=topicUserMappingDao.findTopicUserMappingByTopicIdAndUserId(topic_id, user_id);
		if(topicUserMapping!=null){
			topicUserMapping.setUser_type(user_type);
			topicUserMappingDao.updateTopicUserMapping(topicUserMapping);
		}
	}
	
	/**
	 * 获得话题的所有历史消息
	 * @param session
	 * @param message
	 */
	@WebSocketMethodAnnotation(ws_interface_mapping = "1119-1")
	public void getTopicHistoryMsg(WebSocketSession session, TextMessage message){
		org.json.JSONObject obj = new org.json.JSONObject(message.getPayload());
		logger.debug("获得话题的所有历史消息:"+obj.toString());
		String requestUserid=obj.getString("userid");//获得请求历史消息的userid
		String topic_id=obj.getString("topic_id");
		long create_datetime_long=obj.getLong("create_datetime_long");//这是上一次请求的最后一条历史消息的时间
		int msgCount=obj.getInt("msgCount");//一次查询显示的历史消息数
		List<TopicChatmsg> topicChatmsgList = null;
		
		//通过topic_user_mapping中的user_type判断，如果是创建话题的人和接受邀请的人，则所有消息都能看见；如果是刚被邀请的人，则可以看见邀请消息
		Topic topic=topicDao.findUserByTopicId(topic_id);
		String creator_uid=topic.getCreator_uid();//创建人的id
		TopicUserMapping topicUserMapping=topicUserMappingDao.findTopicUserMappingByTopicIdAndUserId(topic_id, requestUserid);
		String userType=topicUserMapping.getUser_type();
		if(creator_uid.equals(requestUserid) || userType.equals("ENTRANT")){
			topicChatmsgList=topicChatMsgDao.findTopicChatmsgByHistory(topic_id,create_datetime_long,msgCount);
		}else if(userType.equals("INVITING")){
			topicChatmsgList=topicChatMsgDao.findTopicChatmsgByTopicIdAndMsgType(topic_id, "INVITE");
		}
		
		JSONArray chatmsgJSONArray=new JSONArray();
		for(TopicChatmsg topicChatmsg:topicChatmsgList){
			JSONObject chatmsgReturnJSON = new JSONObject();
			String userid=topicChatmsg.getSend_uid();//发送此条消息的userid
			User user=userService.findUser(Long.valueOf(userid));
			String name=user.getName();
			String chatmsg_content=topicChatmsg.getChatmsg_content();
			String userImage=user.getImgUrl();
			String chatmsg_id=topicChatmsg.getChatmsg_id();
			String create_time=topicChatmsg.getCreate_datetime();
			long create_time_long=topicChatmsg.getCreate_datetime_long();
			String msg_type=topicChatmsg.getType();
			chatmsgReturnJSON.put("from_user_name", name);
			chatmsgReturnJSON.put("msg", chatmsg_content);
			chatmsgReturnJSON.put("from_user_imgUrl", userImage);
			chatmsgReturnJSON.put("msg_id", chatmsg_id);
			chatmsgReturnJSON.put("from_user_id", userid);
			chatmsgReturnJSON.put("create_time", create_time);
			chatmsgReturnJSON.put("create_time_long", create_time_long);
			chatmsgReturnJSON.put("msg_type", msg_type);
			chatmsgJSONArray.put(chatmsgReturnJSON);
		}
		
		JSONObject chatmsgAllJSON = new JSONObject();
		chatmsgAllJSON.put("_interface", "1119-2");
		chatmsgAllJSON.put("topic_id", topic_id);
		chatmsgAllJSON.put("chatmsgJSONArray", chatmsgJSONArray);
		socketService.chat2one(session, chatmsgAllJSON);
		
		//清空话题下的未读消息(方法里并同时删除掉了记录的未读消息总数)
		topicHasUnreadMsgNumService.deleteUserUnreadTopicMsgByTopicid(Long.valueOf(topic_id));
		userUnreadMsgService.deleteUnreadMsgs(Long.valueOf(topic_id));
	}
	
	/**
	 * 获得所有的话题
	 * @param session
	 * @param message
	 */
	@WebSocketMethodAnnotation(ws_interface_mapping = "1120-1")
	public void getAllTopic(WebSocketSession session, TextMessage message){
		org.json.JSONObject obj = new org.json.JSONObject(message.getPayload());
		logger.debug("获得所有的话题:"+obj.toString());
		String userid=obj.getString("userid");
		String normalDialogList=obj.getString("normalDialogList");
		JSONArray normalDialogJSONArray=new JSONArray();
		Object json = new JSONTokener(normalDialogList).nextValue();//这是用来判断传来的字符串是否是jsonarray形式
		logger.info("json instanceof JSONArray="+(json instanceof JSONArray));
		if(json instanceof JSONArray){
			normalDialogList=obj.getString("normalDialogList");
			normalDialogJSONArray=new JSONArray(normalDialogList);
		}
		logger.info("normalDialogList="+normalDialogList+" normalDialogJSONArray="+normalDialogJSONArray.toString());
		List<Topic> topicList=topicDao.findUserByCreatorUid(userid);
		JSONArray chatmsgJSONArray=new JSONArray();
		for(Topic topic:topicList){
			JSONObject chatmsgReturnJSON = new JSONObject();
			
			String topic_id=topic.getTopic_id();
			logger.info("topic_id="+topic_id);
			//通过topic和userid判断用户是否已经拒绝，已经拒绝的用户不能获得此话题
			TopicUserMapping topicUserMapping=topicUserMappingDao.findTopicUserMappingByTopicIdAndUserId(topic_id, userid);
			String userType=topicUserMapping.getUser_type();
			logger.info("userType="+userType);
			if(!userType.equals("REJECT")){
				String topic_name=topic.getTopic_name();
				//String topic_img=userService.findUser(Long.valueOf(userid)).getImgUrl();
				TopicChatmsg newTopicChatmsg=topicChatMsgDao.findNewTopicChatmsgByTopicId(topic_id);//获得话题最新的一条信息
				//String chatmsg_id=newTopicChatmsg.getChatmsg_id();
				String chatmsg_content=newTopicChatmsg.getChatmsg_content();
				//String send_username=userService.findUser(Long.valueOf(newTopicChatmsg.getSend_uid())).getName();
				String topic_img=userService.findUser(Long.valueOf(newTopicChatmsg.getSend_uid())).getImgUrl();//是最新消息的发送者的头像
				String createTime=newTopicChatmsg.getCreate_datetime();
				
				//获得话题的未读消息数
				List<TopicHasUnreadMsgNum> topicHasUnreadMsgNumArray=topicHasUnreadMsgNumService.findUserHasUnreadMsgTopicByUserid(Long.valueOf(userid));
				for(TopicHasUnreadMsgNum topicHasUnreadMsgNum:topicHasUnreadMsgNumArray){
					if(topic_id.equals(topicHasUnreadMsgNum.getTopicid())){
						int unreadNum=topicHasUnreadMsgNum.getUnreadNum();
						if(unreadNum>0){
							chatmsgReturnJSON.put("unreadNum", unreadNum);
						}
						break;
					}
				}
				//这里为了保持和发宝哥的请求聊天列表接口一致，保持和其接口一致的名称
				/*{"to_user_id":"",
					"msg":"",
					"create_time":"",
					"ifread":"已读",
					"to_user_name":"",
					"to_user_imgUrl":""},*/
				chatmsgReturnJSON.put("to_user_id", topic_id);
				chatmsgReturnJSON.put("msg", chatmsg_content);
				chatmsgReturnJSON.put("create_time", createTime);
				chatmsgReturnJSON.put("ifread", "已读");//这里我没有判断，直接是已读
				chatmsgReturnJSON.put("to_user_name", topic_name);
				chatmsgReturnJSON.put("to_user_imgUrl", topic_img);
				chatmsgReturnJSON.put("isTopic", true);//标记是否为话题
				chatmsgJSONArray.put(chatmsgReturnJSON);
			}
		}
		logger.info("chatmsgReturnJSON="+chatmsgJSONArray);
		
		List<JSONObject> allDialogJSONArray=new ArrayList<JSONObject>();//这是话题聊天列表和普通聊天列表放在一起的json数组
		for(int i=0;i<normalDialogJSONArray.length();i++){
			allDialogJSONArray.add(normalDialogJSONArray.getJSONObject(i));
		}
		for(int i=0;i<chatmsgJSONArray.length();i++){
			allDialogJSONArray.add(normalDialogJSONArray.getJSONObject(i));
		}
		//将话题列表通过时间排序
		Collections.sort(allDialogJSONArray, new Comparator<JSONObject>() {

			@Override
			public int compare(JSONObject arg0, JSONObject arg1) {
				Date do1 = null,do2 = null;
				try {
					do1 = DateTimeUtils.getCurrentDateTimeObj(arg0.get("create_time").toString());
					do2=DateTimeUtils.getCurrentDateTimeObj(arg1.get("create_time").toString());
				} catch (ParseException e) {
					logger.error("获取所有话题时string转date报错"+e);
				}
            	if(do1.getTime()>do2.getTime()){
            		return -1;
            	}else if(do1.getTime()<do2.getTime()){
            		return 1;
            	}else{
            		return 0;
            	}
			}
		});
		
		logger.info("allDialogJSONArray="+allDialogJSONArray.toString());
		JSONObject chatmsgAllJSON = new JSONObject();
		chatmsgAllJSON.put("_interface", "1120-2");
		//chatmsgAllJSON.put("userid", userid);
		chatmsgAllJSON.put("chatmsgJSONArray", allDialogJSONArray.toString());
		socketService.chat2one(session, chatmsgAllJSON);
		
		/**
		 * 清除待确认队列中的消息
		 */
		TopicUnreadMsgQueue.delAllUserzUnreadMsgs(Long.valueOf(userid));
		topicHasUnreadMsgNumService.deleteUserUnReadTopicMsgByUserid(Long.valueOf(userid));
		userUnreadMsgService.deleteUserAllUnreadMsgs(Long.valueOf(userid));
	}
	
	//确认收到消息
	@WebSocketMethodAnnotation(ws_interface_mapping = "1121-1")
	private void msg_received_confirm(WebSocketSession session, TextMessage message){
		// 获取数据
		org.json.JSONObject params = new org.json.JSONObject(message.getPayload());
		Long msgid = params.getLong("msg_id");
		Long target_topicid = params.getLong("target_topicid");
		Long userid = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		
		//确认未读消息
		TopicUnreadMsgQueue.confirmMsg(userid,target_topicid,msgid);
		
		//删除确认收到的一条 未读消息
		userUnreadMsgService.deleteOneUnreadMsg(target_topicid, msgid);
		//从话题下的总未读消息数下减1
		topicHasUnreadMsgNumService.recordUnReadMsgDecreaseOne(userid,target_topicid);
	}
	
	private void getOnLineReceivers(List<WebSocketSession> receivers, List<Long> offlineUserids,List<String> userIdList) {
		for (String userid : userIdList) {
			Long useridLong=Long.valueOf(userid);
			logger.debug("判断是离线还是在线 ：useridLong=" + useridLong);
			WebSocketSession user = EchoWebSocketHandler.getUserById(useridLong);
			if (user == null) {
				logger.debug("离线 ：useridLong=" + useridLong);
				//离线
				offlineUserids.add(useridLong);
			} else {
				logger.debug("在线 ：useridLong=" + useridLong);
				// 在线
				receivers.add(user);
			}
		}
		logger.debug("off line user size: " + offlineUserids.size());
	}
	
	private void sendMsgs(List<WebSocketSession> receivers,String topic_id,String send_uid,String send_name,String send_userImage,String chatmsg_content,String chatmsg_id,String create_datetime,String type) {
		logger.debug("在线普通发言");
		logger.debug("在线 人数" + receivers.size());
		//遍历每个receivers
		for(int i = 0;i<receivers.size();i++){
			WebSocketSession user = receivers.get(i);
			JSONObject chatmsgReturnJSON = buildChatmsgReturnJSON(topic_id,send_uid,send_name,send_userImage,chatmsg_content,chatmsg_id,create_datetime,type);
			logger.debug("在线发送消息的json数据：" + chatmsgReturnJSON.toString());
			socketService.chat2one(user,chatmsgReturnJSON);
		}
	}
	
	private JSONObject buildChatmsgReturnJSON(String topic_id,String send_uid,String send_name,String send_userImage,String chatmsg_content,String chatmsg_id,String create_datetime,String type) {
		JSONObject chatmsgReturnJSON = new JSONObject();
		chatmsgReturnJSON.put("_interface", "1117-2");
		JSONObject userObject=new JSONObject();
		userObject.put("userId", send_uid);
		userObject.put("name", send_name);
		userObject.put("imgUrl", send_userImage);
		chatmsgReturnJSON.put("user", userObject);
		chatmsgReturnJSON.put("window_id", topic_id);
		chatmsgReturnJSON.put("handler", chatmsg_id);
		chatmsgReturnJSON.put("data", chatmsg_content);
		chatmsgReturnJSON.put("msgtype", type);
		chatmsgReturnJSON.put("timestr", create_datetime);
		chatmsgReturnJSON.put("isTopic", true);
		return chatmsgReturnJSON;
	}
	
	/**
	 * 遍历话题中离线用户集合,然后将普通发言用模版消息发送
	 * @author 叶夷
	 */
	private void sendofflineMsgs(String userid,List<Long> offlineUserids,String content,String username,String topic_name) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");//设置日期格式
		for(Long touserid:offlineUserids){
			User touser=userService.findUser(touserid);
			String toopenid=touser.getOpenid();
			logger.debug("模版消息接口被调用时获取的openid：toopenid="+toopenid);
			//2018.01.05 叶夷   确保openid不为空才进行后面操作
			if(toopenid!=null && !toopenid.equals("") && !toopenid.equals("\"\"")){
				//2018.01.04 叶夷  通过usergroup来获取接者所需的模版消息信息
				String usergroup=touser.getUserGroup();
				logger.debug("usergroup="+usergroup);
				WeChatProperties weChatProperties=weChatPropertiesService.getDataFromUserGroup(usergroup);
				String templateid=weChatProperties.getTemplateid();
				String templateurl=weChatProperties.getTemplateurl();
				String appid=weChatProperties.getAppid();
				String appsecret=weChatProperties.getAppsecret();
				logger.debug("模版消息信息通过usergroup获取：usergroup="+usergroup
						+" templateid="+templateid
						+" templateurl="+templateurl
						+" appid="+appid
						+" appsecret="+appsecret);
				
				logger.debug("模版消息接口被调用时获取username:username="+username);
				
				weChatService.sendWechatmsgToUser(
						toopenid, 
						templateid, 
						templateurl,
						"#FF0000",
						username/*+"["+sameSelectTagList+"]"*/,
						"在话题["+topic_name+"]中给你发了一条消息", 
						df.format(new Date()),
						content,
						appid,
						appsecret);
			}
		}
	}
	
	//保存未读消息
	private void saveUnreadMsgs(Long msg_id, Long topicid,Long userid) {
		TopicUnreadMsg um = new TopicUnreadMsg();
		um.setMsgid(msg_id);
		um.setTopicid(topicid);
		um.setUserid(userid);
		userUnreadMsgService.addUnreadMsg(um);
	}
}

package so.xunta.websocket.controller;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.User;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.server.SocketService;
import so.xunta.server.UserService;
import so.xunta.websocket.config.Constants;

/**
 * @author Bright_zheng
 * */
@WebSocketTypeAnnotation
@Component
public class InitUserWSController {
	Logger logger =Logger.getLogger(InitUserWSController.class);
	
	@Autowired
	private UserService userService;
	@Autowired
	private SocketService socketService;
	

	@WebSocketMethodAnnotation(ws_interface_mapping = "1114-1")
	public void ifUserInited(WebSocketSession session, TextMessage message){
		Long userId = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		User user = userService.findUser(userId);
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1114-2");
		returnJson.put("if_user_inited", user.getIfInitedTopics());
		socketService.chat2one(session, returnJson);
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "9115-1")
	public void userSawFirst(WebSocketSession session, TextMessage message){
		Long userId = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		logger.info("用户"+userService.findUser(userId).getName()+"点击了引导页下一步");
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "9116-1")
	public void userClickRecommendedCP(WebSocketSession session, TextMessage message){
		Long userId = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		User user = userService.findUser(userId);
		logger.info("用户"+user.getName()+"不知道添加什么CP");
		user.setIfInitedTopics(1);
		userService.updateUser(user);	
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "9117-1")
	public void userAddCpAfterGuide(WebSocketSession session, TextMessage message){
		Long userId = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		User user = userService.findUser(userId);
		logger.info("用户"+user.getName()+"看完引导添加了一个CP");
		user.setIfInitedTopics(1);
		userService.updateUser(user);	
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "9118-1")
	public void userStartTopic(WebSocketSession session, TextMessage message){
		Long userId = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		User user = userService.findUser(userId);
		logger.info("用户"+user.getName()+"发起了一个群聊");
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "9119-1")
	public void userClickTopic(WebSocketSession session, TextMessage message){
		Long userId = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		User user = userService.findUser(userId);
		logger.info("用户"+user.getName()+"点了群聊键");
	}
}

package so.xunta.websocket.controller;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.User;
import so.xunta.beans.WeChatProperties;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.server.SocketService;
import so.xunta.server.UserService;
import so.xunta.server.WeChatPropertiesService;
import so.xunta.server.WeChatService;
import so.xunta.utils.CreateTemporaryTwoBarCodeUtil;
import so.xunta.websocket.config.Constants;

/**
 * @author Bright_zheng
 * */
@WebSocketTypeAnnotation
@Component
public class ShowUserWeiXinCodeController {
	Logger logger =Logger.getLogger(ShowUserWeiXinCodeController.class);
	
	@Autowired
	private SocketService socketService;
	@Autowired
	private UserService userService;
	@Autowired
	private WeChatPropertiesService weChatPropertiesService;
	@Autowired
	private WeChatService weChatService;
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1115-1")
	public void ReturnUserWeiXinCode(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		String matched_user_id=params.get("matched_user_id").toString();
		logger.debug("1115-1  matched_user_id="+matched_user_id);
		Long userId = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		User user = userService.findUser(userId);
		String qRCodeUrl = user.getWeChatQRCodeUrl();
		
		if(qRCodeUrl == null){
			String userGroup = user.getUserGroup();
			
			WeChatProperties weChatProperties = weChatPropertiesService.getDataFromUserGroup(userGroup);
			String accessToken = weChatService.getToken(weChatProperties.getAppid(), weChatProperties.getAppsecret());
			
			String sceneStr = userId+"";
			//2018.03.21  叶夷    将二维码参数转为json在转为string传送
			JSONObject sceneStrJson=new JSONObject();
			sceneStrJson.put("userId", sceneStr);
			qRCodeUrl = CreateTemporaryTwoBarCodeUtil.getTicket(accessToken, sceneStrJson.toString());
			user.setWeChatQRCodeUrl(qRCodeUrl);
			userService.updateUser(user);
		}
		
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1115-2");
		returnJson.put("weChatQRCodeUrl", qRCodeUrl);
		returnJson.put("matched_user_id", matched_user_id);
		socketService.chat2one(session, returnJson);
	}
}

package so.xunta.websocket.controller;

import java.util.List;

import org.json.JSONArray;
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

/**
 * @author Bright_zheng
 * */
@WebSocketTypeAnnotation
@Component
public class RequestUserListWSController {
	@Autowired
	private UserService userService;
	@Autowired
	private SocketService socketService;
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "9101-1")
	public void reponseTestUserList(WebSocketSession session, TextMessage message){
		List<User> users = userService.findAllUsers();
		JSONArray uidArr = new JSONArray();
		for(User user:users){
			String uid = user.getUserId().toString();
			if(uid.equals(1)){
				continue;
			}
			JSONObject userJson = new JSONObject();
			userJson.put("userId", uid);
			uidArr.put(userJson);
		}
		
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "9101-2");
		returnJson.put("uid_arr",uidArr);
		socketService.chat2one(session, returnJson);
	}
}

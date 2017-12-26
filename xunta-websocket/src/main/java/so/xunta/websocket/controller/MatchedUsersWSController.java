package so.xunta.websocket.controller;

import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.User;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.server.ResponseMatchedUsersService;
import so.xunta.server.SocketService;
import so.xunta.server.UserService;
import so.xunta.websocket.config.Constants;


/**
 * @author Bright_zheng
 * 
 * */
@WebSocketTypeAnnotation
@Component
public class MatchedUsersWSController {
	@Autowired
	private ResponseMatchedUsersService responseMatchedUsersService;
	@Autowired
	private SocketService socketService;
	@Autowired
	private UserService userService;
	
	Logger logger =Logger.getLogger(MatchedUsersWSController.class);

	@WebSocketMethodAnnotation(ws_interface_mapping = "1104-1")
	public void responseMatchedUsers(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		int topNum = params.getInt("top_num");
		String timestamp = params.getString("timestamp"); //以后再处理
		
		List<User> matchedUsers = responseMatchedUsersService.getMatchedUsers(uid, topNum);
		
		JSONArray matchedUserArr = new JSONArray();
		for(User matchedUser:matchedUsers){
			JSONObject userJson = new JSONObject();
			userJson.put("userid",matchedUser.getUserId()+"");
			userJson.put("username",matchedUser.getName());
			userJson.put("img_src",matchedUser.getImgUrl());
			matchedUserArr.put(userJson);
		}
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1104-2");
		returnJson.put("uid", uid+"");
		returnJson.put("top_num", topNum);
		returnJson.put("timestamp", timestamp);
		returnJson.put("matched_user_arr", matchedUserArr);
		socketService.chat2one(session, returnJson);
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1111-1")
	public void responseDetialMatchedUsers(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		String userId = params.getString("uid");
		int requsetCounts = params.getInt("request_counts");
		String timestamp = params.getString("timestamp");

		if(userId==null || requsetCounts == 0){
			return;
		}
		JSONArray matchedUsersWithCp = responseMatchedUsersService.getMatchedUsersWithCPJSONArr(userId, requsetCounts);
	    
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1111-2");
		returnJson.put("interface_name", "response_detail_matched_users");
		returnJson.put("timestamp", timestamp);
		returnJson.put("matched_user_arr",matchedUsersWithCp);
		socketService.chat2one(session, returnJson);
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1112-1")
	public void responseMatchedUserCps(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		String myUserId = params.getString("my_user_id");
		String matchedUserId = params.getString("matched_user_id");
		String timestamp = params.getString("timestamp");
		
		JSONArray matechedUserWithCps= responseMatchedUsersService.getMatchedUserWithCPJSONArr(myUserId, matchedUserId);
		
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1112-2");
		returnJson.put("interface_name", "response_matched_user_cps");
		returnJson.put("my_user_id", myUserId);
		returnJson.put("matched_user_id",matchedUserId);
		returnJson.put("timestamp", timestamp);
		returnJson.put("msg",matechedUserWithCps);
		socketService.chat2one(session, returnJson);
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1110-1")
	public void wantTalk(WebSocketSession session, TextMessage message){
		Long userId = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		logger.info("用户"+userService.findUser(userId).getName()+"点击了某匹配人头像");
	}
	
}

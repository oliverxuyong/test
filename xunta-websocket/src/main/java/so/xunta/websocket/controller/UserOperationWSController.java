package so.xunta.websocket.controller;

import java.io.IOException;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.User;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;

import so.xunta.server.UserService;


import so.xunta.utils.IdWorker;


/**
 * @author root
 *
 */
@WebSocketTypeAnnotation
@Component
public class UserOperationWSController {
	IdWorker idWorker = new IdWorker(1L, 1L);

	@Autowired
	private UserService userService;

	Logger logger =Logger.getLogger(UserOperationWSController.class);
	
	
	/**
	 * 用户更改用户名
	 * @param session
	 * @param message
	 */
	@WebSocketMethodAnnotation(ws_interface_mapping = "update_nickname")
	public void update_username(WebSocketSession session, TextMessage message){
		org.json.JSONObject obj = new org.json.JSONObject(message.getPayload());
		System.out.println("接收参数:"+obj.toString(2));
		try {
			String _p_new_nickname = obj.get("new_name").toString();
			Long _p_uid = Long.valueOf(obj.get("uid").toString());
			
			//查重
			User u = userService.findUserByName(_p_new_nickname);
			if(u==null){
				//用户名不重复，更新用户名
				u = userService.findUser(_p_uid);
				u.setName(_p_new_nickname);
				userService.updateUser(u);
				//回复
				JSONObject ret_msg0 = new JSONObject();
				ret_msg0.put("_interface","update_nickname").put("status","0").put("new_name",_p_new_nickname);
				session.sendMessage(new TextMessage(ret_msg0.toString(2)));
			}else{
				//回复
				JSONObject ret_msg1 = new JSONObject();
				ret_msg1.put("_interface","update_nickname").put("status","1");
				session.sendMessage(new TextMessage(ret_msg1.toString(2)));
			}
			
		} catch (NumberFormatException e) {
			JSONObject ret_msg1 = new JSONObject();
			ret_msg1.put("_interface","update_nickname").put("status","2");
			try {
				session.sendMessage(new TextMessage(ret_msg1.toString(2)));
			} catch (JSONException | IOException e1) {
				e1.printStackTrace();
			}
		} catch (JSONException e) {
			JSONObject ret_msg1 = new JSONObject();
			ret_msg1.put("_interface","update_nickname").put("status","2");
			try {
				session.sendMessage(new TextMessage(ret_msg1.toString(2)));
			} catch (JSONException | IOException e1) {
				e1.printStackTrace();
			}
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	} 
	
}

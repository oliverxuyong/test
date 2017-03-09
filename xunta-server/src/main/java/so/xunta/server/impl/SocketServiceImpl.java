package so.xunta.server.impl;

import java.io.IOException;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.server.SocketService;

/**
 * 普通聊天或系统管理员推消息用
 * @author Thinkpad
 *
 */
@Service
public class SocketServiceImpl implements SocketService {

	@Override
	public void chat2one(WebSocketSession receiver, JSONObject msg) {
		System.out.println("chat2one: "+msg);
		try {
			if(receiver.isOpen()){
				receiver.sendMessage(new TextMessage(msg.toString()));
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public void chat2one(WebSocketSession receiver, JSONArray msg) {
		try {
			if(receiver.isOpen()){
				receiver.sendMessage(new TextMessage(msg.toString()));
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void chat2many(List<WebSocketSession> receivers, JSONObject msg) {
		for(WebSocketSession receiver:receivers){
			chat2one(receiver, msg);
		}
	}

}

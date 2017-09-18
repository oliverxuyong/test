package so.xunta.server.impl;

import java.io.IOException;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
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
	Logger logger =Logger.getLogger(SocketServiceImpl.class);

	@Override
	public void chat2one(WebSocketSession receiver, JSONObject msg) {
		logger.info("chat2one: "+msg);
		
		synchronized (receiver) {
			if(receiver.isOpen()){
				try {
					receiver.sendMessage(new TextMessage(msg.toString()));
				} catch (IOException e) {
					logger.error("发送失败"+e.getMessage(),e);
					try {
						receiver.close(CloseStatus.SERVICE_RESTARTED);
					} catch (IOException e1) {
						logger.error(e1.getMessage(),e1);
					}
				}
			}
		}		
		
	}
	
	@Override
	public void chat2one(WebSocketSession receiver, JSONArray msg) {
		synchronized (receiver) {
			if(receiver.isOpen()){
				try {
					receiver.sendMessage(new TextMessage(msg.toString()));
				} catch (IOException e) {
					logger.error("发送失败"+e.getMessage(),e);
					try {
						receiver.close(CloseStatus.SERVICE_RESTARTED);
					} catch (IOException e1) {
						logger.error(e1.getMessage(),e1);
					}
				}
			}
		}		
	}

	@Override
	public void chat2many(List<WebSocketSession> receivers, JSONObject msg) {
		for(WebSocketSession receiver:receivers){
			chat2one(receiver, msg);
		}
	}

}

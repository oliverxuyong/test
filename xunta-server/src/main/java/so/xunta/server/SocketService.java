package so.xunta.server;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.socket.WebSocketSession;

/**
 * websocket发送消息接口
 * @author Thinkpad
 *
 */
public interface SocketService {
	/**
	 * 给一个人发消息
	 * @param receiver
	 * @param msg
	 */
	public void chat2one(WebSocketSession receiver,JSONObject msg);
	public void chat2one(WebSocketSession receiver, JSONArray msg);
	
	/**
	 * 给多人发消息,不同的人不同的topicid
	 * @param receivers
	 * @param msg
	 */
	public void chat2many(List<WebSocketSession> receivers,JSONObject msg);
	
}

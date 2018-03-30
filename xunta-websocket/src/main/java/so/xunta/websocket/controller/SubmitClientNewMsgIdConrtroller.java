package so.xunta.websocket.controller;

import java.io.UnsupportedEncodingException;
import java.util.List;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import so.xunta.beans.TopicHasUnreadMsgNum;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.server.SocketService;
import so.xunta.server.TopicHasUnreadMsgNumService;
import so.xunta.utils.IdWorker;
import so.xunta.websocket.config.Constants;

@WebSocketTypeAnnotation
@Component
public class SubmitClientNewMsgIdConrtroller {
	IdWorker idWorker = new IdWorker(1L, 1L);

	@SuppressWarnings("unused")
	private static final Logger logger;

	static {
		logger = Logger.getRootLogger();
	}

	@Autowired
	private SocketService socketService;
	
	@Autowired
	private TopicHasUnreadMsgNumService topicHasUnreadMsgNumService;
	

	//用户上线时接收未读消息总数
	@WebSocketMethodAnnotation(ws_interface_mapping = "submit_client_new_msg_id")
	private void submit_client_new_msg_id2(WebSocketSession session, TextMessage message) throws UnsupportedEncodingException {
		Long userid = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		List<TopicHasUnreadMsgNum> topicHasUnreadMsgNumList = topicHasUnreadMsgNumService.findUserHasUnreadMsgTopicByUserid(userid);
		int allUnreadNum=0;
		
		for(TopicHasUnreadMsgNum topicHasUnreadMsgNum:topicHasUnreadMsgNumList){
			allUnreadNum=allUnreadNum+topicHasUnreadMsgNum.getUnreadNum();
		}
		
		JSONObject chatmsgReturnJSON = new JSONObject();
		chatmsgReturnJSON.put("_interface", "1121-2");
		chatmsgReturnJSON.put("allUnreadNum", allUnreadNum);
		socketService.chat2one(session, chatmsgReturnJSON);
	}

}

package so.xunta.websocket.task;

import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.PushMatchedUserDTO;
import so.xunta.beans.RecommendPushDTO;
import so.xunta.server.RecommendPushService;
import so.xunta.server.RecommendService;
import so.xunta.server.SocketService;
import so.xunta.websocket.echo.EchoWebSocketHandler;

public class RecommendU2uUpdateTask implements Runnable {
	private RecommendService recommendService;
	private String uid;
	private SocketService socketService;
	private RecommendPushService recommendPushService;
	
	Logger logger =Logger.getLogger(RecommendU2uUpdateTask.class);
	
	public RecommendU2uUpdateTask(String uid,RecommendService recommendService, SocketService socketService,
			RecommendPushService recommendPushService){
		this.uid = uid;
		this.recommendService = recommendService;
		this.socketService = socketService;
		this.recommendPushService = recommendPushService;
	}

	public String getUid() {
		return uid;
	}

	@Override
	public void run() {
		if(uid!=null){
			if(recommendService.ifU2UUpdateExecutable(uid)){
			//	long startTime = System.currentTimeMillis();
				updateAndPush(uid);
			//	long endTime = System.currentTimeMillis();
			//	logger.info("用户:"+uid+"\n 更新U2U执行时间： "+(endTime-startTime)+"毫秒");
			}
		}else{
			logger.error("参数为空！放弃任务");
		}
	}

	private void updateAndPush(String uid){
		WebSocketSession userSession = EchoWebSocketHandler.getUserById(Long.valueOf(uid));
		if(userSession==null){
			return;
		}
		
		/*更新前记录一次状态*/
		Boolean ifLastPushComlepted = recommendPushService.recordUserStatusBeforeUpdateTask(uid);
		if(ifLastPushComlepted){
			Boolean isExecuted = recommendService.updateU2U(uid);
			if(isExecuted){
				/*更新后执行一次和原先状态比较，有一定变化则产生推送*/
				RecommendPushDTO recommendPushDTO = recommendPushService.generatePushUserAfterUpdateTask(uid);
				List<PushMatchedUserDTO> pushMatchedUserDTOs = recommendPushDTO.getPushMatchedUsers();
				if(pushMatchedUserDTOs!=null){
					logger.debug("用户"+uid+"的匹配用户发生改变");
					pushChangedMatchedUsers(pushMatchedUserDTOs,userSession);
				}
			}else{
				recommendPushService.clearPushUser(uid);
			}
		}else{
			logger.debug("用户:"+uid+" 之前的匹配用户推送任务还未结束，本次任务放弃！");
		}
	}
	
	private void pushChangedMatchedUsers(List<PushMatchedUserDTO> pushMatchedUserDTOs,WebSocketSession session){
		//String clientIP = session.getRemoteAddress().toString().substring(1);
		
		JSONArray newUserArr = new JSONArray();
		for(PushMatchedUserDTO matchedUserDTO:pushMatchedUserDTOs){
			String userId = matchedUserDTO.getUserid();
			if(userId==null){
				logger.debug("匹配用户减少为0");
				continue;
			}
			JSONObject pushMatchedUserJson = new JSONObject();
			pushMatchedUserJson.put("userid", userId);
			pushMatchedUserJson.put("username", matchedUserDTO.getUsername());
			pushMatchedUserJson.put("img_src", matchedUserDTO.getImg_src());
			pushMatchedUserJson.put("new_rank", matchedUserDTO.getNew_rank());
			newUserArr.put(pushMatchedUserJson);
		}
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "2106-1");
		returnJson.put("interface_name", "push_matched_user");
		returnJson.put("new_user_arr", newUserArr);
		socketService.chat2one(session, returnJson);
	//	loggerService.log(userId, userId, clientIP, returnJson.toString(), "2106-1", null, null);
	}
}

package so.xunta.websocket.task;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.PushMatchedUserDTO;
import so.xunta.beans.PushRecommendCpDTO;
import so.xunta.beans.RecommendPushDTO;
import so.xunta.server.RecommendService;
import so.xunta.server.SocketService;
import so.xunta.websocket.echo.EchoWebSocketHandler;


public class RecommendPushTask implements Runnable{
	private SocketService socketService;
	private RecommendService recommendService;	
	
	private String cpId;
	private String userId;
	
	Logger logger =Logger.getLogger(RecommendPushTask.class);
	
	public RecommendPushTask(RecommendService recommendService,String userId,String cpId, SocketService socketService) {
		this.recommendService=recommendService;
		this.userId=userId;
		this.cpId=cpId;
		this.socketService=socketService;
	}
	@Override
	public void run() {
		logger.info("==============================RecommendPushTask===================================");
		if(userId!=null &&cpId!=null){
			Set<String> pendingPushUids = recommendService.recordU2UChange(userId,cpId,RecommendService.SELECT_CP);
			
			//获得在线的匹配用户列表，触发他们的更新任务
			pendingPushUids.add(userId);
			filterOffLineUsers(pendingPushUids);
			for(String uid:pendingPushUids){
				RecommendPushDTO recommendPushDTO = recommendService.updateU2C(uid);
				List<PushMatchedUserDTO> pushMatchedUserDTOs = recommendPushDTO.getPushMatchedUsers();
				if(pushMatchedUserDTOs!=null){
					logger.info("给id为”"+uid+"“ 的用户产生了MatchedUsers推送");
					pushChangedMatchedUsers(pushMatchedUserDTOs,EchoWebSocketHandler.getUserById(Long.valueOf(uid)));
				}
				
				List<PushRecommendCpDTO> pushRecommendCpDTOs = recommendPushDTO.getPushMatchedCPs();
				if(pushRecommendCpDTOs!=null){
					logger.info("给id为”"+uid+"“ 的用户产生了CP推送,推送了 "+pushRecommendCpDTOs.size()+" 个");
					pushRecommendCps(pushRecommendCpDTOs,EchoWebSocketHandler.getUserById(Long.valueOf(uid)));
				}
			}
		}else{
			logger.info("参数为空！放弃任务");
		}
	}
	
	private void filterOffLineUsers(Set<String> userids) {
		Iterator<String> iterator = userids.iterator();
		while(iterator.hasNext()){
			String userid = iterator.next();
			Boolean exist = EchoWebSocketHandler.checkExist(userid);
			if(!exist){
				iterator.remove();
			}
		}
	}
	
	private void pushChangedMatchedUsers(List<PushMatchedUserDTO> pushMatchedUserDTOs,WebSocketSession session){
		
		JSONArray newUserArr = new JSONArray();
		for(PushMatchedUserDTO matchedUserDTO:pushMatchedUserDTOs){
			JSONObject pushMatchedUserJson = new JSONObject();
			pushMatchedUserJson.put("userid", matchedUserDTO.getUserid());
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
	}
	
	private void pushRecommendCps(List<PushRecommendCpDTO> pushRecommendCpDTOs,WebSocketSession session){
		if(session == null){
			logger.info("用户已下线，不再推送");
			return;
		}
		JSONArray cpWrap = new JSONArray();
	//	List<String> pushedCpIds = new LinkedList<String>();
		for(PushRecommendCpDTO pushRecommendCp:pushRecommendCpDTOs){
		//	pushedCpIds.add(pushRecommendCp.getCpId());
			
			JSONObject pushMatchedUserJson = new JSONObject();
			pushMatchedUserJson.put("cpid", pushRecommendCp.getCpId());
			pushMatchedUserJson.put("cptext", pushRecommendCp.getCpText());
			pushMatchedUserJson.put("howmanypeople_selected", pushRecommendCp.getSelectPepoleNum());
			cpWrap.put(pushMatchedUserJson);
		}
		// 暂时推送后不将cp置为显示
		//recommendService.signPushedCps();
		
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "2105-1");
		returnJson.put("interface_name", "PushCP");
		returnJson.put("cp_wrap", cpWrap);
		socketService.chat2one(session, returnJson);
	}

	public String getCpId() {
		return cpId;
	}

	public String getUserId() {
		return userId;
	}

}

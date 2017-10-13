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
import so.xunta.server.CpShowingService;
import so.xunta.server.RecommendPushService;
import so.xunta.server.RecommendService;
import so.xunta.server.SocketService;
import so.xunta.websocket.echo.EchoWebSocketHandler;


public class CpOperationPushTask implements Runnable{
	private SocketService socketService;
	private RecommendService recommendService;	
	private RecommendPushService recommendPushService;
	private CpShowingService cpShowingService;
	
	private String cpId;
	private String userId;
	private int selectType;
	private String property;
	
	Logger logger =Logger.getLogger(CpOperationPushTask.class);
	
	public CpOperationPushTask(RecommendService recommendService,RecommendPushService recommendPushService,
			CpShowingService cpShowingService, String userId,String cpId, int selectType, String property, SocketService socketService) {
		this.recommendService = recommendService;
		this.recommendPushService = recommendPushService;
		this.userId = userId;
		this.cpId = cpId;
		this.socketService = socketService;
		this.cpShowingService = cpShowingService;
		this.selectType = selectType;
		this.property = property;
	}
	
	public String getCpId() {
		return cpId;
	}

	public String getUserId() {
		return userId;
	}
	public int getSelectType() {
		return selectType;
	}
	public String getProperty() {
		return property;
	}

	@Override
	public void run() {
		logger.info("==============================CpOperationPushTask===================================");
		if(userId==null || cpId==null){
			logger.info("参数为空！放弃任务");
			return;
		}
		/*Step1：执行记录任务，返回和我相关的用户*/
		Set<String> pendingPushUids = recommendService.recordU2UChange(userId,cpId,property,selectType);
		
		/*Step2：获得在线的匹配用户列表，触发他们的更新任务*/
		pendingPushUids.add(userId);
		filterOffLineUsers(pendingPushUids);
		for(String uid:pendingPushUids){
			WebSocketSession userSession = EchoWebSocketHandler.getUserById(Long.valueOf(uid));
			if(userSession==null){
				continue;
			}
			
			/*更新前记录一次状态*/
			recommendPushService.recordStatusBeforeUpdateTask(uid,selectType);
			Boolean is_executed = recommendService.updateU2C(uid);
			if(is_executed){
				/*更新后执行一次和原先状态比较，有一定变化则产生推送*/
				RecommendPushDTO recommendPushDTO = recommendPushService.generatePushDataAfterUpdateTask(uid,selectType);
				List<PushMatchedUserDTO> pushMatchedUserDTOs = recommendPushDTO.getPushMatchedUsers();
				if(pushMatchedUserDTOs!=null){
					logger.info("给id为”"+uid+"“ 的用户产生了MatchedUsers推送");
					pushChangedMatchedUsers(pushMatchedUserDTOs,userSession);
				}
				
				List<PushRecommendCpDTO> pushRecommendCpDTOs = recommendPushDTO.getPushMatchedCPs();
				if(pushRecommendCpDTOs!=null){
					logger.info("给id为”"+uid+"“ 的用户产生了CP推送,推送了 "+pushRecommendCpDTOs.size()+" 个");
					pushRecommendCps(pushRecommendCpDTOs,userSession);
				}
			}
		}
	
		/*Step3： 为其他当前正在看这个CP的用户推送数字的变化*/
		pushCpHeatChange();
		
		logger.info("==============================CpOperationPushTask 完成！===================================");
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
			String userId = matchedUserDTO.getUserid();
			if(userId==null){
				logger.info("匹配用户减少为0");
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

	private void pushCpHeatChange(){
		Set<String> pushUserIds= cpShowingService.getUsersNeedPush(userId, cpId);
		int cpSelectUserCounts = cpShowingService.getCpSelectedUserCounts(cpId);
		for(String pushUserId:pushUserIds){
			WebSocketSession userSession = EchoWebSocketHandler.getUserById(Long.valueOf(pushUserId));
			if(userSession!=null){
				JSONObject returnJson = new JSONObject();
				returnJson.put("_interface", "2107-1");
				returnJson.put("interface_name", "push_select_cp_present");
				returnJson.put("cpid",cpId);
				returnJson.put("howmanypeople_selected", cpSelectUserCounts);
				socketService.chat2one(userSession,returnJson);
			}
		}
	}
}

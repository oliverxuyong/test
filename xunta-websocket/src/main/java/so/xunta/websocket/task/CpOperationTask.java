package so.xunta.websocket.task;

import java.util.Iterator;
import java.util.Set;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.web.socket.WebSocketSession;
import so.xunta.beans.User;
import so.xunta.server.CpShowingService;
import so.xunta.server.RecommendService;
import so.xunta.server.SocketService;
import so.xunta.server.UserService;
import so.xunta.websocket.echo.EchoWebSocketHandler;
import so.xunta.websocket.utils.WolfRecommendTaskQueue;


public class CpOperationTask implements Runnable{
	private SocketService socketService;
	private RecommendService recommendService;	
	private CpShowingService cpShowingService;
	private WolfRecommendTaskQueue wolfRecommendTaskQueue;
	//private UserService userService;
	
	private String cpId;
	private String userId;
	private int selectType;
	private String property;
	private Boolean ifSelfAddCp;
	private User u;
	
	Logger logger =Logger.getLogger(CpOperationTask.class);
	
	public CpOperationTask(RecommendService recommendService,CpShowingService cpShowingService, 
			String userId,String cpId, int selectType, String property,Boolean ifSelfAddCp, SocketService socketService,
			UserService userService,WolfRecommendTaskQueue wolfRecommendTaskQueue) {
		this.recommendService = recommendService;
		this.userId = userId;
		this.cpId = cpId;
		this.socketService = socketService;
		this.cpShowingService = cpShowingService;
		this.selectType = selectType;
		this.property = property;
		this.ifSelfAddCp = ifSelfAddCp;
		this.wolfRecommendTaskQueue = wolfRecommendTaskQueue;
		this.u = userService.findUser(Long.valueOf(userId));
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
	public Boolean getIfSelfAddCp() {
		return ifSelfAddCp;
	}

	@Override
	public void run() {
		logger.debug("==============================CpOperationPushTask===================================");
		if(userId==null || cpId==null){
			logger.warn("参数为空！放弃任务");
			return;
		}
		//long startTime = System.currentTimeMillis();
		/*Step1: 更新关系词*/
		recommendService.updateU2cByC2c(userId, cpId, property, selectType);
		
	//	long endTime1 = System.currentTimeMillis();
	//	logger.info("用户:"+userId+"\n 更新关系词执行时间: "+(endTime1-startTime)+"毫秒");
		
		/*Step2：执行记录任务，返回和我相关的用户*/
		Set<String> pendingPushUids = recommendService.recordU2UChange(userId,cpId,property,selectType);
		
	//	long endTime2 = System.currentTimeMillis();
	//	logger.info("用户:"+userId+"\n 纪录任务执行时间: "+(endTime2-endTime1)+"毫秒");
		
		/*Step3: 触发自己的更新任务*/
		wolfRecommendTaskQueue.addMediumPriorityTask(userId);
		wolfRecommendTaskQueue.addLowPriorityTask(userId,selectType, WolfRecommendTaskQueue.SELF_UPDATE);
		
	//	long endTime3 = System.currentTimeMillis();
	//	logger.info("用户:"+userId+"\n 自己的更新任务执行时间: "+(endTime3-endTime2)+"毫秒");
		
		/*Step4：获得在线的匹配用户列表，触发他们的更新任务*/
		pendingPushUids.remove(userId);
		filterOffLineUsers(pendingPushUids);
		for(String uid:pendingPushUids){
			wolfRecommendTaskQueue.addMediumPriorityTask(userId);
			wolfRecommendTaskQueue.addLowPriorityTask(uid,selectType, WolfRecommendTaskQueue.OTHERS_UPDATE);
			
		}
	//	long endTime4 = System.currentTimeMillis();
	//	logger.info("用户:"+userId+"\n 更新他人任务执行时间: "+(endTime4-endTime3)+"毫秒");
		
		/*Step4： 为其他当前正在看这个CP的用户推送数字的变化*/
		pushCpHeatChange();
	//	long endTime5 = System.currentTimeMillis();
		//logger.info("用户:"+userId+"\n 推送数字变化执行时间: "+(endTime5-endTime4)+"毫秒");
		
		if(ifSelfAddCp){
			recommendService.setSelfAddCp(cpId,u.getEvent_scope());
		}
		
		//long endTime = System.currentTimeMillis();
		//logger.debug("用户:"+userId+"\n 记录&更新U2U执行时间: "+(endTime-startTime)+"毫秒");
		logger.debug("==============================CpOperationPushTask 完成！===================================");
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
	
	
	private void pushCpHeatChange(){
		Set<String> pushUserIds= cpShowingService.getUsersNeedPush(userId, cpId,u.getEvent_scope());
		int cpSelectUserCounts = cpShowingService.getCpSelectedUserCounts(cpId,u.getEvent_scope());
		for(String pushUserId:pushUserIds){
			WebSocketSession userSession = EchoWebSocketHandler.getUserById(Long.valueOf(pushUserId));
		//	String clientIP = userSession.getRemoteAddress().toString().substring(1);
			if(userSession!=null){
				JSONObject returnJson = new JSONObject();
				returnJson.put("_interface", "2107-1");
				returnJson.put("interface_name", "push_select_cp_present");
				returnJson.put("cpid",cpId);
				returnJson.put("howmanypeople_selected", cpSelectUserCounts);
				socketService.chat2one(userSession,returnJson);
				//loggerService.log(userId, userId, "", returnJson.toString(), "2107-1", null, null);
			}
		}
	}
}

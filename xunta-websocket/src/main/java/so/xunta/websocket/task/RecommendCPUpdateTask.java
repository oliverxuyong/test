package so.xunta.websocket.task;

import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.socket.WebSocketSession;
import so.xunta.beans.PushRecommendCpDTO;
import so.xunta.beans.RecommendPushDTO;
import so.xunta.server.LoggerService;
import so.xunta.server.RecommendPushService;
import so.xunta.server.RecommendService;
import so.xunta.server.SocketService;
import so.xunta.websocket.echo.EchoWebSocketHandler;


public class RecommendCPUpdateTask implements Runnable {
	private RecommendService recommendService;
	private String uid;
	private SocketService socketService;
	private RecommendPushService recommendPushService;
	private LoggerService loggerService;
	
	private int selectType;
	private Boolean ifSelfUpdate;
	

	Logger logger =Logger.getLogger(RecommendCPUpdateTask.class);
	
	public RecommendCPUpdateTask(RecommendService recommendService,String uid,int selectType,Boolean ifSelfUpdate, SocketService socketService,
			RecommendPushService recommendPushService,LoggerService loggerService) {
		this.recommendService = recommendService;
		this.uid = uid;
		this.selectType = selectType;
		this.ifSelfUpdate = ifSelfUpdate;
		this.socketService = socketService;
		this.recommendPushService = recommendPushService;
		this.loggerService = loggerService;
		
	}

	@Override
	public void run() {
		//logger.debug("========================= RecommendCPUpdateTask==============================");
		if(uid!=null){
			if(recommendService.ifU2CUpdateExecutable(uid)){
				long startTime = System.currentTimeMillis();
				updateAndPush(uid);
				long endTime = System.currentTimeMillis();
				logger.info("用户:"+uid+"\n"+ifSelfUpdate+" 更新U2C执行时间： "+(endTime-startTime)+"毫秒");
			}
		}else{
			logger.error("参数为空！放弃任务");
		}
		//logger.debug("========================= RecommendCPUpdateTask完成！==============================");
	}

	public String getUid() {
		return uid;
	}
	public int getSelectType() {
		return selectType;
	}
	public Boolean getIfSelfUpdate() {
		return ifSelfUpdate;
	}
	
	private void updateAndPush(String uid){
		WebSocketSession userSession = EchoWebSocketHandler.getUserById(Long.valueOf(uid));
		if(userSession==null){
			return;
		}
		
		/*更新前记录一次状态*/
		Boolean ifLastPushComlepted = recommendPushService.recordCPStatusBeforeUpdateTask(uid, selectType);
		if(ifLastPushComlepted){
			Boolean isExecuted = recommendService.updateU2C(uid);
			if(isExecuted){
				/*更新后执行一次和原先状态比较，有一定变化则产生推送*/
				RecommendPushDTO recommendPushDTO = recommendPushService.generatePushCPAfterUpdateTask(uid,selectType);
				
				List<PushRecommendCpDTO> pushRecommendCpDTOs = recommendPushDTO.getPushMatchedCPs();
				if(pushRecommendCpDTOs!=null){
					logger.debug("给用户"+uid+"推送了 "+pushRecommendCpDTOs.size()+" 个CP");
					pushRecommendCps(pushRecommendCpDTOs,userSession);
				}
			}else{
				recommendPushService.clearPushCp(uid);
			}
		}else{
			logger.debug("用户:"+uid+" 之前的CP推送任务还未结束，本次任务放弃！");
		}
	}
	
	private void pushRecommendCps(List<PushRecommendCpDTO> pushRecommendCpDTOs,WebSocketSession session){
		if(session == null){
			logger.info("用户已下线，不再推送");
			return;
		}
		
		//String clientIP = session.getRemoteAddress().toString().substring(1);
		
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
		//loggerService.log(uid, uid, "", returnJson.toString(), "2105-1", null, null);
	}

}

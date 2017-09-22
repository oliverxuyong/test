package so.xunta.websocket.task;

import org.apache.log4j.Logger;

import so.xunta.server.RecommendService;


public class RecommendCancelCpTask implements Runnable {
	
	Logger logger =Logger.getLogger(RecommendCancelCpTask.class);
	
	private RecommendService recommandService;
	private String userId;
	private String cpId;
	
	public RecommendCancelCpTask(RecommendService recommandService,String userId,String cpId) {
		this.recommandService=recommandService;
		this.userId=userId;
		this.cpId=cpId;
	}
	
	@Override
	public void run() {
		logger.info("========================RecommendCancelCpTask======================================");
		if(userId!=null&&cpId!=null){
			recommandService.recordU2UChange(userId,cpId,RecommendService.UNSELECT_CP);
			recommandService.updateU2C(userId);
		}else{
			logger.info("参数为空！放弃任务");
		}
		
	}

	public String getUserId() {
		return userId;
	}

	public String getCpId() {
		return cpId;
	}

}

package so.xunta.websocket.task;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import so.xunta.server.RecommendService;

@Component
public class RecommendCancelCpTask implements Runnable {
	@Autowired
	private RecommendService recommandService;
	
	Logger logger =Logger.getLogger(RecommendCancelCpTask.class);
	
	private String userId;
	private String cpId;
	
	public RecommendCancelCpTask(String userId,String cpId){
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

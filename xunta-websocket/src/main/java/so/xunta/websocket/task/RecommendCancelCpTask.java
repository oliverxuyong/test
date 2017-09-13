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
	
	
	@Override
	public void run() {
		if(userId!=null&&cpId!=null){
			recommandService.recordU2UChange(userId,cpId,RecommendService.UNSELECT_CP);
			recommandService.updateU2C(userId);
		}else{
			logger.info("参数为空！放弃任务");
		}
		
	}


	public void setUserId(String userId) {
		this.userId = userId;
	}

	public void setCpId(String cpId) {
		this.cpId = cpId;
	}


	public String getUserId() {
		return userId;
	}


	public String getCpId() {
		return cpId;
	}

}

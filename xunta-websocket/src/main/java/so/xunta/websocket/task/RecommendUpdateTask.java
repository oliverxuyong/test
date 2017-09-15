package so.xunta.websocket.task;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import so.xunta.server.RecommendService;

@Component
public class RecommendUpdateTask implements Runnable {
	@Autowired
	private RecommendService recommendService;
	private String uid;
	
	Logger logger =Logger.getLogger(RecommendUpdateTask.class);
	
	public RecommendUpdateTask(){}
	public RecommendUpdateTask(String uid) {
		this.uid = uid;
	}
	
	@Override
	public void run() {
		logger.info("=========================RecommendUpdateTask==============================");
		if(uid!=null){
			recommendService.updateU2C(uid);
		}else{
			logger.info("参数为空！放弃任务");
		}
	}

	public String getUid() {
		return uid;
	}
}

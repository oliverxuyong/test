package so.xunta.websocket.task;

import org.apache.log4j.Logger;

import so.xunta.server.RecommendService;


public class RecommendUpdateTask implements Runnable {
	private RecommendService recommendService;
	private String uid;

	Logger logger =Logger.getLogger(RecommendUpdateTask.class);
	
	public RecommendUpdateTask(RecommendService recommendService,String uid) {
		this.recommendService = recommendService;
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

	public void setUid(String uid) {
		this.uid = uid;
	}
	public String getUid() {
		return uid;
	}
}

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
		logger.debug("=========================RecommendUpdateTask==============================");
		if(uid!=null){
			recommendService.updateU2C(uid);
		}else{
			logger.warn("参数为空！放弃任务");
		}
		logger.debug("=========================RecommendUpdateTask完成！==============================");
	}

	public String getUid() {
		return uid;
	}
}

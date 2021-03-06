package so.xunta.websocket.task;

import org.apache.log4j.Logger;

import so.xunta.server.RecommendService;

public class SelfAddCpRecommendTask implements Runnable{
	private RecommendService recommendService;
	String cpId;
	
	Logger logger = Logger.getLogger(SelfAddCpRecommendTask.class);
	
	public SelfAddCpRecommendTask(String cpId,RecommendService recommendService) {
		this.cpId = cpId;
		this.recommendService = recommendService;
	}
	@Override
	public void run() {
		logger.debug("======================SelfAddCpRecommendTask==============================");
		recommendService.setSelfAddCp(cpId);
		logger.debug("======================SelfAddCpRecommendTask完成！==============================");
	}
	
	public String getCpId() {
		return cpId;
	}
}

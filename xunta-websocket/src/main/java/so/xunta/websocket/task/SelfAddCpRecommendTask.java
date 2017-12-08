package so.xunta.websocket.task;

import org.apache.log4j.Logger;

import so.xunta.server.RecommendService;

public class SelfAddCpRecommendTask implements Runnable{
	private RecommendService recommendService;
	String cpId;
	String userEventScope;
	
	Logger logger = Logger.getLogger(SelfAddCpRecommendTask.class);
	
	public SelfAddCpRecommendTask(String cpId,String userEventScope, RecommendService recommendService) {
		this.cpId = cpId;
		this.recommendService = recommendService;
		this.userEventScope = userEventScope;
	}
	@Override
	public void run() {
		logger.debug("======================SelfAddCpRecommendTask==============================");
		recommendService.setSelfAddCp(cpId,userEventScope);
		logger.debug("======================SelfAddCpRecommendTask完成！==============================");
	}
	
	public String getCpId() {
		return cpId;
	}
	public String getUserEventScope() {
		return userEventScope;
	}
	
}

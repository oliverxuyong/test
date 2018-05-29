package so.xunta.websocket.task;

import org.apache.log4j.Logger;

import so.xunta.server.RecommendService;

public class UpdateSynchronizeTask implements Runnable{
	private RecommendService recommendService;
	private String uid;
	Logger logger =Logger.getLogger(UpdateSynchronizeTask.class);
	
	public UpdateSynchronizeTask(String uid, RecommendService recommendService){
		this.uid=uid;
		this.recommendService=recommendService;
	}
	
	public String getUid() {
		return uid;
	}

	@Override
	public void run() {
		if(recommendService.ifU2UUpdateExecutable(uid)){
			recommendService.updateU2U(uid);
		}
		if(recommendService.ifU2CUpdateExecutable(uid)){
			recommendService.updateU2C(uid);
		}
	}
}

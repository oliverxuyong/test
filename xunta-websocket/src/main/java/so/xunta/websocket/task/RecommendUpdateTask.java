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
	
	Logger logger =Logger.getLogger(RecommendPushTask.class);
	
	@Override
	public void run() {
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

package so.xunta.websocket.utils;

import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.ThreadPoolExecutor;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RecommendTaskPool {
	@Autowired
	private ThreadPoolExecutor threadPoolExecutor;
	@Autowired
	private WolfRejectedExecutionHandler wolfRejectedExecutionHandler;
	
	Logger logger =Logger.getLogger(RecommendTaskPool.class);
	
	public RecommendTaskPool() {
		threadPoolExecutor.setRejectedExecutionHandler(wolfRejectedExecutionHandler);
	}
	
	public void execute(Runnable task){	
		try {
			threadPoolExecutor.execute(task);
		} catch (RejectedExecutionException e) {
			logger.error(e.getMessage());
		} 	
	}
	
	public void destroy(){
		threadPoolExecutor.shutdown();
	}
}

package so.xunta.websocket.utils;

import java.util.concurrent.RejectedExecutionException;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class HighPriorityTaskPool {
	@Autowired
	private HighPriorityThreadExecutor hPriorityThreadPoolExecutor;
//	@Autowired
//	private HighPriorityRejectedExecutionHandler wolfRejectedExecutionHandler;
	
	Logger logger =Logger.getLogger(HighPriorityTaskPool.class);
	
	public void execute(Runnable task){	
		try {
			hPriorityThreadPoolExecutor.execute(task);
		} catch (RejectedExecutionException e) {
			logger.error(e.getMessage());
		} 	
	}

//	public void setRejectedHandler(){
//		hPriorityThreadPoolExecutor.setRejectedExecutionHandler(wolfRejectedExecutionHandler);
//	}
	
	public void destroy(){
		hPriorityThreadPoolExecutor.shutdown();
	}
}

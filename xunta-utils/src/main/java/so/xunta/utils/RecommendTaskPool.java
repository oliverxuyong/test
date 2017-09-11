package so.xunta.utils;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.test.context.ContextConfiguration;

@ContextConfiguration
public class RecommendTaskPool {
	private static RecommendTaskPool recommendTaskPool;
	@Autowired
	private ThreadPoolTaskExecutor threadPool;
	
	private RecommendTaskPool(){	}
	
	public static RecommendTaskPool getInstance(){
		if(recommendTaskPool == null){
			recommendTaskPool = new RecommendTaskPool();
		}
		return recommendTaskPool;
	}

	public ThreadPoolTaskExecutor getThreadPool(){
		return threadPool;
	}
	
}

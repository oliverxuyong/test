package so.xunta.utils;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

@Repository
public class RecommendTaskPool {
	@Value("$(recommendTaskPool.maxThreadSize)")
	private int maxThreadSize;
	private static RecommendTaskPool recommendTaskPool= new RecommendTaskPool();
	private ExecutorService threadPool;
	
	private RecommendTaskPool(){
		//Bright Zheng: 要改为ThreadPoolExecutor的方式，规避资源耗尽的风险
		threadPool = Executors.newFixedThreadPool(maxThreadSize);
	}
	
	public static RecommendTaskPool getInstance(){
		return recommendTaskPool;
	}

	public ExecutorService getThreadPool(){
		return threadPool;
	}
	
}

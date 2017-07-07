package so.xunta.utils;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


public class RecommendTaskPool {
	//@Value("$(recommendTaskPool.maxThreadSize)")
	private int maxThreadSize = 500;
	private static RecommendTaskPool recommendTaskPool;
	private ExecutorService threadPool;
	
	private RecommendTaskPool(){
		//Bright Zheng: 要改为ThreadPoolExecutor的方式，规避资源耗尽的风险
		threadPool = Executors.newFixedThreadPool(maxThreadSize);
	}
	
	public static RecommendTaskPool getInstance(){
		if(recommendTaskPool == null){
			recommendTaskPool = new RecommendTaskPool();
		}
		return recommendTaskPool;
	}

	public ExecutorService getThreadPool(){
		return threadPool;
	}
	
}

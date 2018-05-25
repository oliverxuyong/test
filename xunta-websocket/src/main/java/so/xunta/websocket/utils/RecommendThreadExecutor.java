package so.xunta.websocket.utils;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;



/**
 * @author Bright zheng
 * 继承ThreadPoolExecutor，在每次线程执行结束后查看线程池中空闲情况，如果queue中的线程数小于容量的一半，就增加pending的任务
 * */
public class RecommendThreadExecutor extends ThreadPoolExecutor{

	@Autowired
    private WolfRecommendTaskQueue wolfRecommendTaskQueue;
	
	
	Logger logger=Logger.getLogger(RecommendThreadExecutor.class);

	public RecommendThreadExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit,
			BlockingQueue<Runnable> workQueue,  RejectedExecutionHandler handler) {
		super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue, handler);
	}

	@Override
	protected void afterExecute(Runnable r, Throwable t) {
		super.afterExecute(r, t);
		wolfRecommendTaskQueue.releaseAThread();
		wolfRecommendTaskQueue.execute();
		
		/*
		int pendingTaskCount = this.getQueue().size();
		int queueCpacity = this.getQueue().remainingCapacity();
		if(pendingTaskCount < (queueCpacity/2)){
			List<Runnable> tasks = pendingTaskQueue.getTaskList(queueCpacity/2);
			for(Runnable task:tasks){
				logger.info("HighPriority线程池空闲，执行搁置任务");
				this.execute(task);
			}
		}*/		
	}
	
}

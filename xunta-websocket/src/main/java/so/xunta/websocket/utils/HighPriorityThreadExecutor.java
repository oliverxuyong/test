package so.xunta.websocket.utils;

import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;



/**
 * @author Bright zheng
 * 继承ThreadPoolExecutor，在每次线程执行结束后查看线程池中空闲情况，如果queue中的线程数小于容量的一半，就增加pending的任务
 * */
public class HighPriorityThreadExecutor extends ThreadPoolExecutor{
//	@Autowired
//	private HighPriorityTaskPool recommendTaskPool;
	@Autowired
	private HighPriorityPendingTaskQueue pendingTaskQueue;
	
	Logger logger=Logger.getLogger(HighPriorityThreadExecutor.class);

	public HighPriorityThreadExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit,
			BlockingQueue<Runnable> workQueue, ThreadFactory threadFactory, RejectedExecutionHandler handler) {
		super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue, threadFactory, handler);
	}

	@Override
	protected void afterExecute(Runnable r, Throwable t) {
		super.afterExecute(r, t);
		int pendingTaskCount = this.getQueue().size();
		int queueCpacity = this.getQueue().remainingCapacity();
		if(pendingTaskCount < (queueCpacity/2)){
			List<Runnable> tasks = pendingTaskQueue.getTaskList(queueCpacity/2);
			for(Runnable task:tasks){
				logger.info("HighPriority线程池空闲，执行搁置任务");
				this.execute(task);
			}
		}		
	}
	
}

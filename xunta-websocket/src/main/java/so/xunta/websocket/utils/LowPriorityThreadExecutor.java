package so.xunta.websocket.utils;

import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import so.xunta.utils.RecommendCPUpdateTaskList;
import so.xunta.websocket.task.RecommendCPUpdateTask;

public class LowPriorityThreadExecutor  extends ThreadPoolExecutor{
	@Autowired
	private LowPriorityPendingTaskQueue pendingTaskQueue;
	
	Logger logger=Logger.getLogger(LowPriorityThreadExecutor.class);
	
	public LowPriorityThreadExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit,
			BlockingQueue<Runnable> workQueue, ThreadFactory threadFactory, RejectedExecutionHandler handler) {
		super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue, threadFactory, handler);
		
	}

	@Override
	protected void afterExecute(Runnable r, Throwable t) {
		super.afterExecute(r, t);
		
		RecommendCPUpdateTask completeTask = (RecommendCPUpdateTask)r;
		RecommendCPUpdateTaskList.getInstance().removeU2CUpdateTask(completeTask.getUid());
		
		
		int pendingTaskCount = this.getQueue().size();
		int queueCpacity = this.getQueue().remainingCapacity();
		if(pendingTaskCount < (queueCpacity/2)){
			List<Runnable> tasks = pendingTaskQueue.getTaskList(queueCpacity/2);
			for(Runnable task:tasks){
				logger.info("LowPriority线程池空闲，执行搁置任务");
				this.execute(task);
			}
		}		
	}
}

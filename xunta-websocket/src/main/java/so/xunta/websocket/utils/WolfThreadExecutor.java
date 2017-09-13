package so.xunta.websocket.utils;

import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;


/**
 * @author Bright zheng
 * 继承ThreadPoolExecutor，在每次线程执行结束后查看线程池中空闲情况，如果活动线程小于最大线程，就执行pending的任务
 * */
public class WolfThreadExecutor extends ThreadPoolExecutor{
	@Autowired
	private RecommendTaskPool recommendTaskPool;

	public WolfThreadExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit,
			BlockingQueue<Runnable> workQueue) {
		super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue);
	}

	@Override
	protected void afterExecute(Runnable r, Throwable t) {
		super.afterExecute(r, t);
		int activeTaskCount = this.getActiveCount();
		int maxTaskCount = this.getMaximumPoolSize();
		if(activeTaskCount<maxTaskCount){
			List<Runnable> tasks = PendingTaskQueue.getInstance().getTaskList(this.getQueue().size()*(maxTaskCount-activeTaskCount));
			for(Runnable task:tasks){
				System.out.println("线程池空闲，执行搁置任务");
				recommendTaskPool.execute(task);
			}
		}
	}
	
}

package so.xunta.websocket.utils;

import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import so.xunta.websocket.task.RecommendCPUpdateTask;

@Component
public class LowPriorityRejectedExecutionHandler implements RejectedExecutionHandler{
	Logger logger =Logger.getLogger(LowPriorityRejectedExecutionHandler.class);
	@Autowired
	private LowPriorityPendingTaskQueue lowPriorityPendingTaskQueue;
	
	@Override
	public void rejectedExecution(Runnable task, ThreadPoolExecutor executor) {
		logger.warn("LowPriority线程池已满");
		if(task instanceof RecommendCPUpdateTask){
			logger.debug("将1个RecommendUpdateTask 任务序列化到任务队列，等空闲时再执行");
			RecommendCPUpdateTask recommendUpdateTask = (RecommendCPUpdateTask)task;
			String uid = recommendUpdateTask.getUid();
			int selectType = recommendUpdateTask.getSelectType();
			lowPriorityPendingTaskQueue.addUpdateTask(uid, selectType);
		}	
	}

}

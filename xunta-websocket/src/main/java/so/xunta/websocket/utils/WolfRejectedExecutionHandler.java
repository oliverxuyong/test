package so.xunta.websocket.utils;

import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;

import org.apache.log4j.Logger;

import so.xunta.websocket.task.RecommendCancelCpTask;
import so.xunta.websocket.task.RecommendPushTask;
import so.xunta.websocket.task.RecommendUpdateTask;

public class WolfRejectedExecutionHandler implements RejectedExecutionHandler {
	Logger logger =Logger.getLogger(WolfRejectedExecutionHandler.class);
	
	@Override
	public void rejectedExecution(Runnable task, ThreadPoolExecutor executor) {
		logger.info("线程池已满");
		if(task instanceof RecommendPushTask){
			logger.info("将1个RecommendPushTask 任务序列化到任务队列，等空闲时再执行");
			RecommendPushTask recommendPushTask = (RecommendPushTask)task;
			String uid = recommendPushTask.getUserId();
			String cpId = recommendPushTask.getCpId();
			PendingTaskQueue.getInstance().addPushTask(uid, cpId);
		}else if(task instanceof RecommendCancelCpTask){
			logger.info("将1个RecommendCancelCpTask 任务序列化到任务队列，等空闲时再执行");
			RecommendCancelCpTask recommendCancelCpTask = (RecommendCancelCpTask)task;
			String uid = recommendCancelCpTask.getUserId();
			String cpId = recommendCancelCpTask.getCpId();
			PendingTaskQueue.getInstance().addCancelCpTask(uid, cpId);
		}else if(task instanceof RecommendUpdateTask){
			logger.info("将1个RecommendUpdateTask 任务序列化到任务队列，等空闲时再执行");
			RecommendUpdateTask recommendUpdateTask = (RecommendUpdateTask)task;
			String uid = recommendUpdateTask.getUid();
			PendingTaskQueue.getInstance().addUpdateTask(uid);
		}
	}

}

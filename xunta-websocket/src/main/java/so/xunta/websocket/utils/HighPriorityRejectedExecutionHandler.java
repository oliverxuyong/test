package so.xunta.websocket.utils;

import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import so.xunta.websocket.task.CpOperationTask;
import so.xunta.websocket.task.UpdateSynchronizeTask;

@Component
public class HighPriorityRejectedExecutionHandler implements RejectedExecutionHandler {
	Logger logger =Logger.getLogger(HighPriorityRejectedExecutionHandler.class);
	@Autowired
	private HighPriorityPendingTaskQueue highPriorityPendingTaskQueue;
	
	@Override
	public void rejectedExecution(Runnable task, ThreadPoolExecutor executor) {
		logger.warn("HighPriority线程池已满");
		if(task instanceof CpOperationTask){
			logger.debug("将1个CpOperationPushTask 任务序列化到任务队列，等空闲时再执行");
			CpOperationTask recommendPushTask = (CpOperationTask)task;
			String uid = recommendPushTask.getUserId();
			String cpId = recommendPushTask.getCpId();
			int selectType = recommendPushTask.getSelectType();
			String property = recommendPushTask.getProperty();
			Boolean ifSelfAddCp = recommendPushTask.getIfSelfAddCp();
			highPriorityPendingTaskQueue.addSelectCPTask(uid, cpId, property,ifSelfAddCp,selectType);

		}else if(task instanceof UpdateSynchronizeTask){
			logger.debug("将1个RecommendUpdateTask 任务序列化到任务队列，等空闲时再执行");
			UpdateSynchronizeTask updateSyncTask = (UpdateSynchronizeTask)task;
			String uid = updateSyncTask.getUid();
			highPriorityPendingTaskQueue.addUpdateSyncTask(uid);
		}
	}

}

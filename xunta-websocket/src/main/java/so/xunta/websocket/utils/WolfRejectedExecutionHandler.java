package so.xunta.websocket.utils;

import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import so.xunta.websocket.task.CpOperationPushTask;
import so.xunta.server.RecommendService;
import so.xunta.websocket.task.RecommendUpdateTask;
import so.xunta.websocket.task.SelfAddCpRecommendTask;

@Component
public class WolfRejectedExecutionHandler implements RejectedExecutionHandler {
	Logger logger =Logger.getLogger(WolfRejectedExecutionHandler.class);
	@Autowired
	private PendingTaskQueue pendingTaskQueue;
	
	@Override
	public void rejectedExecution(Runnable task, ThreadPoolExecutor executor) {
		logger.warn("线程池已满");
		if(task instanceof CpOperationPushTask){
			logger.debug("将1个CpOperationPushTask 任务序列化到任务队列，等空闲时再执行");
			CpOperationPushTask recommendPushTask = (CpOperationPushTask)task;
			String uid = recommendPushTask.getUserId();
			String cpId = recommendPushTask.getCpId();
			int selectType = recommendPushTask.getSelectType();
			String property = recommendPushTask.getProperty();
			if(selectType == RecommendService.SELECT_CP){
				pendingTaskQueue.addSelectCPTask(uid, cpId, property);
			}else{
				pendingTaskQueue.addCancelCpTask(uid, cpId, property);
			}		
		}else if(task instanceof RecommendUpdateTask){
			logger.debug("将1个RecommendUpdateTask 任务序列化到任务队列，等空闲时再执行");
			RecommendUpdateTask recommendUpdateTask = (RecommendUpdateTask)task;
			String uid = recommendUpdateTask.getUid();
			pendingTaskQueue.addUpdateTask(uid);
		}else if(task instanceof SelfAddCpRecommendTask){
			logger.debug("将1个SelfAddCpRecommendTask 任务序列化到任务队列，等空闲时再执行");
			SelfAddCpRecommendTask selfAddCpRecommendTask = (SelfAddCpRecommendTask)task;
			String cpId = selfAddCpRecommendTask.getCpId();
			String userEventScope = selfAddCpRecommendTask.getUserEventScope();
			pendingTaskQueue.addSelfAddCPTask(cpId,userEventScope);
		}
	}

}

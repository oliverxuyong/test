package so.xunta.websocket.utils;

import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import so.xunta.server.RecommendPushService;
import so.xunta.server.RecommendService;
import so.xunta.server.SocketService;
import so.xunta.websocket.task.RecommendCancelCpTask;
import so.xunta.websocket.task.RecommendPushTask;
import so.xunta.websocket.task.RecommendUpdateTask;

@Component
public class PendingTaskQueue {
	public static final String RECOMMEND_PUSH = "push";
	public static final String RECOMMEND_CANCELCP = "cancelCP";
	public static final String RECOMMEND_UPDARW = "update";
	@Autowired
	private RecommendService recommendService;
	@Autowired
	private RecommendPushService recommendPushService;
	
	@Autowired
	private SocketService socketService;
	private List<String> taskSerializeList = Collections.synchronizedList(new LinkedList<String>());

	public void addPushTask(String userId,String cpId){
		String taskId = RECOMMEND_PUSH+":"+userId+":"+cpId;
		taskSerializeList.add(taskId);
	}
	
	public void addCancelCpTask(String userId,String cpId){
		String taskId = RECOMMEND_CANCELCP+":"+userId+":"+cpId;
		taskSerializeList.add(taskId);
	}
	
	public void addUpdateTask(String userId){
		String taskId = RECOMMEND_UPDARW+":"+userId;
		taskSerializeList.add(taskId);
	}
	
	public List<Runnable> getTaskList(int size){
		Iterator<String> iterator = taskSerializeList.iterator();
		List<Runnable> returnTasks = new LinkedList<Runnable>();
		int loopTimes = 0;
		while(iterator.hasNext()){
			if(loopTimes>=size){
				break;
			}
			String taskId =iterator.next();
			String[] parms=taskId.split(":");
			switch(parms[0]){
			case RECOMMEND_PUSH:
				String userId1 = parms[1];
				String cpId1 = parms[2];
				RecommendPushTask t1= new RecommendPushTask(recommendService,recommendPushService,userId1,cpId1,socketService);
				returnTasks.add(t1);
				break;
			case RECOMMEND_CANCELCP:
				String userId2 = parms[1];
				String cpId2 = parms[2];
				RecommendCancelCpTask t2 = new RecommendCancelCpTask(recommendService,userId2,cpId2);
				returnTasks.add(t2);
				break;
			case RECOMMEND_UPDARW:
				String userId3 = parms[1];
				RecommendUpdateTask t3 = new RecommendUpdateTask(recommendService,userId3);
				returnTasks.add(t3);
				break;
			}
			iterator.remove();
			loopTimes++;
		}
		return returnTasks;
	}
}

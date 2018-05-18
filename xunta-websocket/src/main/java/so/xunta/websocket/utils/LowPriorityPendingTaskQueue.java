package so.xunta.websocket.utils;

import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import so.xunta.server.LoggerService;
import so.xunta.server.RecommendPushService;
import so.xunta.server.RecommendService;
import so.xunta.server.SocketService;
import so.xunta.websocket.task.RecommendCPUpdateTask;


@Component
public class LowPriorityPendingTaskQueue {
	private List<String> taskSerializeList = Collections.synchronizedList(new LinkedList<String>());
	@Autowired
	private RecommendService recommendService;
	@Autowired
	private SocketService socketService;
	@Autowired
	private LoggerService loggerService;
	@Autowired
	private RecommendPushService recommendPushService;
	
	public void addUpdateTask(String userId,int selectType){
		String taskId = userId+":"+selectType;
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
			
			String userId = parms[0];
			int selectType = Integer.valueOf(parms[1]);
			RecommendCPUpdateTask t = new RecommendCPUpdateTask(recommendService,userId,selectType,socketService,recommendPushService,loggerService);
			returnTasks.add(t);
			
			iterator.remove();
			loopTimes++;
		}
		return returnTasks;
	}


}

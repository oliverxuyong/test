package so.xunta.websocket.utils;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import so.xunta.server.CpShowingService;
import so.xunta.server.RecommendService;
import so.xunta.server.SocketService;
import so.xunta.server.UserService;
import so.xunta.websocket.task.CpOperationTask;
import so.xunta.websocket.task.UpdateSynchronizeTask;

@Component
public class HighPriorityPendingTaskQueue {
	private final String RECOMMEND_SELECTCP = "selectCP";
	private final String UPDATE_SYNCHRONIZE = "UpdateSync";

	@Autowired
	private RecommendService recommendService;
	@Autowired
	private CpShowingService cpShowingService;
	@Autowired
	private SocketService socketService;
	@Autowired
	private UserService UserService;
	@Autowired
	private WolfRecommendTaskQueue wolfRecommendTaskQueue;
	
	private Queue<String> taskSerializeList = new ConcurrentLinkedQueue<String>();

	public void addSelectCPTask(String userId,String cpId,String property,Boolean ifSelfAddCp,int selectType){
		String taskId = RECOMMEND_SELECTCP+":"+userId+":"+cpId+":"+property+":"+ifSelfAddCp+":"+selectType;
		taskSerializeList.add(taskId);
	}
	
	public void addUpdateSyncTask(String userId){
		String taskId = UPDATE_SYNCHRONIZE+":"+userId;
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
			case RECOMMEND_SELECTCP:
				String userId1 = parms[1];
				String cpId1 = parms[2];
				String propert1 = parms[3];
				Boolean ifSelfAddCp1 = Boolean.valueOf(parms[4]);
				int selectType1 = Integer.valueOf(parms[5]);
				CpOperationTask t1= new CpOperationTask(recommendService,cpShowingService,userId1,cpId1,
						selectType1,propert1,ifSelfAddCp1,socketService,UserService,wolfRecommendTaskQueue);
				returnTasks.add(t1);
				break;
			case UPDATE_SYNCHRONIZE:
				String userId2 = parms[1];
				UpdateSynchronizeTask t2 = new UpdateSynchronizeTask(userId2,recommendService);
				returnTasks.add(t2);
				break;
			}
			iterator.remove();
			loopTimes++;
		}
		return returnTasks;
	}
	
	public int getRestTaskNum(){
		return taskSerializeList.size();
	}
}

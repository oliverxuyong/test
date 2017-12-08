package so.xunta.websocket.utils;

import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import so.xunta.server.CpShowingService;
import so.xunta.server.LoggerService;
import so.xunta.server.RecommendPushService;
import so.xunta.server.RecommendService;
import so.xunta.server.SocketService;
import so.xunta.server.UserService;
import so.xunta.websocket.task.CpOperationPushTask;
import so.xunta.websocket.task.RecommendUpdateTask;
import so.xunta.websocket.task.SelfAddCpRecommendTask;

@Component
public class PendingTaskQueue {
	private final String RECOMMEND_SELECTCP = "selectCP";
	private final String RECOMMEND_CANCELCP = "cancelCP";
	private final String RECOMMEND_UPDARW = "update";
	private final String RECOMMEND_SELF_ADD_CP = "selfAddCP";
	@Autowired
	private RecommendService recommendService;
	@Autowired
	private RecommendPushService recommendPushService;
	@Autowired
	private CpShowingService cpShowingService;
	@Autowired
	private SocketService socketService;
	@Autowired
	private LoggerService loggerService;
	@Autowired
	private UserService UserService;
	
	private List<String> taskSerializeList = Collections.synchronizedList(new LinkedList<String>());

	public void addSelectCPTask(String userId,String cpId,String property){
		String taskId = RECOMMEND_SELECTCP+":"+userId+":"+cpId+":"+property;
		taskSerializeList.add(taskId);
	}
	
	public void addCancelCpTask(String userId,String cpId,String property){
		String taskId = RECOMMEND_CANCELCP+":"+userId+":"+cpId+":"+property;
		taskSerializeList.add(taskId);
	}
	
	public void addUpdateTask(String userId){
		String taskId = RECOMMEND_UPDARW+":"+userId;
		taskSerializeList.add(taskId);
	}
	public void addSelfAddCPTask(String cpId,String userEventScope){
		String taskId = RECOMMEND_SELF_ADD_CP+":"+cpId+":"+userEventScope;
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
				CpOperationPushTask t1= new CpOperationPushTask(recommendService,recommendPushService,cpShowingService,userId1,cpId1,RecommendService.SELECT_CP,propert1,socketService,loggerService,UserService);
				returnTasks.add(t1);
				break;
			case RECOMMEND_CANCELCP:
				String userId2 = parms[1];
				String cpId2 = parms[2];
				String propert2 = parms[3];
				CpOperationPushTask t2 = new CpOperationPushTask(recommendService,recommendPushService,cpShowingService,userId2,cpId2,RecommendService.UNSELECT_CP,propert2,socketService,loggerService,UserService);
				returnTasks.add(t2);
				break;
			case RECOMMEND_UPDARW:
				String userId3 = parms[1];
				RecommendUpdateTask t3 = new RecommendUpdateTask(recommendService,userId3);
				returnTasks.add(t3);
				break;
			case RECOMMEND_SELF_ADD_CP:
				String cpId4 = parms[1];
				String userEventScope = parms[2];
				SelfAddCpRecommendTask t4 = new SelfAddCpRecommendTask(cpId4,userEventScope,recommendService);
				returnTasks.add(t4);
			}
			iterator.remove();
			loopTimes++;
		}
		return returnTasks;
	}
}

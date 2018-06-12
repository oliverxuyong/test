package so.xunta.websocket.utils;

import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.CopyOnWriteArraySet;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import so.xunta.server.LoggerService;
import so.xunta.server.RecommendPushService;
import so.xunta.server.RecommendService;
import so.xunta.server.SocketService;
import so.xunta.websocket.task.RecommendCPUpdateTask;
import so.xunta.websocket.task.RecommendU2uUpdateTask;

@Component
public class WolfRecommendTaskQueue {
	public static final Boolean SELF_UPDATE = true;
	public static final Boolean OTHERS_UPDATE = false;
	@Autowired
	private SocketService socketService;
	@Autowired
	private RecommendService recommendService;	
	@Autowired
	private RecommendPushService recommendPushService;
	@Autowired
	private RecommendThreadExecutor recommendThreadExecutor;
	@Autowired
	private LoggerService loggerService;
	@Value("#{'${thread.pool.maxPoolSize}'}")
	private int threadPoolMaxPoolSize;
	private int activityThreadSize=0;
	
	private Queue<Runnable> highPriorityTaskQueue = new ConcurrentLinkedQueue<Runnable>();
	private Queue<Runnable> mediumPriorityTaskQueue = new ConcurrentLinkedQueue<Runnable>();
	private Queue<Runnable> lowPriorityTaskQueue = new ConcurrentLinkedQueue<Runnable>();
	private Set<String> selfU2CUpdateTaskSet = new CopyOnWriteArraySet<String>();
	private Map<String,Runnable> othersU2CUpdateTaskMap = new ConcurrentHashMap<String,Runnable>();
	private Set<String> u2UUpdateTaskSet = new CopyOnWriteArraySet<String>();

	
	Logger logger = Logger.getLogger(WolfRecommendTaskQueue.class);
	
	public void addHighPriorityTask(Runnable task){
		highPriorityTaskQueue.add(task);
		execute();
	}
	
	public void addMediumPriorityTask(String uid){
		if(u2UUpdateTaskSet.add(uid)){
			RecommendU2uUpdateTask task = new RecommendU2uUpdateTask(uid, recommendService, socketService, recommendPushService,loggerService);
			mediumPriorityTaskQueue.add(task);
			execute();
		}
	}
	
	public void addLowPriorityTask(String uid,int selectType, Boolean ifSelfUpdate){
		//TODO 加一个想recommendService 的更新可执行判断
		if(ifSelfUpdate){
			if(selfU2CUpdateTaskSet.add(uid)){
				RecommendCPUpdateTask task = new RecommendCPUpdateTask(recommendService, uid, selectType,ifSelfUpdate, socketService, recommendPushService, loggerService);
				lowPriorityTaskQueue.add(task);
				execute();
			}
		}else{
			RecommendCPUpdateTask task = new RecommendCPUpdateTask(recommendService, uid, selectType, ifSelfUpdate, socketService, recommendPushService, loggerService);
			Runnable previousTask = othersU2CUpdateTaskMap.put(uid, task);
			if(previousTask!=null){
				Boolean ifremoveSuccess = lowPriorityTaskQueue.remove(previousTask);
				//logger.info("删除"+ifremoveSuccess);
				if(ifremoveSuccess){
					lowPriorityTaskQueue.add(task);
				}
			}else{
				lowPriorityTaskQueue.add(task);
				execute();
			}
		}
	}
	
	public synchronized void execute(){
		logger.debug("线程情况："+activityThreadSize+":"+threadPoolMaxPoolSize);
		if(highPriorityTaskQueue.size()==0&&mediumPriorityTaskQueue.size()==0&&lowPriorityTaskQueue.size()==0){
			return;
		}

		if(activityThreadSize < threadPoolMaxPoolSize){
			int pollSize = threadPoolMaxPoolSize - activityThreadSize;
			for(int i=0;i<pollSize;i++){
				Runnable task = highPriorityTaskQueue.poll();
				if(task!=null){
					activityThreadSize++;
					recommendThreadExecutor.execute(task);
				}else{
					task = mediumPriorityTaskQueue.poll();
					if(task!=null){
						RecommendU2uUpdateTask recommendU2uUpdateTask = (RecommendU2uUpdateTask)task;
						String uid = recommendU2uUpdateTask.getUid();
						u2UUpdateTaskSet.remove(uid);
						
						activityThreadSize++;
						recommendThreadExecutor.execute(task);
					}else{
						task = lowPriorityTaskQueue.poll();
						logger.debug("队列长度"+lowPriorityTaskQueue.size()+"="+othersU2CUpdateTaskMap.size()+"+"+selfU2CUpdateTaskSet.size());
						if(task!=null){

							RecommendCPUpdateTask recommendCPUpdateTask = (RecommendCPUpdateTask)task;
							String uid = recommendCPUpdateTask.getUid();
							Boolean ifSelfUpdate = recommendCPUpdateTask.getIfSelfUpdate();
							if(ifSelfUpdate){
								selfU2CUpdateTaskSet.remove(uid);
							}else{
								othersU2CUpdateTaskMap.remove(uid);
							}
				
							activityThreadSize++;
							recommendThreadExecutor.execute(task);
						}else{
							break;
						}
					}
				}				
			}
		}
	}
	
	public synchronized void releaseAThread(){
		if(activityThreadSize>0){
			activityThreadSize--;
		}else{
			logger.error("线程操作错误，存在被重复释放");;
		}
	}
}

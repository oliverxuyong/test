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

import so.xunta.websocket.task.RecommendCPUpdateTask;

@Component
public class WolfRecommendTaskQueue {
	public static final Boolean SELF_UPDATE = true;
	public static final Boolean OTHERS_UPDATE = false;
	
	@Autowired
	private RecommendThreadExecutor recommendThreadExecutor;
	@Value("#{'${thread.pool.maxPoolSize}'}")
	private int threadPoolMaxPoolSize;
	private int activityThreadSize=0;
	
	private Queue<Runnable> HighPriorityTaskQueue = new ConcurrentLinkedQueue<Runnable>();
	private Queue<Runnable> LowPriorityTaskQueue = new ConcurrentLinkedQueue<Runnable>();
	private Set<String> selfU2CUpdateTaskSet = new CopyOnWriteArraySet<String>(); 
	private Map<String,Runnable> othersU2CUpdateTaskMap = new ConcurrentHashMap<String,Runnable>(); 

	
	Logger logger = Logger.getLogger(WolfRecommendTaskQueue.class);
	
	public void addHighPriorityTask(Runnable task){
		HighPriorityTaskQueue.add(task);
		execute();
	}
	
	public void addLowPriorityTask(String uid, Runnable task,Boolean ifSelfUpdate){
		if(ifSelfUpdate){
			if(!selfU2CUpdateTaskSet.contains(uid)){
				selfU2CUpdateTaskSet.add(uid);
				LowPriorityTaskQueue.add(task);
				execute();
			}
		}else{
			Runnable previousTask = othersU2CUpdateTaskMap.replace(uid, task);
			if(previousTask!=null){
				LowPriorityTaskQueue.remove(previousTask);
				LowPriorityTaskQueue.add(task);
			}else{
				LowPriorityTaskQueue.add(task);
				execute();
			}
		}
	}
	
	public synchronized void execute(){
		logger.debug("线程情况："+activityThreadSize+":"+threadPoolMaxPoolSize);
		if(activityThreadSize < threadPoolMaxPoolSize+1){
			int pollSize = threadPoolMaxPoolSize +1 - activityThreadSize;
			for(int i=0;i<pollSize;i++){
				Runnable task = HighPriorityTaskQueue.poll();
				if(task==null){
					task = LowPriorityTaskQueue.poll();
					if(task!=null){
						recommendThreadExecutor.execute(task);
						activityThreadSize++;
						if(task instanceof RecommendCPUpdateTask){
							RecommendCPUpdateTask recommendCPUpdateTask = (RecommendCPUpdateTask)task;
							String uid = recommendCPUpdateTask.getUid();
							Boolean ifSelfUpdate = recommendCPUpdateTask.getIfSelfUpdate();
							if(ifSelfUpdate){
								selfU2CUpdateTaskSet.remove(uid);
							}else{
								othersU2CUpdateTaskMap.remove(uid);
							}
						}else{
							logger.error("任务对象非RecommendCPUpdateTask，删除失败！");
						}
					}
				}else{
					recommendThreadExecutor.execute(task);
					activityThreadSize++;
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

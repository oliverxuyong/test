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
	
	private Queue<Runnable> highPriorityTaskQueue = new ConcurrentLinkedQueue<Runnable>();
	private Queue<Runnable> lowPriorityTaskQueue = new ConcurrentLinkedQueue<Runnable>();
	private Set<String> selfU2CUpdateTaskSet = new CopyOnWriteArraySet<String>();
	private Map<String,Runnable> othersU2CUpdateTaskMap = new ConcurrentHashMap<String,Runnable>();

	
	Logger logger = Logger.getLogger(WolfRecommendTaskQueue.class);
	
	public void addHighPriorityTask(Runnable task){
		highPriorityTaskQueue.add(task);
		execute();
	}
	
	public void addLowPriorityTask(String uid, Runnable task,Boolean ifSelfUpdate){
		//TODO 加一个想recommendService 的更新可执行判断
		if(ifSelfUpdate){
			if(!selfU2CUpdateTaskSet.contains(uid)){
				selfU2CUpdateTaskSet.add(uid);
				lowPriorityTaskQueue.add(task);
				execute();
			}
		}else{
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
		if(highPriorityTaskQueue.size()==0&&lowPriorityTaskQueue.size()==0){
			return;
		}
		if(activityThreadSize < (threadPoolMaxPoolSize+1)){
			int pollSize = threadPoolMaxPoolSize +1 - activityThreadSize;
			for(int i=0;i<pollSize;i++){
				Runnable task = highPriorityTaskQueue.poll();
				if(task==null){
					task = lowPriorityTaskQueue.poll();
					logger.info("队列长度"+lowPriorityTaskQueue.size()+"="+othersU2CUpdateTaskMap.size()+"+"+selfU2CUpdateTaskSet.size());
					if(task!=null){
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
						recommendThreadExecutor.execute(task);
					}else{
						break;
					}
				}else{
					activityThreadSize++;
					recommendThreadExecutor.execute(task);
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

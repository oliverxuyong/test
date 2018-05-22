package so.xunta.utils;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

public class RecommendCPUpdateTaskList {
	public static final Boolean SELF_UPDATE = true;
	public static final Boolean OTHERS_UPDATE = false;
	private static RecommendCPUpdateTaskList recommendCPUpdateTaskList = new RecommendCPUpdateTaskList();
	private List<String> selfU2CUpdateTaskList = new CopyOnWriteArrayList<String>();
	private Map<String,Runnable> selfU2CUpdateTaskMap = new ConcurrentHashMap<String,Runnable>(); 
	private List<String> othersU2CUpdateTaskList = new CopyOnWriteArrayList<String>();
	private Map<String,Runnable> othersU2CUpdateTaskMap = new ConcurrentHashMap<String,Runnable>(); 
	
	private RecommendCPUpdateTaskList(){}
	
	public static RecommendCPUpdateTaskList getInstance(){
		return recommendCPUpdateTaskList;
	}
	
	public Boolean addSelfU2CUpdateTask(String uid,Runnable task){
		if(!selfU2CUpdateTaskList.contains(uid)){
			selfU2CUpdateTaskList.add(uid);
			selfU2CUpdateTaskMap.put(uid, task);
			return true;
		}
		return false;
	}
	
	public Runnable addOthersU2CUpdateTask(String uid,Runnable task){
		if(!othersU2CUpdateTaskList.contains(uid)){
			othersU2CUpdateTaskList.add(uid);
			othersU2CUpdateTaskMap.put(uid, task);
			return null;
		}else{
			othersU2CUpdateTaskList.remove(uid);
			othersU2CUpdateTaskList.add(uid);
			Runnable oldTask = othersU2CUpdateTaskMap.get(uid);
			othersU2CUpdateTaskMap.replace(uid, task);
			return oldTask;
		}
	}
	
	public void removeU2CUpdateTask(String uid,Boolean ifSelfUpdate){
		if(ifSelfUpdate){
			selfU2CUpdateTaskList.remove(uid);
			selfU2CUpdateTaskMap.remove(uid);
		}else{
			othersU2CUpdateTaskList.remove(uid);
			othersU2CUpdateTaskMap.remove(uid);
		}
	}
	
}

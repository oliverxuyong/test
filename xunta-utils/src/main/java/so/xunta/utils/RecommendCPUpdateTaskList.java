package so.xunta.utils;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

public class RecommendCPUpdateTaskList {
	private static RecommendCPUpdateTaskList recommendCPUpdateTaskList = new RecommendCPUpdateTaskList();
	private List<String> u2CUpdateTaskList = new CopyOnWriteArrayList<String>();
	private Map<String,Runnable> u2CUpdateTaskMap = new ConcurrentHashMap<String,Runnable>(); 
	
	private RecommendCPUpdateTaskList(){}
	
	public static RecommendCPUpdateTaskList getInstance(){
		return recommendCPUpdateTaskList;
	}
	
	public Boolean addSelfU2CUpdateTask(String uid,Runnable task){
		if(!u2CUpdateTaskList.contains(uid)){
			u2CUpdateTaskList.add(uid);
			u2CUpdateTaskMap.put(uid, task);
			return true;
		}
		return false;
	}
	
	public Runnable addOthersU2CUpdateTask(String uid,Runnable task){
		if(!u2CUpdateTaskList.contains(uid)){
			u2CUpdateTaskList.add(uid);
			u2CUpdateTaskMap.put(uid, task);
			return null;
		}else{
			u2CUpdateTaskList.remove(uid);
			u2CUpdateTaskList.add(uid);
			Runnable oldTask = u2CUpdateTaskMap.get(uid);
			u2CUpdateTaskMap.replace(uid, task);
			return oldTask;
		}
	}
	
	public void removeU2CUpdateTask(String uid){
		u2CUpdateTaskList.remove(uid);
		u2CUpdateTaskMap.remove(uid);
	}
	
}

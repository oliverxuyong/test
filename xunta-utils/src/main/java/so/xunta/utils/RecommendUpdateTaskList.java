package so.xunta.utils;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RecommendUpdateTaskList {
	public static final Boolean SELF_UPDATE = true;
	public static final Boolean OTHERS_UPDATE = false;
	private static RecommendUpdateTaskList recommendCPUpdateTaskList = new RecommendUpdateTaskList();
	private Map<String,Runnable> selfU2CUpdateTaskMap = new ConcurrentHashMap<String,Runnable>(); 
	private Map<String,Runnable> othersU2CUpdateTaskMap = new ConcurrentHashMap<String,Runnable>(); 
	
	private RecommendUpdateTaskList(){}
	
	public static RecommendUpdateTaskList getInstance(){
		return recommendCPUpdateTaskList;
	}
	
	public Boolean addSelfU2CUpdateTask(String uid,Runnable task){
		if(!selfU2CUpdateTaskMap.containsKey(uid)){
			selfU2CUpdateTaskMap.put(uid, task);
			return true;
		}
		return false;
	}
	
	public Runnable addOthersU2CUpdateTask(String uid,Runnable task){
		return othersU2CUpdateTaskMap.replace(uid, task);
	}
	
	public void removeU2CUpdateTask(String uid,Boolean ifSelfUpdate){
		if(ifSelfUpdate){
			selfU2CUpdateTaskMap.remove(uid);
		}else{
			othersU2CUpdateTaskMap.remove(uid);
		}
	}
	
}

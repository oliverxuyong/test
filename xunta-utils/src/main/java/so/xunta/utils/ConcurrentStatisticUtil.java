package so.xunta.utils;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentStatisticUtil {
	private static ConcurrentStatisticUtil concurrentStatisticUtil = new ConcurrentStatisticUtil();
	private Map<String,Integer> updateU2CTimesMap = new ConcurrentHashMap<String,Integer>();
	private Map<String,Integer> recordU2UTimesMap = new ConcurrentHashMap<String,Integer>();
	
	private ConcurrentStatisticUtil(){
	}
	
	public static ConcurrentStatisticUtil getInstance(){
		return concurrentStatisticUtil;
	}
	
	public Map<String, Integer> getUpdateU2CTimesMap() {
		return updateU2CTimesMap;
	}

	public Map<String, Integer> getRecordU2UTimesMap() {
		return recordU2UTimesMap;
	}

	public void addUpdateU2COneTime(String uid){
		Integer times = updateU2CTimesMap.get(uid);
		if(times==null||times==0){
			times =1;
			updateU2CTimesMap.put(uid, times);
		}else{
			times++;
			updateU2CTimesMap.put(uid, times);
		}
	}
	
	public void addRecordU2UOneTime(String uid){
		Integer times = recordU2UTimesMap.get(uid);
		if(times==null||times==0){
			times=1;
			recordU2UTimesMap.put(uid, times);
		}else{
			times++;
			recordU2UTimesMap.put(uid, times);
		}
	}
	
	public void clear(){
		updateU2CTimesMap.clear();
		recordU2UTimesMap.clear();
	}
	
}

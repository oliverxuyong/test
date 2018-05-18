package so.xunta.utils;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RecommendPushUtil {
	private static RecommendPushUtil recommendPushUtil = new RecommendPushUtil();
	private Map<String,List<String>> userPreviousMatchedUidsMap = new ConcurrentHashMap<String,List<String>>();
	private Map<String,List<String>> userPreviousRecommendCpsMap = new ConcurrentHashMap<String,List<String>>();

	private RecommendPushUtil() {}
	
	public static RecommendPushUtil getInstance(){
		return recommendPushUtil;
	}
	
	public Boolean recordUserMatchedUids(String uid, List<String> matchedUids){
		if(!userPreviousMatchedUidsMap.containsKey(uid)){
			userPreviousMatchedUidsMap.put(uid, matchedUids);
			return true;
		}else{
			return false;
		}
	}
	
	public Boolean recordUserRecommendCps(String uid,List<String> recommendCpids){
		if(!userPreviousRecommendCpsMap.containsKey(uid)){
			userPreviousRecommendCpsMap.put(uid, recommendCpids);
			return true;
		}else{
			return false;
		}
	}
	
	public List<String> getUserRecommendCps(String uid){
		List<String> recommendCpids = userPreviousRecommendCpsMap.get(uid);
		userPreviousRecommendCpsMap.remove(uid);
		return recommendCpids;
	}
	
	public List<String> getUserMatchedUids(String uid){
		List<String> matchedUids = userPreviousMatchedUidsMap.get(uid);
		userPreviousMatchedUidsMap.remove(uid);
		return matchedUids;
	}
	
	@Deprecated
	public void removeUserData(String uid){
		userPreviousRecommendCpsMap.remove(uid);
		userPreviousMatchedUidsMap.remove(uid);
	}
	
	public void removeMatchedUids(String uid){
		userPreviousMatchedUidsMap.remove(uid);
	}
	
	public void removeCps(String uid){
		userPreviousRecommendCpsMap.remove(uid);
	}
}

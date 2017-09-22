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
	
	public void recordUserMatchedUids(String uid, List<String> matchedUids){
		userPreviousMatchedUidsMap.put(uid, matchedUids);
	}
	
	public void recordUserRecommendCps(String uid,List<String> recommendCpids){
		userPreviousRecommendCpsMap.put(uid, recommendCpids);
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
}

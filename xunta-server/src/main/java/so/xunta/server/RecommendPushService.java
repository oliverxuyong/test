package so.xunta.server;

import so.xunta.beans.RecommendPushDTO;

public interface RecommendPushService {
	
	public void recordStatusBeforeUpdateTask(String uid,int updateType);
	
	public RecommendPushDTO generatePushDataAfterUpdateTask(String uid,int updateType);
}

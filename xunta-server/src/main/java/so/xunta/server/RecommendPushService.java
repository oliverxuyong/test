package so.xunta.server;

import so.xunta.beans.RecommendPushDTO;

public interface RecommendPushService {
	
	public Boolean recordCPStatusBeforeUpdateTask(String uid,int updateType);
	
	public Boolean recordUserStatusBeforeUpdateTask(String uid);
	
	@Deprecated
	public RecommendPushDTO generatePushDataAfterUpdateTask(String uid,int updateType);
	
	public RecommendPushDTO generatePushUserAfterUpdateTask(String uid);
	
	public RecommendPushDTO generatePushCPAfterUpdateTask(String uid,int updateType);
	
	@Deprecated
	public void clearUserStatus(String uid);
	
	public void clearPushUser(String uid);
	
	public void clearPushCp(String uid);
}

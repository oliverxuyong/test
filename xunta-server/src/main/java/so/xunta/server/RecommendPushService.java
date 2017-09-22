package so.xunta.server;

import so.xunta.beans.RecommendPushDTO;

public interface RecommendPushService {
	public static final int U_TOP_NUM = 10;//前U_TOP_NUM名的匹配用户如果排位发生了变化，就推送
	public static final int U_LISTEN_NUM = 10;  //匹配列表长度
	public static final int CP_THRESHOLD = 10; //如果一个cp原先推荐值从CP_LISTEN_NUM名之外一下跳到前CP_THRESHOLD的位置，就推送
	public static final int CP_LISTEN_NUM = 10;	
	
	public void recordStatusBeforeUpdateTask(String uid);
	
	public RecommendPushDTO generatePushDataAfterUpdateTask(String uid);
}

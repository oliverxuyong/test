package so.xunta.server;

import java.util.Set;

public interface CpShowingService {
	
	public Set<String> getUsersNeedPush(String uid,String cpid);
	
	public void initUserShowingCps(String uid);
	
	/**更新用户当前正在显示的cp列表
	 * @param 更新用户id
	 * @param 新一批cpid，如果为null则清空原先的显示列表
	 * */
	public void addUserShowingCps(String uid, Set<String> cpids);
	
	public void clearUserShowingCps(String uid);
	
	public void deleteUserShowingCp(String uid, String cpId);
	
	public int getCpSelectedUserCounts(String cpid,String userEventScope);
	
}

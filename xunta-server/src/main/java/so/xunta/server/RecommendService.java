package so.xunta.server;

import so.xunta.beans.User;

public interface RecommendService {
	public static final int SELECT_CP=0;
	public static final int UNSELECT_CP=1;
	
	/**
	 * 记录任务
	 * 在用户选中或取消一个CP后率先触发
	 * 记录用户选择或删除一个CP后U2U的变化状态
	 * */
	public void recordU2UChange(String uid, String cpid, int selectType);
	
	/**
	 * 更新任务
	 * 在用户上线，请求一组CP列表后，和选中或取消一个CP的纪录任务后触发
	 * 通过用户的U2U变化状态更新推荐列表
	 * */
	public void updateU2C(String uid);

	/**
	 * 用户每次上线的初始化任务，包括
	 * 将last updated time存入redis, 触发一次更新任务
	 * */
	public void initRecommendParm(User u);
	
	/**
	 * 将用户的lastUpdateTime从Redis同步到数据库中
	 * */
	public void syncLastUpdateTime(User u);
}

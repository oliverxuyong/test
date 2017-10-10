package so.xunta.server;

import java.util.List;
import java.util.Set;

import so.xunta.beans.User;

public interface RecommendService {
	public static final int SELECT_CP=0;
	public static final int UNSELECT_CP=1;
	public static final String POSITIVE_SELECT = "P";
	public static final String NEGATIVE_SELECT = "N";
	
	/**
	 * 记录任务
	 * 在用户选中或取消一个CP后率先触发
	 * 记录用户选择或删除一个CP后U2U的变化状态
	 * @param uid：操作用户id
	 * @param cpid：用户选择的cpid
	 * @param selectType:“Y/N” 选中或取消
	 * @return 此次操作后需要触发更新任务的关联用户id
	 * */
	public Set<String> recordU2UChange(String uid, String cpid, String property, int selectType);
	
	/**
	 * 更新任务
	 * 在用户上线，请求一组CP列表后，和选中或取消一个CP的纪录任务后触发
	 * 通过用户的U2U变化状态更新推荐列表
	 * @param uid：需要更新的用户id
	 * @return：更新是否成功执行，是为true，否为false
	 * */
	public Boolean updateU2C(String uid);

	/**
	 * 用户每次上线的初始化任务，包括
	 * 将last updated time存入redis, 触发一次更新任务
	 * */
	public void initRecommendParm(User u);
	
	/**
	 * 服务器启动时运行
	 * */
	public void init();
	
	/**
	 * 用户U2C中的推荐CP少于一定值时，从Initial CP中调取一部分进行补充
	 * */
	public void replenish(String uid);
	
	/**
	 * 将用户的lastUpdateTime从Redis同步到数据库中
	 * */
	public void syncLastUpdateTime(User u);
	
	public void signCpsPresented(String uid,List<String> pushedCpIds);
	
	/**
	 * 检查用户的update任务当前是否可执行
	 * */
	public Boolean ifUpdateExecutable(String uid);
}

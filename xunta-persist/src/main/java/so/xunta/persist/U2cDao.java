package so.xunta.persist;

import java.util.List;
import java.util.Map;
import java.util.Set;

import redis.clients.jedis.Tuple;

public interface U2cDao {
	/**
	 * 按排名获得用户的CP和对应的分值集
	 * */
	public Set<Tuple> getUserCpsByRank(String uid, int start, int stop);
	
	/**
	 * 分数递增地添加CP
	 * */
	public double updateUserCpValue(String uid,String cpId, double dScore);
	
	/**
	 * 批量更新CP
	 * */
	public void updateUserBatchCpValue(String uid, Map<String,Double> cps);
	
	/**
	 * 将CP设为已选/已呈现
	 * */
	public void setUserCpsPresented(String uid,List<String> cpIds);
	
}

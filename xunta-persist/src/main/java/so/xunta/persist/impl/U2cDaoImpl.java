package so.xunta.persist.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Tuple;
import redis.clients.jedis.params.sortedset.ZAddParams;
import so.xunta.persist.U2cDao;
import so.xunta.utils.RedisUtil;

/**
 * @author Bright Zheng
 * 使用Redis 值为Sorted Set类型完成U2C的操作
 * */
@Repository
public class U2cDaoImpl implements U2cDao {

	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixU2C}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(U2cDaoImpl.class);
	
	@Override
	public Set<Tuple> getUserCpsByRank(String uid, int start, int stop) {
		Jedis jedis=null;
		Set<Tuple> cps = null;
		uid = keyPrefix + uid;
		try {
			jedis = redisUtil.getJedis();
			cps = jedis.zrevrangeWithScores(uid, start, stop);
		} catch (Exception e) {
			logger.error("getUserCpsByRank error:", e);
		}finally{
			jedis.close();
		}
		return cps;
	}

	@Override
	public double updateUserCpValue(String uid, String cpId,double dScore) {
		Jedis jedis=null;
		double score = 0;
		uid = keyPrefix + uid;
		try {
			jedis = redisUtil.getJedis();
			score = jedis.zincrby(uid, dScore, cpId);
		} catch (Exception e) {
			logger.error("updateUserCpValue error:", e);
		}finally{
			jedis.close();
		}
		return score;
	}

	@Override
	public void updateUserBatchCpValue(String uid, Map<String,Double> cps) {
		Jedis jedis=null;
		uid = keyPrefix + uid;
		try {
			jedis = redisUtil.getJedis();
			/*已经存入的不会重复插入
			 * */
			jedis.zadd(uid, cps,ZAddParams.zAddParams().nx());
		} catch (Exception e) {
			logger.error("updateUserBatchCpValue error:", e);
		}finally{
			jedis.close();
		}		
	}
	
	/**给推荐CP列表中已选的CP值为一个很大的负数，就算再加也不会产生影响	*/
	@Override
	public void setUserCpsPresented(String uid, List<String> cpIds) {
		Jedis jedis=null;
		uid = keyPrefix + uid;
		Map<String,Double> cps = new HashMap<String,Double>();
		for(String cpId:cpIds){
			cps.put(cpId, -Double.MAX_VALUE);
		}
		try {
			jedis = redisUtil.getJedis();
			jedis.zadd(uid, cps,ZAddParams.zAddParams().xx());//仅仅更新存在的成员
		} catch (Exception e) {
			logger.error("setUserCpsPresented error:", e);
		}finally{
			jedis.close();
		}
	}
	
	@Override
	public Boolean ifUserCpInited(String uid){
		Jedis jedis=null;
		uid = keyPrefix + uid;
		Boolean ifexist =null;

		try {
			jedis = redisUtil.getJedis();
			ifexist = jedis.exists(uid);
		} catch (Exception e) {
			logger.error("ifUserCpInited error:", e);
		}finally{
			jedis.close();
		}
		return ifexist;
	}
	
	@Override
	public Boolean ifNeedReplenish(String uid){
		Jedis jedis = null;
		uid = keyPrefix + uid;
		final int THRESHOLD = 30;//需要补充的阈值
		
		try {
			jedis = redisUtil.getJedis();
			int surplus = jedis.zcount(uid, 0, Double.MAX_VALUE).intValue();
			if(surplus <= THRESHOLD){
				return true;
			}
		} catch (Exception e) {
			logger.error("ifneedReplenish error:", e);
		}finally{
			jedis.close();
		}
		return false;
	}
}

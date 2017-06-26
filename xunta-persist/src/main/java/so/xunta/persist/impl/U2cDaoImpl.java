package so.xunta.persist.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
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
	
	@Value("$(redis.keyPrefixU2C)")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(U2cDaoImpl.class);
	
	@Override
	public Set<Tuple> getUserCpsByRank(String uid, int start, int stop) {
		Jedis jedis=null;
		Set<Tuple> cps = null;
		uid = uid + keyPrefix;
		try {
			jedis = redisUtil.getJedis();
			cps = jedis.zrangeWithScores(uid, start, stop);
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
		uid = uid + keyPrefix;
		try {
			jedis = redisUtil.getJedis();
			score = jedis.zadd(uid, dScore, cpId);
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
		uid = uid + keyPrefix;
		try {
			jedis = redisUtil.getJedis();
			for(Entry<String,Double> entry:cps.entrySet()){
				String cpid = entry.getKey();
				Double score = entry.getValue();
				jedis.zincrby(uid, score, cpid);
			}
		} catch (Exception e) {
			logger.error("updateUserBatchCpValue error:", e);
		}finally{
			jedis.close();
		}		
	}

	@Override
	public void setUserCpsPresented(String uid, List<String> cpIds) {
		Jedis jedis=null;
		uid = uid + keyPrefix;
		Map<String,Double> cps = new HashMap<String,Double>();
		for(String cpId:cpIds){
			cps.put(cpId, -Double.MAX_VALUE);//给传入CP的score设为很小的一个数，使之排到末尾
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
}

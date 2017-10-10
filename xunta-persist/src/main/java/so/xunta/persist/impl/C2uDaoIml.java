package so.xunta.persist.impl;

import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import so.xunta.persist.C2uDao;
import so.xunta.utils.RedisUtil;

/**
 * @author Bright Zheng
 * 使用Redis 值为Set类型完成C2U的操作
 * */
@Repository
public class C2uDaoIml implements C2uDao {
	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixC2U}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(C2uDaoIml.class);
	

	@Override
	public Set<String> getUsersSelectedSameCp(String cpId,String property) {
		Jedis jedis=null;
		Set<String> uids=null;
		cpId = keyPrefix + property + cpId;
		try {
			jedis = redisUtil.getJedis();
			uids = jedis.smembers(cpId);
		} catch (Exception e) {
			logger.error("getUsersSelectedSameCp error:", e);
		}finally{
			jedis.close();
		}
		return uids;
	}

	@Override
	public Long getHowManyPeopleSelected(String cpId,String property) {
		Jedis jedis=null;
		Long userCounts=null;
		cpId = keyPrefix + property + cpId;
		try {
			jedis = redisUtil.getJedis();
			userCounts = jedis.scard(cpId);
		} catch (Exception e) {
			logger.error("getHowManyPeopleSelected error:", e);
		}finally{
			jedis.close();
		}
		return userCounts;
	}
	
	@Override
	public void saveCpOneUser(String cpId, String uid,String property) {
		Jedis jedis=null;
		cpId = keyPrefix + property + cpId;
		try {
			jedis = redisUtil.getJedis();
			jedis.sadd(cpId, uid);
		} catch (Exception e) {
			logger.error("saveCpOneUser error:", e);
		}finally{
			jedis.close();
		}
	}

	@Override
	public void deleteUserInCp(String cpId, String uid,String property) {
		Jedis jedis=null;
		cpId = keyPrefix + property + cpId;
		try {
			jedis = redisUtil.getJedis();
			jedis.srem(cpId, uid);
		} catch (Exception e) {
			logger.error("deleteUserInCp error:", e);
		}finally{
			jedis.close();
		}
	}

}

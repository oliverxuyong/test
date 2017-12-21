package so.xunta.persist.impl;

import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Tuple;
import so.xunta.persist.ScopeMatchedUserDao;
import so.xunta.utils.RedisUtil;

@Repository
public class ScopeMatchedUserDaoImpl implements ScopeMatchedUserDao {
	
	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixGroupMatchedUser}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(ScopeMatchedUserDaoImpl.class);
	
	
	@Override
	public void updatePairMatchedUser(String userGroup, String pairUserName, Double score) {
		Jedis jedis=null;
		String key = userGroup+ keyPrefix;
		try {
			jedis = redisUtil.getJedis();
			Double preScore= jedis.zscore(key, pairUserName);
			if(preScore==null || preScore<score){
				jedis.zadd(key, score, pairUserName);
			}
		} catch (Exception e) {
			logger.error("updatePairMatchedUser error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		
	}

	@Override
	public Set<Tuple> getPairMatchedUsers(String userGroup) {
		Jedis jedis=null;
		Set<Tuple> pairMatchedUsers = null;
		String key = userGroup+ keyPrefix;
		try {
			jedis = redisUtil.getJedis();
			pairMatchedUsers = jedis.zrevrangeWithScores(key, 0, -1);
			jedis.del(key);
		} catch (Exception e) {
			logger.error("getPairMatchedUsers error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return pairMatchedUsers;
	}

}
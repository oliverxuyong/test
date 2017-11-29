package so.xunta.persist.impl;

import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Tuple;
import redis.clients.jedis.params.sortedset.ZAddParams;
import so.xunta.persist.GroupMatchedUserDao;
import so.xunta.utils.RedisUtil;

@Repository
public class GroupMatchedUserDaoImpl implements GroupMatchedUserDao {
	
	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixGroupMatchedUser}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(GroupMatchedUserDaoImpl.class);
	
	
	@Override
	public void updatePairMatchedUser(String userGroup, String pairUserName, Double score) {
		Jedis jedis=null;
		String key = userGroup+ keyPrefix;
		try {
			jedis = redisUtil.getJedis();
			jedis.zadd(key, score, pairUserName, ZAddParams.zAddParams().nx());
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

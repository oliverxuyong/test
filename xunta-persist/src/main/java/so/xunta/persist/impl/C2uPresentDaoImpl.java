package so.xunta.persist.impl;

import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import so.xunta.persist.C2uPresentDao;
import so.xunta.utils.RedisUtil;

@Repository
public class C2uPresentDaoImpl implements C2uPresentDao{
	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixC2UPresent}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(C2uPresentDaoImpl.class);

	@Override
	public void setCpPresentUser(String cpid, String uid) {
		Jedis jedis=null;
		cpid = keyPrefix + cpid;

		try {
			jedis = redisUtil.getJedis();
			jedis.sadd(cpid, uid);
		} catch (Exception e) {
			logger.error("setCpPresentUser error:", e);
		}finally{
			jedis.close();
		}	
	}

	@Override
	public Set<String> getCpPresentUsers(String cpid) {
		Jedis jedis=null;
		cpid = keyPrefix + cpid;
		Set<String> returnUids = null;
		
		try {
			jedis = redisUtil.getJedis();
			returnUids = jedis.smembers(cpid);
		} catch (Exception e) {
			logger.error("getCpPresentUsers error:", e);
		}finally{
			jedis.close();
		}	
		return returnUids;
	}

	@Override
	public void deleteCpPresentUser(String cpid, String uid) {
		Jedis jedis=null;
		cpid = keyPrefix + cpid;

		try {
			jedis = redisUtil.getJedis();
			jedis.srem(cpid, uid);
		} catch (Exception e) {
			logger.error("deleteCpPresentUser error:", e);
		}finally{
			jedis.close();
		}	
		
	}

}

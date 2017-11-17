package so.xunta.persist.impl;

import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import so.xunta.persist.U2cPresentDao;
import so.xunta.utils.RedisUtil;

/**
 * @author Bright
 *
 */
@Repository
public class U2cPresentDaoImpl implements U2cPresentDao {
	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixU2CPresent}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(U2cPresentDaoImpl.class);

	@Override
	public void setUserPresentCps(String uid, Set<String> cpids) {
		Jedis jedis=null;
		uid = keyPrefix + uid;

		try {
			jedis = redisUtil.getJedis();
			for(String cpid:cpids){
				jedis.sadd(uid, cpid);
			}
		} catch (Exception e) {
			logger.error("setUserPresentCps error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
	}


	@Override
	public Set<String> getUserPresentCps(String uid) {
		Jedis jedis=null;
		uid = keyPrefix + uid;
		Set<String> returnCps = null;
		
		try {
			jedis = redisUtil.getJedis();
			returnCps = jedis.smembers(uid);
		} catch (Exception e) {
			logger.error("getUserPresentCps error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return returnCps;
	}


	@Override
	public void dropUserPresentCps(String uid) {
		Jedis jedis=null;
		uid = keyPrefix + uid;
		
		try {
			jedis = redisUtil.getJedis();
			jedis.del(uid);
		} catch (Exception e) {
			logger.error("dropUserPresentCps error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}

	}

	@Override
	public void delteUserPresentCp(String uid,String cpId){
		Jedis jedis=null;
		uid = keyPrefix + uid;
		
		try {
			jedis = redisUtil.getJedis();
			jedis.srem(uid,cpId);
		} catch (Exception e) {
			logger.error("delteUserPresentCp error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
	}
}

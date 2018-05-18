package so.xunta.persist.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import so.xunta.persist.UserLastU2UUpdateTimeDao;
import so.xunta.utils.RedisUtil;

@Repository
public class UserLastU2UUpdateTimeDaoImpl implements UserLastU2UUpdateTimeDao {

	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixUserUpdateTimeUU}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(UserLastU2UUpdateTimeDaoImpl.class);
	
	@Override
	public String getUserLastUpdateTime(String uid) {
		Jedis jedis=null;
		String updateTime = null;
		uid = keyPrefix + uid;
		try {
			jedis = redisUtil.getJedis();
			updateTime = jedis.get(uid);
		} catch (Exception e) {
			logger.error("getUserLastUpdateTime error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}	
		return updateTime;
	}

	@Override
	public void setUserLastUpdateTime(String uid, String date) {
		Jedis jedis=null;
		uid = keyPrefix + uid;
		try {
			jedis = redisUtil.getJedis();
			jedis.set(uid, date);
		} catch (Exception e) {
			logger.error("setUserLastUpdateTime error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
	}
	
	@Override
	public void clearUserLastUpdateTime(String uid){
		Jedis jedis=null;
		uid = keyPrefix + uid;
		try {
			jedis = redisUtil.getJedis();
			jedis.del(uid);
		} catch (Exception e) {
			logger.error("clearUserLastUpdateTime error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
	}

}

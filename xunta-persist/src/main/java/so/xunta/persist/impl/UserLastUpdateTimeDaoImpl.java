package so.xunta.persist.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import so.xunta.persist.UserLastUpdateTimeDao;
import so.xunta.utils.RedisUtil;

@Repository
public class UserLastUpdateTimeDaoImpl implements UserLastUpdateTimeDao {

	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixUserUpdateTime}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(UserLastUpdateTimeDaoImpl.class);
	
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

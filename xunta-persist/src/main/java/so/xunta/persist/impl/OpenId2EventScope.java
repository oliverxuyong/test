package so.xunta.persist.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import so.xunta.persist.OpenId2EventScopeDao;
import so.xunta.utils.RedisUtil;

@Repository
public class OpenId2EventScope implements OpenId2EventScopeDao {
	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixOpenId2EventScope}")
	private String key;
	
	Logger logger =Logger.getLogger(OpenId2EventScope.class);
	

	@Override
	public String getEventScope(String openId) {
		Jedis jedis=null;
		String eventScope=null;
		try {
			jedis = redisUtil.getJedis();
			eventScope = jedis.hget(key, openId);
			jedis.hdel(key, openId);
		} catch (Exception e) {
			logger.error("getEventScope error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return eventScope;
	}

	@Override
	public void setOpenId(String openId, String eventScope) {
		Jedis jedis=null;
		try {
			jedis = redisUtil.getJedis();
			jedis.hset(key, openId, eventScope);
		} catch (Exception e) {
			logger.error("setOpenId error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
	}

}

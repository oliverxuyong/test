package so.xunta.utils;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

@Repository("redisUtil")
public class RedisUtil {
	Logger logger =Logger.getLogger(RedisUtil.class);
	
	@Autowired
	private JedisPool jedisPool;
	
	/*通过这个无法获得Resource，暂时取消
	private ThreadLocal<Jedis> conn = new ThreadLocal<Jedis>(){
		@Override
		protected Jedis initialValue() {	
			try{
				return jedisPool.getResource();
			} catch (Exception e) {
	            logger.error("getRedisResource error:", e);
				return null;
	        }
		}	
	};*/
	
	public Jedis getJedis(){
		//return conn.get();
		return jedisPool.getResource();
	}
}

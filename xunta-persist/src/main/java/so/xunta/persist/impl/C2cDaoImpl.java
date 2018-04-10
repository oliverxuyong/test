package so.xunta.persist.impl;

import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import so.xunta.persist.C2cDao;
import so.xunta.utils.RedisUtil;

@Repository
public class C2cDaoImpl implements C2cDao {
	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixC2C}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(C2cDaoImpl.class);
	
	@Override
	public void setCpRelateCps(String cpId, Map<String,String> relateCps) {
		Jedis jedis = null;
		cpId = keyPrefix + cpId;
		
		try {
			jedis = redisUtil.getJedis();
			jedis.hmset(cpId, relateCps);
		} catch (Exception e) {
			logger.error("setCpRelateCps error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		
	}

	@Override
	public Map<String, String> getCpRelateCps(String cpId) {
		Jedis jedis = null;
		cpId = keyPrefix + cpId;
		Map<String,String> relateCps= null;
		
		try {
			jedis = redisUtil.getJedis();
			relateCps = jedis.hgetAll(cpId);
		} catch (Exception e) {
			logger.error("setCpRelateCps error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return relateCps;
	}

}

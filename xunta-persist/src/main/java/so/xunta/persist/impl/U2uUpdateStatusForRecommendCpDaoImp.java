package so.xunta.persist.impl;

import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import so.xunta.persist.U2uUpdateStatusForRecommendCpDao;
import so.xunta.utils.RedisUtil;

@Repository
public class U2uUpdateStatusForRecommendCpDaoImp implements U2uUpdateStatusForRecommendCpDao {

	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixU2UUpdateStatusForCP}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(U2uUpdateStatusForRecommendCpDaoImp.class);
	
	
	@Override
	public Double updateDeltaRelationValue(String centerUid, String relateUid, double dValue) {
		if(centerUid==null||relateUid==null){
			return 0.0;
		}else if(centerUid.equals(relateUid)){
			return 0.0;
		}
		Jedis jedis = null;
		double updateValue = 0;
		centerUid = keyPrefix + centerUid;
		try {
			jedis = redisUtil.getJedis();
			updateValue = jedis.hincrByFloat(centerUid, relateUid, dValue);
		} catch (Exception e) {
			logger.error("updateDeltaRelationValue error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return updateValue;
	}

	@Override
	public Map<String, String> getUserUpdateStatus(String centerUid) {
		Jedis jedis = null;
		Map<String, String> updateStatus = null;
		centerUid = keyPrefix + centerUid;
		try {
			jedis = redisUtil.getJedis();
			updateStatus = jedis.hgetAll(centerUid);
		} catch (Exception e) {
			logger.error("getUserUpdateStatus error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return updateStatus;
	}

	@Override
	public void deleteU2uUpdateStatus(String centerUid) {
		Jedis jedis = null;
		centerUid = keyPrefix + centerUid;
		try {
			jedis = redisUtil.getJedis();
			jedis.del(centerUid);
		} catch (Exception e) {
			logger.error("deleteU2uUpdateStatus error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
	}
	
}

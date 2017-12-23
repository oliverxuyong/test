package so.xunta.persist.impl;

import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import so.xunta.persist.U2uCpDetailDao;
import so.xunta.utils.RedisUtil;

@Repository
public class U2uCpDetailDaoImpl implements U2uCpDetailDao {
	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixU2UCpDetail}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(U2uCpDetailDaoImpl.class);
	
	@Override
	public void addU2uOneCp(String uid1, String uid2, String property, String cpId, String cpText) {
		if(uid1.equals(uid2)){
			return;
		}
		Jedis jedis = null;
		String key =  generateKey(uid1, uid2, property);
		try {
			jedis = redisUtil.getJedis();
			jedis.hset(key, cpId, cpText);
		} catch (Exception e) {
			logger.error("addU2uOneCp error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
	}

	@Override
	public void addU2uCps(String uid1, String uid2, String property, Map<String, String> cps) {
		if(uid1.equals(uid2)){
			return;
		}
		Jedis jedis = null;
		String key =  generateKey(uid1, uid2, property);
		try {
			jedis = redisUtil.getJedis();
			jedis.hmset(key, cps);
		} catch (Exception e) {
			logger.error("addU2uCps error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
	}

	@Override
	public Map<String,String> getCps(String uid1, String uid2, String property) {
		if(uid1.equals(uid2)){
			return null;
		}
		Jedis jedis = null;
		String key =  generateKey(uid1, uid2, property);
		Map<String,String> u2Ucps = null;
		
		try {
			jedis = redisUtil.getJedis();
			u2Ucps = jedis.hgetAll(key);
		} catch (Exception e) {
			logger.error("getCps error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return u2Ucps;
	}

	@Override
	public Set<String> getCpIds(String uid1, String uid2, String property) {
		if(uid1.equals(uid2)){
			return null;
		}
		Jedis jedis = null;
		String key =  generateKey(uid1, uid2, property);
		Set<String> u2UcpIds = null;
		
		try {
			jedis = redisUtil.getJedis();
			u2UcpIds = jedis.hkeys(key);
		} catch (Exception e) {
			logger.error("getCpIds error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return u2UcpIds;
	}
	
	@Override
	public void removeU2uOneCp(String uid1, String uid2, String property, String cpId) {
		if(uid1.equals(uid2)){
			return;
		}
		Jedis jedis = null;
		String key =  generateKey(uid1, uid2, property);
		
		try {
			jedis = redisUtil.getJedis();
			jedis.hdel(key, cpId);
		} catch (Exception e) {
			logger.error("removeU2uOneCp error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
	}

	private String generateKey(String uid1,String uid2,String property){
		Long uid1L = Long.valueOf(uid1);
		Long uid2L = Long.valueOf(uid2);
		String key = null;
		
		if(uid1L > uid2L){
			key = keyPrefix + uid2 + uid1 + property;
		}else{
			key = keyPrefix + uid1 + uid2 + property;
		}
		
		return key;
	}
}

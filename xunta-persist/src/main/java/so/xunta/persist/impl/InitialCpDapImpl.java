package so.xunta.persist.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Tuple;
import so.xunta.persist.EventScopeCpTypeMappingDao;
import so.xunta.persist.InitialCpDao;
import so.xunta.utils.RedisUtil;

@Repository
public class InitialCpDapImpl implements InitialCpDao {
	//private final int INIT_COUNTS = 150;//用户初始化时从Initial中取多少个CP
	
	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyInitialCp}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(InitialCpDapImpl.class);
	
	@Override
	public boolean ifexist(String eventScope){
		Jedis jedis=null;
		String key = keyPrefix+eventScope;
		Boolean ifexist =false;
		try {
			jedis = redisUtil.getJedis();
			ifexist = jedis.exists(key);
		}catch(Exception e){
			logger.error("ifexist error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return ifexist;
	}
	
	@Override
	public void setCps(Map<String,Double> cps, String eventScope) {
		Jedis jedis=null;
		String key = keyPrefix+eventScope;
		try {
			jedis = redisUtil.getJedis();
			jedis.zadd(key, cps);
		}catch(Exception e){
			logger.error("setCps error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
	}

	@Override
	public void setCp(String cpId, Double score, String eventScope) {
		Jedis jedis=null;
		String key = keyPrefix+eventScope;
		try {
			jedis = redisUtil.getJedis();
			jedis.zadd(key, score, cpId);
		}catch(Exception e){
			logger.error("setCp error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}	
	}
	
	/**
	 * 用户初始化时返回对应的eventScope的CP
	 * */
	@Override
	public Map<String, Double> getInitialCps(String eventScope) {
		Jedis jedis=null;
		String key = keyPrefix+eventScope;
		Map<String,Double> returncps = new HashMap<String,Double>();

		try {
			jedis = redisUtil.getJedis();
			Set<Tuple> cps = jedis.zrevrangeWithScores(key, 0, -1);
			for(Tuple cp:cps){
				returncps.put(cp.getElement(),cp.getScore());
			}
		}catch(Exception e){
			logger.error("getInitialCps error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return returncps;
	}

	@Override
	public Map<String,Double> getRandomGeneralCps(int number){
		Jedis jedis=null;
		String key = keyPrefix + EventScopeCpTypeMappingDao.DEFAULT_EVENT_SCOPE;
		Map<String,Double> returncps = new HashMap<String,Double>();
		
		try {
			jedis = redisUtil.getJedis();
			/*将所有cp按请求数分区，随机选择一个区的cp
			 * */
			int totalCounts = jedis.zcard(key).intValue();
			int level = totalCounts/number;
			int start = (new Random().nextInt(level+1))*number;
			Set<Tuple> cps = jedis.zrevrangeWithScores(key, start, start+number);
			for(Tuple cp:cps){
				returncps.put(cp.getElement(),cp.getScore());
			}
		}catch(Exception e){
			logger.error("getRandomGeneralCps error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return returncps;
	}

	@Override
	public void removeInitialCps(String eventScope) {
		Jedis jedis=null;
		String key = keyPrefix+eventScope;
		
		try {
			jedis = redisUtil.getJedis();
			jedis.del(key);
		}catch(Exception e){
			logger.error("removeInitialCps error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
	}


	
	/*
	public Map<String,Double> getRandomCps(String eventScope, int number){
		Jedis jedis=null;
		String key = keyPrefix+eventScope;
		Map<String,Double> returncps = new HashMap<String,Double>();
		
		try {
			jedis = redisUtil.getJedis();
			//将所有cp按请求数分区，随机选择一个区的cp
			
			int totalCounts = jedis.zcard(key).intValue();
			if(totalCounts > INIT_COUNTS){
				int level = (totalCounts - INIT_COUNTS)/number;
				int start = INIT_COUNTS+(new Random().nextInt(level+1))*number;
				Set<Tuple> cps = jedis.zrevrangeWithScores(key, start, start+number);
				for(Tuple cp:cps){
					returncps.put(cp.getElement(),cp.getScore());
				}
			}
		}catch(Exception e){
			logger.error("getRandomCps error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return returncps;
	}*/
}

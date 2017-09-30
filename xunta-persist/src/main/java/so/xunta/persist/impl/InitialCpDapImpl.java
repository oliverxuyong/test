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
import so.xunta.persist.InitialCpDao;
import so.xunta.utils.RedisUtil;

@Repository
public class InitialCpDapImpl implements InitialCpDao {
	private final int INIT_COUNTS = 50;//用户初始化时从Initial中取多少个CP
	
	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyInitialCp}")
	private String key;
	
	Logger logger =Logger.getLogger(InitialCpDapImpl.class);
	
	@Override
	public boolean ifexist(){
		Jedis jedis=null;
		Boolean ifexist =null;
		try {
			jedis = redisUtil.getJedis();
			ifexist = jedis.exists(key);
		}catch(Exception e){
			logger.error("init error:", e);
		}finally{
			jedis.close();
		}
		return ifexist;
	}
	
	@Override
	public void setCps(Map<String,Double> cps) {
		Jedis jedis=null;
		try {
			jedis = redisUtil.getJedis();
			jedis.zadd(key, cps);
		}catch(Exception e){
			logger.error("setCps error:", e);
		}finally{
			jedis.close();
		}
	}

	/**
	 * 用户第一批请求时，返回前N位
	 * */
	@Override
	public Map<String, Double> getInitialCps() {
		Jedis jedis=null;
		Map<String,Double> returncps = new HashMap<String,Double>();

		try {
			jedis = redisUtil.getJedis();
			Set<Tuple> cps = jedis.zrevrangeWithScores(key, 0, INIT_COUNTS);
			for(Tuple cp:cps){
				returncps.put(cp.getElement(),cp.getScore());
			}
		}catch(Exception e){
			logger.error("getInitialCps error:", e);
		}finally{
			jedis.close();
		}
		return returncps;
	}

	@Override
	public Map<String,Double> getRandomCps(int number){
		Jedis jedis=null;
		Map<String,Double> returncps = new HashMap<String,Double>();
		
		try {
			jedis = redisUtil.getJedis();
			int totalCounts = jedis.zcard(key).intValue();
			int level = totalCounts/number;
			int start = INIT_COUNTS+(new Random().nextInt(level))*number;
			Set<Tuple> cps = jedis.zrevrangeWithScores(key, start, start+number);
			for(Tuple cp:cps){
				returncps.put(cp.getElement(),cp.getScore());
			}
		}catch(Exception e){
			logger.error("getRandomCps error:", e);
		}finally{
			jedis.close();
		}
		return returncps;
	}
}

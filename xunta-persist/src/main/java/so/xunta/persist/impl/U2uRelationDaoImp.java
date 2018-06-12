package so.xunta.persist.impl;

import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Tuple;
import so.xunta.persist.U2uRelationDao;
import so.xunta.utils.RedisUtil;

/**
 * @author Bright Zheng
 * 使用Redis 值为Sorted Set类型完成U2U关系表的操作
 * */
@Repository
public class U2uRelationDaoImp implements U2uRelationDao {
	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyPrefixU2URelation}")
	private String keyPrefix;
	
	Logger logger =Logger.getLogger(U2uRelationDaoImp.class);
	
	@Override
	public void updateUserRelationValue(String centerUid, String relateUid, double dRelationValue) {
		if(centerUid==null || relateUid==null) {
			return;
		}else if(centerUid.equals(relateUid)){
			return;
		}
		Jedis jedis=null;
		centerUid = keyPrefix + centerUid;
		try {
			jedis = redisUtil.getJedis();
			jedis.zincrby(centerUid, dRelationValue, relateUid);
		} catch (Exception e) {
			logger.error("updateUserRelationValue error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
	}

	@Override
	public Set<Tuple> getRelatedUsersByRank(String uid, int start, int end) {
		Jedis jedis=null;
		Set<Tuple> users = null;
		uid = keyPrefix + uid;
		try {
			jedis = redisUtil.getJedis();
			users = jedis.zrevrangeWithScores(uid, start, end);
		} catch (Exception e) {
			logger.error("getRelatedUsersByRank error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return users;
	}

	@Override
	public Double getRelatedUserScore(String myuid, String relateUid) {
		Jedis jedis = null;
		Double score = null;
		myuid = keyPrefix + myuid ;
		try {
			jedis = redisUtil.getJedis();
			score = jedis.zscore(myuid, relateUid);
		} catch (Exception e) {
			logger.error("getRelatedUserScore error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		if(score == null){
			score=0.0;
		}
		return score;
	}

	@Override
	public Set<String> getRelatedUidByRank(String uid) {
		Jedis jedis=null;
		Set<String> uids = null;
		uid = keyPrefix + uid;
		try {
			jedis = redisUtil.getJedis();
			uids = jedis.zrevrangeByScore(uid, Double.MAX_VALUE, 0);
		} catch (Exception e) {
			logger.error("getRelatedUsersByRank error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return uids;
	}
	
}

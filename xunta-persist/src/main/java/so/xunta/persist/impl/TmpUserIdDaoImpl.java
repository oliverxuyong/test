package so.xunta.persist.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import so.xunta.persist.TmpUserIdDao;
import so.xunta.utils.RedisUtil;

@Repository
public class TmpUserIdDaoImpl implements TmpUserIdDao {
	@Autowired
	private RedisUtil redisUtil;
	
	@Value("${redis.keyTmpUserId}")
	private String key;

	Logger logger =Logger.getLogger(TmpUserIdDaoImpl.class);
	
	@Override
	public String getTmpUserId() {
		Jedis jedis=null;
		String tmpUserId = null;
		try {
			jedis = redisUtil.getJedis();
			tmpUserId = jedis.get(key);
			jedis.set(key, (Integer.valueOf(tmpUserId)+1)+"");
		}catch(Exception e){
			logger.error("getTmpUserId error:", e);
		}finally{
			if(jedis!=null){
				jedis.close();
			}
		}
		return tmpUserId;
		
	}

}

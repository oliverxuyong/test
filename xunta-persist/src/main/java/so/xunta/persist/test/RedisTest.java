package so.xunta.persist.test;

import java.util.Set;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Tuple;

public class RedisTest {

	public static void main(String[] args) {
		//连接本地的 Redis 服务
	      Jedis jedis = new Jedis("127.0.0.1");
	      jedis.auth("660419");
	      System.out.println("Connection to server sucessfully");
	      //查看服务是否运行
	      System.out.println("Server is running: "+jedis.ping());
	      //设置 redis 字符串数据
	      jedis.zadd("key1", 9.0, "1");
	      jedis.zadd("key1", 2.0, "2");
	      jedis.zadd("key1", 3.0, "3");
	      jedis.zadd("key1", 1.0, "4");
	      jedis.zadd("key1", 7.0, "5");
	      
	      Set<Tuple> rset = jedis.zrevrangeWithScores("key1",0,4);
	      for(Tuple a:rset){
	    	  System.out.println(a.getElement()+"; "+a.getScore());
	      }
	      
		 jedis.close();
	}
}

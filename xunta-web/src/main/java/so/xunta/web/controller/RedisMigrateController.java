package so.xunta.web.controller;

import java.io.IOException;
import java.util.Set;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import redis.clients.jedis.Jedis;

@Controller
public class RedisMigrateController {
	Logger logger = Logger.getLogger(RedisMigrateController.class);
	
	@RequestMapping(value="/redisMigration")
	public void redisMigration(HttpServletResponse response) {
		 Jedis jedis = new Jedis("127.0.0.1");
		 jedis.auth("660419");
	     System.out.println("Connection to server sucessfully");
	     //查看服务是否运行
	     System.out.println("Server is running: "+jedis.ping());
	     
	     Set<String> C2UKeys = jedis.keys("C2U:*");
	     String pattern = "^\\d+";
	     for(String key:C2UKeys){
	    	 String subKey = key.substring(5);
	    	 if(Pattern.matches(pattern, subKey)){
	    		 String cpid = subKey;
	    		 String prefix = key.substring(0, 5);
	    		 String newKey = prefix+"xunta_common"+cpid;
	    		 Long returnCode = jedis.renamenx(key, newKey);
	    		 if(returnCode==0L){
	    			 Long status = jedis.sunionstore(newKey, key,newKey);
	    			 System.out.println("存在，合并"+status);
	    		 }else{
	    			 System.out.println(key+"重命名成功"+returnCode);
	    		 }
	    	 }
	     }
	     
	     try {
			response.getWriter().write("redisMigration success");
		} catch (IOException e) {
			e.printStackTrace();
		}
	     /*
	     Set<String> C2UPreKeys = jedis.keys("C2UPre:");
	    
	     for(String key:C2UPreKeys){
	    	 String subKey = key.substring(7);
	    	 if(Pattern.matches(pattern, subKey)){
	    		 System.out.println("旧版本未退出"+key);
	    	 }
	     }
	     */
	     jedis.close();
	}
	
	@RequestMapping(value="/completeRedisMigration")
	public void completeRedisMigration(HttpServletResponse response) {
		 Jedis jedis = new Jedis("127.0.0.1");
		 jedis.auth("660419");
	     System.out.println("Connection to server sucessfully");
	     System.out.println("Server is running: "+jedis.ping());
	     Set<String> C2UKeys = jedis.keys("${redis.keyPrefixU2UCpDetail}*");
	    // String pattern = "^\\d+";
	     for(String key:C2UKeys){
	    	// String subKey = key.substring(5);
	    	// if(Pattern.matches(pattern, subKey)){
	    		 jedis.del(key);
	    	// }
	     }
	     
	     try {
			response.getWriter().write("redisMigration success");
		} catch (IOException e) {
			e.printStackTrace();
		}
	     jedis.close();
	}
	
}
	

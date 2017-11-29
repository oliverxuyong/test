package so.xunta.websocket.utils;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ConnectException;
import java.net.URL;
import java.sql.Timestamp;

import javax.net.ssl.HttpsURLConnection;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import so.xunta.beans.Token;
import so.xunta.persist.TokenDao;
import so.xunta.persist.impl.TokenDaoIml;

public class WeChatUtils {
	private Logger logger = Logger.getLogger(WeChatUtils.class);
	/*@Value("${token_url}")
	private String token_url;*/
	private final String token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";
	private TokenDao tokenDao=new TokenDaoIml();
	/**
     * 获取接口访问凭证
     * 
     * @param appid 凭证
     * @param appsecret 密钥
     * @return
     */
	public String getToken(String appid, String appsecret) {
        String accessToken = getTokenForMysql(appid);
        if(accessToken.equals("") || accessToken==null){
        	logger.debug("token_url: "+token_url);
            String requestUrl = token_url.replace("APPID", appid).replace("APPSECRET", appsecret);
            // 发起GET请求获取凭证
            String jsonStr=httpsRequest(requestUrl, "GET", null);
            
            JSONObject jsonObject =new JSONObject(jsonStr);

            if (null != jsonObject) {
                try {
                	accessToken = jsonObject.getString("access_token");
                	int expires_in=jsonObject.getInt("expires_in");//失效时间，以秒为单位
                	Long failureTimeLong=System.currentTimeMillis()+expires_in*1000;//失效时间毫秒数
                	Timestamp failureTime = new Timestamp(failureTimeLong);
                	Timestamp createTime=new Timestamp(System.currentTimeMillis());
                	tokenDao.saveToken(new Token(appid,accessToken,createTime,failureTime));//存储token
                } catch (JSONException e) {
                    logger.error("获取token失败  errcode="+jsonObject.getInt("errcode")+" errmsg="+jsonObject.getString("errmsg"));
                }
            }
        }
        return accessToken;
    }
    
    public String httpsRequest(String requestUrl, String requestMethod, String outputStr){
        try {
            URL url = new URL(requestUrl);
            HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setUseCaches(false);
            // 设置请求方式（GET/POST）
            conn.setRequestMethod(requestMethod);
            conn.setRequestProperty("content-type", "application/x-www-form-urlencoded");
            // 当outputStr不为null时向输出流写数据
            if (null != outputStr) {
                OutputStream outputStream = conn.getOutputStream();
                // 注意编码格式
                outputStream.write(outputStr.getBytes("UTF-8"));
                outputStream.close();
            }
            // 从输入流读取返回内容
            InputStream inputStream = conn.getInputStream();
            InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "utf-8");
            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
            String str = null;
            StringBuffer buffer = new StringBuffer();
            while ((str = bufferedReader.readLine()) != null) {
                buffer.append(str);
            }
            // 释放资源
            bufferedReader.close();
            inputStreamReader.close();
            inputStream.close();
            inputStream = null;
            conn.disconnect();
            return buffer.toString();
        } catch (ConnectException ce) {
        	logger.error("连接超时：{}");
        } catch (Exception e) {
        	logger.error("https请求异常：{}");
        }
        return null;
    }
    
    private String getTokenForMysql(String appid){
    	String accessToken="";
    	Token token=tokenDao.getTokenForAppid(appid);
    	if(token!=null){//数据库中存在
    		Timestamp failureTime=token.getFailureTime();
    		Long failureTimeLong=failureTime.getTime();//失效时间毫秒数
    		long nowTimeLong = System.currentTimeMillis();// 获得当前系统毫秒数,这个是1970-01-01到现在的毫秒数
    		if(failureTimeLong<nowTimeLong){//时间还没失效
    			accessToken=token.getAccessToken();
    		}
    	}
    	return accessToken;
    }
}

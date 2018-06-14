package so.xunta.utils;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class IpLocationUtil {
	private static IpLocationUtil ipLocationUtil = new IpLocationUtil();
	private IpLocationUtil(){
		
	}
	public static IpLocationUtil getInstance(){
		return ipLocationUtil;
	}
	private String sendGet(String url) {
        String result = "";
        BufferedReader in = null;
        try {
            URL realUrl = new URL(url);
            // 打开和URL之间的连接
            URLConnection connection = realUrl.openConnection();
            // 设置通用的请求属性
            connection.setRequestProperty("accept", "*/*");
            connection.setRequestProperty("connection", "Keep-Alive");
            connection.setRequestProperty("user-agent",
                    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            // 建立实际的连接
            connection.connect();
            // 获取所有响应头字段
            //Map<String, List<String>> map = connection.getHeaderFields();
            // 遍历所有的响应头字段
            /*for (String key : map.keySet()) {
                System.out.println(key + "--->" + map.get(key));
            }*/
            // 定义 BufferedReader输入流来读取URL的响应
            in = new BufferedReader(new InputStreamReader(
                    connection.getInputStream(),"gbk"));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
        } catch (Exception e) {
            System.out.println("发送GET请求出现异常！" + e);
            e.printStackTrace();
        }
        // 使用finally块来关闭输入流
        finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }
        return result;
    }
	
	/**
     * 通过用户ip获取用户所在地
     * @param userIp
     * @return
     */
    public String getUserLocation(String userIp)
    {
        String url = "http://opendata.baidu.com/api.php?query=" + userIp;
        url += "&co=&resource_id=6006&t=1433920989928&ie=utf8&oe=gbk&format=json";
        
        return jsonToMyString(sendGet(url));
    }
    
    /**
     * 将json文件解码
     * @param args
     */
    private String jsonToMyString(String str){
    	String location="";
    	JSONObject jsonObject = JSONObject.fromObject(str);
    	JSONArray data=jsonObject.getJSONArray("data");
    	//System.out.println(data);
    	JSONObject obj=(JSONObject) data.get(0);
    	location=obj.getString("location");
    	return location;
    }
}

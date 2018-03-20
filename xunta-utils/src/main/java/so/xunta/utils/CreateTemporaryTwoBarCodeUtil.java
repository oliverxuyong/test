package so.xunta.utils;

import org.apache.log4j.Logger;
import org.json.JSONObject;

/**
 * 2018.03.20 
 * @author 叶夷 
 * 生成微信的二维码
 */
public class CreateTemporaryTwoBarCodeUtil {
	private static Logger logger = Logger.getLogger(CreateTemporaryTwoBarCodeUtil.class);
	private static String ticket_url = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=TOKENPOST";
	
	/*public static void main(String[] args) {
		CreateTemporaryTwoBarCode c=new CreateTemporaryTwoBarCode();
		System.out.println("url:https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+c.getTicket());
		//System.out.println(new Date().getTime());
	}*/
	/**
	 * 通过如下方法获得appid和appsecret
	 * WeChatProperties weChatProperties=weChatPropertiesService.getDataFromUserGroup(usergroup);
			String appid=weChatProperties.getAppid();
			String appsecret=weChatProperties.getAppsecret();
	 * @param accessToken  通过WeChatServiceImpl中的getToken(String appid, String appsecret)方法获得accessToken
	 * @param sceneStr     二维码参数
	 * @return   返回二维码图片路径
	 */
	public static String getTicket(String accessToken,String sceneStr) {
		String ticket=null;
		String requestUrl = ticket_url.replace("TOKENPOST", accessToken);
		//String postData="{\"action_name\":\"QR_LIMIT_SCENE\",\"action_info\":{\"scene\":{\"scene_str\": \"1\"}}}";//临时二维码,参数只能是数字
		String postData="{\"action_name\":\"QR_LIMIT_STR_SCENE\",\"action_info\":{\"scene\":{\"scene_str\": \""+sceneStr+"\"}}}";//永久二维码
		JSONObject jsonObject = HttpRequestUtil.httpRequest(requestUrl, "POST", postData);
		logger.debug("请求ticket返回结果："+jsonObject);
		if (null != jsonObject) {
			ticket = jsonObject.getString("ticket");
		}
		String ticketUrl="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+ticket;//二维码参数路径
		return ticketUrl;
	}
}

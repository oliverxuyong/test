package so.xunta.server;

import org.json.JSONObject;

public interface WeChatService {
	public JSONObject makeWXTicket(String url, String appid, String appsecret);
	public String sendWechatmsgToUser(String touser, String templat_id, String clickurl, String topcolor, String first,
			String state, String notificationTime, String remark, String appid, String appsecret);
	public String getToken(String appid, String appsecret);
	//public JSONObject httpRequest(String requestUrl, String requestMethod, String outputStr);
}

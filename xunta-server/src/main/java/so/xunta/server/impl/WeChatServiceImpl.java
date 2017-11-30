package so.xunta.server.impl;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.ConnectException;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Timestamp;
import java.util.Formatter;
import java.util.UUID;

import javax.net.ssl.HttpsURLConnection;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.beans.Token;
import so.xunta.persist.TokenDao;
import so.xunta.server.WeChatService;

@Service
@Transactional
public class WeChatServiceImpl implements WeChatService{

	Logger logger = Logger.getLogger(WeChatServiceImpl.class);
	private final String token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";
	private final String apiTicketUrl = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi";
	@Autowired
	private TokenDao tokenDao;
	
	/**
	 * 微信分享链接
	 * @param url
	 * @param appid
	 * @param appsecret
	 * @return
	 */
	@Override
	public JSONObject makeWXTicket(String url, String appid, String appsecret) {
		JSONObject ret = new JSONObject();
		String nonceStr = createNonceStr();
		String timestamp = createTimestamp();
		String string1;
		String signature = "";
		String jsApiTicket = getJsApiTicket(appid, appsecret);

		// 注意这里参数名必须全部小写，且必须有序
		string1 = "jsapi_ticket=" + jsApiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;
		logger.debug("String1=====>" + string1);
		try {
			MessageDigest crypt = MessageDigest.getInstance("SHA-1");
			crypt.reset();
			crypt.update(string1.getBytes("UTF-8"));
			signature = byteToHex(crypt.digest());
			logger.debug("signature=====>" + signature);
		} catch (NoSuchAlgorithmException e) {
			logger.error("WeChatController.makeWXTicket=====Start");
			logger.error(e.getMessage());
			logger.error("WeChatController.makeWXTicket=====End");
		} catch (UnsupportedEncodingException e) {
			logger.error("WeChatController.makeWXTicket=====Start");
			logger.error(e.getMessage());
			logger.error("WeChatController.makeWXTicket=====End");
		}

		ret.put("url", url);
		ret.put("appid", appid);
		// ret.put("jsapi_ticket", jsApiTicket);
		ret.put("nonceStr", nonceStr);
		ret.put("timestamp", timestamp);
		ret.put("signature", signature);

		return ret;
	}

	/**
	 * 获取接口访问凭证
	 * 
	 * @param appid
	 *            凭证
	 * @param appsecret
	 *            密钥
	 * @return
	 */
	private String getToken(String appid, String appsecret) {
		String accessToken = getTokenForMysql(appid);
		if (accessToken.equals("") || accessToken == null) {
			logger.debug("token_url: " + token_url);
			String requestUrl = token_url.replace("APPID", appid).replace("APPSECRET", appsecret);
			// 发起GET请求获取凭证
			String jsonStr = httpsRequest(requestUrl, "GET", null);

			JSONObject jsonObject = new JSONObject(jsonStr);

			if (null != jsonObject) {
				try {
					accessToken = jsonObject.getString("access_token");
					int expires_in = jsonObject.getInt("expires_in");// 失效时间，以秒为单位
					Long failureTimeLong = System.currentTimeMillis() + expires_in * 1000;// 失效时间毫秒数
					Timestamp failureTime = new Timestamp(failureTimeLong);
					Timestamp createTime = new Timestamp(System.currentTimeMillis());
					tokenDao.saveToken(new Token(appid, accessToken, createTime, failureTime));// 存储token
				} catch (JSONException e) {
					logger.error("获取token失败  errcode=" + jsonObject.getInt("errcode") + " errmsg="
							+ jsonObject.getString("errmsg"));
				}
			}
		}
		return accessToken;
	}

	private String httpsRequest(String requestUrl, String requestMethod, String outputStr) {
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

	private String getTokenForMysql(String appid) {
		logger.debug("开始进行token查询");
		String accessToken = "";
		Token token = tokenDao.getTokenForAppid(appid);
		logger.debug("数据库是否存在token:"+token);
		if (token != null) {// 数据库中存在
			Timestamp failureTime = token.getFailureTime();
			Long failureTimeLong = failureTime.getTime();// 失效时间毫秒数
			long nowTimeLong = System.currentTimeMillis();// 获得当前系统毫秒数,这个是1970-01-01到现在的毫秒数
			if (failureTimeLong < nowTimeLong) {// 时间还没失效
				accessToken = token.getAccessToken();
			}
		}
		return accessToken;
	}

	// 获取ticket
	private String getJsApiTicket(String appid, String appsecret) {
		String accessToken = getToken(appid, appsecret); // 微信凭证，access_token
		String requestUrl = apiTicketUrl.replace("ACCESS_TOKEN", accessToken);
		// 发起GET请求获取凭证
		String jsonStr = httpsRequest(requestUrl, "GET", null);
		JSONObject jsonObject = new JSONObject(jsonStr);
		return jsonObject.getString("ticket");
	}

	// 字节数组转换为十六进制字符串
	private String byteToHex(final byte[] hash) {
		Formatter formatter = new Formatter();
		for (byte b : hash) {
			formatter.format("%02x", b);
		}
		String result = formatter.toString();
		formatter.close();
		return result;
	}

	// 生成随机字符串
	private String createNonceStr() {
		return UUID.randomUUID().toString();
	}

	// 生成时间戳
	private String createTimestamp() {
		return Long.toString(System.currentTimeMillis() / 1000);
	}

	/**
	 * 
	 * @method sendWechatmsgToUser
	 * @描述: TODO(发送模板信息给用户)
	 * @参数@param touser 用户的openid
	 * @参数@param templat_id 信息模板id
	 * @参数@param url 用户点击详情时跳转的url
	 * @参数@param topcolor 模板字体的颜色
	 * @参数@param first 头部
	 * @参数@param state 状态
	 * @参数@param notificationTime 通知时间
	 * @参数@param remark 补充说明
	 * @参数@return
	 * @返回类型：String "error/success"
	 */
	@Override
	public String sendWechatmsgToUser(String touser, String templat_id, String clickurl, String topcolor, String first,
			String state, String notificationTime, String remark, String appid, String appsecret) {

		String tmpurl = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=ACCESS_TOKEN";
		String token = getToken(appid, appsecret); // 微信凭证，access_token

		logger.debug("============================");
		logger.debug("token: " + token);
		logger.debug("============================");

		String url = tmpurl.replace("ACCESS_TOKEN", token);
		JSONObject json = new JSONObject();
		try {
			json.put("touser", touser);
			json.put("template_id", templat_id);
			json.put("url", clickurl);
			json.put("topcolor", topcolor);
			json.put("data", packJsonmsg(first, state, notificationTime, remark));

			/*
			 * WxTemplate temp = new WxTemplate(); temp.setTouser(touser);
			 * temp.setTemplate_id(templat_id); temp.setUrl(clickurl);
			 * temp.setTopcolor(topcolor); Map<String,TemplateData> m = new
			 * HashMap<String,TemplateData>(); TemplateData firstData = new
			 * TemplateData(); firstData.setColor("#000000");
			 * firstData.setValue(first); m.put("first", firstData);
			 * TemplateData waitingTaskData = new TemplateData();
			 * waitingTaskData.setColor("#000000");
			 * waitingTaskData.setValue(waitingTask); m.put("name",
			 * waitingTaskData); TemplateData notificationTypeData = new
			 * TemplateData(); notificationTypeData.setColor("#000000");
			 * notificationTypeData.setValue(notificationType);
			 * m.put("wuliu",notificationTypeData); TemplateData
			 * notificationTimeData = new TemplateData();
			 * notificationTimeData.setColor("#000000");
			 * notificationTimeData.setValue(notificationTime); m.put("orderNo",
			 * notificationTimeData); TemplateData remarkData = new
			 * TemplateData(); remarkData.setColor("#000000");
			 * remarkData.setValue(remark); m.put("Remark", remarkData);
			 * temp.setData(m); String jsonString = JSONObject.
			 */

			logger.debug("json: " + json);
			logger.debug("============================");
			/*
			 * logger.info(json); logger.info("============================");
			 */

			String result = httpsRequest(url, "POST", json.toString());
			JSONObject resultJson = new JSONObject(result);
			String errmsg = (String) resultJson.get("errmsg");

			logger.info("模版消息发送结果:" + errmsg);

			logger.debug("============================");
			logger.debug(resultJson);
			logger.debug("============================");

			if ("ok".equals(errmsg)) { // 如果为errmsg为ok，则代表发送成功，公众号推送信息给用户了。
				return "success";
			}
		} catch (JSONException e) {
			logger.error(e.getMessage(), e);
		}
		return "error";
	}

	/**
	 * @method packJsonmsg
	 * @描述: TODO(封装微信模板:智能访客消息通知)
	 * @参数@param first 头部
	 * @参数@param state 状态
	 * @参数@param notificationTime 通知时间
	 * @参数@param remark 补充说明
	 * @参数@return
	 * @返回类型：JSONObject
	 */
	private JSONObject packJsonmsg(String first, String state, String notificationTime, String remark) {
		JSONObject json = new JSONObject();
		try {
			JSONObject jsonFirst = new JSONObject();
			jsonFirst.put("value", first);
			jsonFirst.put("color", "#173177");
			json.put("first", jsonFirst);

			JSONObject jsonWaitingTask = new JSONObject();
			jsonWaitingTask.put("value", state);
			jsonWaitingTask.put("color", "#173177");
			json.put("keyword1", jsonWaitingTask);

			JSONObject jsonNotificationTime = new JSONObject();
			jsonNotificationTime.put("value", notificationTime);
			jsonNotificationTime.put("color", "#173177");
			json.put("keyword2", jsonNotificationTime);

			JSONObject jsonRemark = new JSONObject();
			jsonRemark.put("value", remark);
			jsonRemark.put("color", "#173177");
			json.put("remark", jsonRemark);
		} catch (JSONException e) {
			logger.error(e.getMessage(), e);
		}
		return json;
	}
}

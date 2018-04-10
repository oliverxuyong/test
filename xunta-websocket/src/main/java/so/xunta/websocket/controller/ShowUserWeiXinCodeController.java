package so.xunta.websocket.controller;

import java.sql.Timestamp;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.Token;
import so.xunta.beans.User;
import so.xunta.beans.WeChatProperties;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.persist.TokenDao;
import so.xunta.server.SocketService;
import so.xunta.server.UserService;
import so.xunta.server.WeChatPropertiesService;
import so.xunta.server.WeChatService;
import so.xunta.utils.CreateTemporaryTwoBarCodeUtil;
import so.xunta.utils.HttpRequestUtil;
import so.xunta.websocket.config.Constants;

/**
 * @author Bright_zheng
 * */
@WebSocketTypeAnnotation
@Component
public class ShowUserWeiXinCodeController {
	Logger logger =Logger.getLogger(ShowUserWeiXinCodeController.class);
	
	@Autowired
	private SocketService socketService;
	@Autowired
	private UserService userService;
	@Autowired
	private WeChatPropertiesService weChatPropertiesService;
	@Autowired
	private WeChatService weChatService;
	@Autowired
	TokenDao tokenDao;
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1115-1")
	public void ReturnUserWeiXinCode(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		String matched_user_id=params.get("matched_user_id").toString();
		logger.debug("1115-1  matched_user_id="+matched_user_id);
		Long userId = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		User user = userService.findUser(userId);
		String qRCodeUrl = user.getWeChatQRCodeUrl();
		logger.debug("qRCodeUrl="+qRCodeUrl+" "+(qRCodeUrl==null));
		if(qRCodeUrl == null){
			String userGroup = user.getUserGroup();
			
			WeChatProperties weChatProperties = weChatPropertiesService.getDataFromUserGroup(userGroup);
			String accessToken = weChatService.getToken(weChatProperties.getAppid(), weChatProperties.getAppsecret());
			String sceneStr = "{userId:"+userId+"}";
			/*logger.debug("二维码参数：sceneStr="+sceneStr);
			//2018.03.21  叶夷    将二维码参数转为json在转为string传送
			JSONObject sceneStrJson=new JSONObject();
			sceneStrJson.put("userId", sceneStr);*/
			logger.debug("二维码参数：sceneStrJson="+sceneStr);
			JSONObject jsonObject = CreateTemporaryTwoBarCodeUtil.getTicket(accessToken, sceneStr);
			if(!jsonObject.isNull("errmsg")){
				String errmsg = jsonObject.getString("errmsg");
				if (!"ok".equals(errmsg)) { // 如果为errmsg为ok，则代表发送成功，公众号推送信息给用户了。
					String errcode=jsonObject.get("errcode").toString();
					logger.debug("errcode="+errcode);
					if(errcode.equals("40001")){//如果模版消息token错误则重新获取token，重新发送
						String token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";
						String requestUrl = token_url.replace("APPID", weChatProperties.getAppid()).replace("APPSECRET", weChatProperties.getAppsecret());
						// 发起GET请求获取凭证
						JSONObject jsonObject1 = HttpRequestUtil.httpRequest(requestUrl, "GET", null);
						Token tokenObject=weChatService.getTokenForMysql(weChatProperties.getAppid());
						if (null != jsonObject1) {
							String newAccessToken = jsonObject1.getString("access_token");
							accessToken=newAccessToken;
							int expires_in = jsonObject1.getInt("expires_in");// 失效时间，以秒为单位
							Long newfailureTimeLong = System.currentTimeMillis() + expires_in * 1000;// 失效时间毫秒数
							Timestamp newfailureTime = new Timestamp(newfailureTimeLong);
							Timestamp newcreateTime = new Timestamp(System.currentTimeMillis());
							tokenObject.setAccessToken(newAccessToken);
							tokenObject.setCreateTime(newcreateTime);
							tokenObject.setFailureTime(newfailureTime);
							tokenDao.updateToken(tokenObject);// 存在但是失效则更新
							jsonObject1 = CreateTemporaryTwoBarCodeUtil.getTicket(accessToken, sceneStr);
							if (null != jsonObject1) {
								String ticket = jsonObject1.getString("ticket");
								qRCodeUrl="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+ticket;//二维码参数路径
							}
						}
					}
				}
			}else{
				if (null != jsonObject) {
					String ticket = jsonObject.getString("ticket");
					qRCodeUrl="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+ticket;//二维码参数路径
				}
			}
			user.setWeChatQRCodeUrl(qRCodeUrl);
			userService.updateUser(user);
		}
		
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1115-2");
		returnJson.put("weChatQRCodeUrl", qRCodeUrl);
		returnJson.put("matched_user_id", matched_user_id);
		socketService.chat2one(session, returnJson);
	}
}

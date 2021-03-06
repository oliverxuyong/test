package so.xunta.websocket.utils;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * 发送模版消息功能
 * @author 叶夷
 */
public class TemplateMessageUtils {
	
	private Logger logger = Logger.getRootLogger();
	private WeChatUtils wsGetAccessToken=new WeChatUtils();
    /**

     * @method sendWechatmsgToUser
     * @描述: TODO(发送模板信息给用户) 
     * @参数@param touser  用户的openid
     * @参数@param templat_id  信息模板id
     * @参数@param url  用户点击详情时跳转的url
     * @参数@param topcolor  模板字体的颜色
     * @参数@param first  头部
     * @参数@param state  状态
     * @参数@param notificationTime  通知时间
     * @参数@param remark  补充说明
     * @参数@return
     * @返回类型：String "error/success"
     */
    public String sendWechatmsgToUser
    	(String touser, String templat_id, String clickurl, String topcolor, 
    			String first, String state, String notificationTime,String remark){
    	
        String tmpurl = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=ACCESS_TOKEN";
        String token = wsGetAccessToken.getToken("wxdac88d71df6be268", "753b50cf29b6b08e733e357cc0ed348c");  //微信凭证，access_token
        
        logger.debug("============================");
        logger.debug("token: "+token);
        logger.debug("============================");
        
        String url = tmpurl.replace("ACCESS_TOKEN", token);
        JSONObject json = new JSONObject();
        try {
            json.put("touser", touser);
            json.put("template_id", templat_id);
            json.put("url", clickurl);
            json.put("topcolor", topcolor);
            json.put("data", packJsonmsg(first, state, notificationTime, remark));
            
          /*  WxTemplate temp = new WxTemplate();
            temp.setTouser(touser);
            temp.setTemplate_id(templat_id);
            temp.setUrl(clickurl);
            temp.setTopcolor(topcolor);
            Map<String,TemplateData> m = new HashMap<String,TemplateData>();
            TemplateData firstData = new TemplateData();
            firstData.setColor("#000000");  
            firstData.setValue(first);  
            m.put("first", firstData);  
            TemplateData waitingTaskData = new TemplateData();  
            waitingTaskData.setColor("#000000");  
            waitingTaskData.setValue(waitingTask);  
            m.put("name", waitingTaskData);
            TemplateData notificationTypeData = new TemplateData();  
            notificationTypeData.setColor("#000000");  
            notificationTypeData.setValue(notificationType);  
            m.put("wuliu",notificationTypeData);
            TemplateData notificationTimeData = new TemplateData();  
            notificationTimeData.setColor("#000000");  
            notificationTimeData.setValue(notificationTime);  
            m.put("orderNo", notificationTimeData);
            TemplateData remarkData = new TemplateData();  
            remarkData.setColor("#000000");  
            remarkData.setValue(remark);  
            m.put("Remark", remarkData);
            temp.setData(m);
            String jsonString = JSONObject.*/
            
            logger.debug("json: "+json);
            logger.debug("============================");
           /* logger.info(json);
            logger.info("============================");*/
            
            String result = wsGetAccessToken.httpsRequest(url, "POST", json.toString());
            JSONObject resultJson = new JSONObject(result);
            String errmsg = (String) resultJson.get("errmsg");
            
            logger.info("模版消息发送结果:"+errmsg);
            
            logger.debug("============================");
            logger.debug(resultJson);
            logger.debug("============================");
            
            if("ok".equals(errmsg)){  //如果为errmsg为ok，则代表发送成功，公众号推送信息给用户了。
                return "success";
            }
        } catch (JSONException e) {
            logger.error(e.getMessage(), e);
        }
        return "error";
    }
    
    /*private static String httpsRequest(String requestUrl, String requestMethod, String outputStr){
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
            System.out.println("连接超时：{}");
        } catch (Exception e) {
            System.out.println("https请求异常：{}");
        }
        return null;
    }*/
    
    /**
     * @method packJsonmsg
     * @描述: TODO(封装微信模板:待处理任务) 
     * @参数@param first  头部
     * @参数@param waitingTask  待处理任务
     * @参数@param notificationType  通知类型
     * @参数@param notificationTime  通知时间
     * @参数@param remark  补充说明
     * @参数@return 
     * @返回类型：JSONObject
     */
/*    private JSONObject packJsonmsg(String first, String waitingTask, String notificationType, String notificationTime,String remark){
        JSONObject json = new JSONObject();
        try {
            JSONObject jsonFirst = new JSONObject();
            jsonFirst.put("value", first);
            jsonFirst.put("color", "#173177");
            json.put("first", jsonFirst);
            
            JSONObject jsonWaitingTask = new JSONObject();
            jsonWaitingTask.put("value", waitingTask);
            jsonWaitingTask.put("color", "#173177");
            json.put("keyword1", jsonWaitingTask);
            
            JSONObject jsonNotificationType = new JSONObject();
            jsonNotificationType.put("value", notificationType);
            jsonNotificationType.put("color", "#173177");
            json.put("keyword2", jsonNotificationType);
            
            JSONObject jsonNotificationTime = new JSONObject();
            jsonNotificationTime.put("value", notificationTime);
            jsonNotificationTime.put("color", "#173177");
            json.put("keyword3", jsonNotificationTime);
            
            JSONObject jsonRemark = new JSONObject();
            jsonRemark.put("value", remark);
            jsonRemark.put("color", "#173177");
            json.put("remark", jsonRemark);
        } catch (JSONException e) {
            logger.error(e.getMessage(), e);
        }
        return json;
    }*/
    
    /**
     * @method packJsonmsg
     * @描述: TODO(封装微信模板:智能访客消息通知) 
     * @参数@param first  头部
     * @参数@param state  状态
     * @参数@param notificationTime  通知时间
     * @参数@param remark  补充说明
     * @参数@return 
     * @返回类型：JSONObject
     */
    private JSONObject packJsonmsg(String first, String state,String notificationTime,String remark){
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
    
    /**
     * 获取接口访问凭证
     * 
     * @param appid 凭证
     * @param appsecret 密钥
     * @return
     *//*
    public static String getToken(String appid, String appsecret) {
        Token token = null;
        String requestUrl = token_url.replace("APPID", appid).replace("APPSECRET", appsecret);
        // 发起GET请求获取凭证
        String jsonStr=httpsRequest(requestUrl, "GET", null);
        
        JSONObject jsonObject =new JSONObject(jsonStr);

        if (null != jsonObject) {
            try {
                token = new Token();
                token.setAccessToken(jsonObject.getString("access_token"));
                token.setExpiresIn(jsonObject.getInt("expires_in"));
            } catch (JSONException e) {
                token = null;
                // 获取token失败
                //log.error("获取token失败 errcode:{} errmsg:{}", jsonObject.getInt("errcode"), jsonObject.getString("errmsg"));
            }
        }
        return token.getAccessToken();
    }*/
}

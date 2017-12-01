package so.xunta.web.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import so.xunta.beans.User;
import so.xunta.server.LoggerService;
import so.xunta.server.UserService;
import so.xunta.server.WeChatService;
import so.xunta.utils.IdWorker;


@Controller
public class SendWeChatTemplateMsgController {
	
	@Autowired
	LoggerService loggerService;
	@Autowired
	private UserService userService;
	@Autowired
	private WeChatService weChatService;
	
	static Logger logger = Logger.getLogger(SendWeChatTemplateMsgController.class);

	IdWorker idWorker = new IdWorker(1L, 1L);
	
	@Value("${xunta_templateid}")
	private String xunta_templateid;
	@Value("${xunta_templateurl}")
	private String xunta_templateurl;
	@Value("${xunta_appid}")
	private String xunta_appid;
	@Value("${xunta_appsecret}")
	private String xunta_appsecret;
	
	@Value("${aini_templateid}")
	private String aini_templateid;
	@Value("${aini_templateurl}")
	private String aini_templateurl;
	@Value("${aini_appid}")
	private String aini_appid;
	@Value("${aini_appsecret}")
	private String aini_appsecret;
	
	@RequestMapping("/sendMTemplateMsg")
	public void checkUserExist(/*String userid,String touserid,String content,*/HttpServletRequest request,HttpServletResponse response) throws IOException{
		BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(request.getInputStream()));
		StringBuilder stringBuilder = new StringBuilder();
		String line = null;
		while((line=bufferedReader.readLine())!=null){
		    stringBuilder.append(line);
		}
		String body = stringBuilder.toString();
		logger.debug("模版消息接口被调用时返回的数据包：body="+body);
		
		JSONObject bodyObject=new JSONObject(body);
		String userid=bodyObject.getString("userid");
		String touserid=bodyObject.getString("touserid");
		String content=bodyObject.getString("content");
		
		logger.debug("模版消息接口被调用时返回的数据：userid="+userid+" touserid="+touserid+" content"+content);
		
		SimpleDateFormat df = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");//设置日期格式
		User touser=userService.findUser(Long.valueOf(touserid));
		String toopenid=touser.getOpenid();
		User user=userService.findUser(Long.valueOf(userid));
		String username=user.getName();
		logger.debug("模版消息接口被调用时获取的openid和username：toopenid="+toopenid+" username="+username);
		//获得两人共同选择的标签，最多显示三个
		/*String sameSelectTags=sendPost("http://xunta.so:3000/v1/find/users/same/tags/", "my_user_id="+userid+"matched_user_id"+touserid);
		logger.debug("发送模版消息时共同选择的标签："+sameSelectTags);
		String sameSelectTagList="";//模版消息中不能超过显示三个标签
		JSONObject sameSelectTagJsonObject=new JSONObject(sameSelectTags);
		JSONArray sameSelectTagJsonObjectList=sameSelectTagJsonObject.getJSONArray("msg");
		if(sameSelectTagJsonObjectList!=null){
			for(int i=0;i<3;i++){
				sameSelectTagList=sameSelectTagList+","+sameSelectTagJsonObjectList.getJSONObject(i).getString("text");
			}
			if(sameSelectTagJsonObjectList.length()>=3){
				sameSelectTagList=sameSelectTagList+"...";
			}
		}
		logger.debug("模版消息显示的共同选择的标签："+sameSelectTagList);*/
		
		String templateid,templateurl,appid,appsecret;
		
		//通过usergroup来判断是从模版消息发往哪里
		String tousergroup=touser.getUserGroup();
		logger.debug("tousergroup="+tousergroup);
		if(tousergroup.equals("艾妮婚庆云")){
			templateid=aini_templateid;
			templateurl=aini_templateurl;
			appid=aini_appid;
			appsecret=aini_appsecret;
			logger.debug("艾妮公众号：templateid="+templateid+" templateurl="+templateurl+" appid="+appid+" appsecret="+appsecret);
		}else{
			templateid=xunta_templateid;
			templateurl=xunta_templateurl;
			appid=xunta_appid;
			appsecret=xunta_appsecret;
			logger.debug("xunta公众号：templateid="+templateid+" templateurl="+templateurl+" appid="+appid+" appsecret="+appsecret);
		}
		
		String result=weChatService.sendWechatmsgToUser(
				toopenid, 
				templateid, 
				templateurl,
				"#FF0000",
				username/*+"["+sameSelectTagList+"]"*/,
				"给你发了一条消息", 
				df.format(new Date()),
				content,
				appid,
				appsecret);
		JSONObject obj = new JSONObject();
		if(result.equals("success")){
			obj.put("isSuccess",true);
		}else{
			obj.put("isSuccess",false);
		}
		responseBack(request, response, obj);
	}
	
	private void responseBack(HttpServletRequest request, HttpServletResponse response, JSONObject obj)
			throws IOException {
		logger.debug("执行responseBack...");
		boolean jsonP = false;
		String cb = request.getParameter("callback");
		if (cb != null) {
		    jsonP = true;
		    response.setContentType("text/javascript");
		} else {
		    response.setContentType("application/x-json");
		}
		Writer out = response.getWriter();
		if (jsonP) {
		    out.write(cb + "(");
		}
		out.write(obj.toString(2));
		
		if (jsonP) {
		    out.write(");");
		    logger.debug("返回成功。。。");
		}
	}
	
    /**
     * 向指定 URL 发送POST方法的请求
     * 
     * @param url
     *            发送请求的 URL
     * @param param
     *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @return 所代表远程资源的响应结果
     */
    /*private String sendPost(String url, String param) {
        PrintWriter out = null;
        BufferedReader in = null;
        String result = "";
        try {
            URL realUrl = new URL(url);
            // 打开和URL之间的连接
            URLConnection conn = realUrl.openConnection();
            // 设置通用的请求属性
            conn.setRequestProperty("accept", "*");
            conn.setRequestProperty("connection", "Keep-Alive");
            conn.setRequestProperty("user-agent",
                    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            // 发送POST请求必须设置如下两行
            conn.setDoOutput(true);
            conn.setDoInput(true);
            // 获取URLConnection对象对应的输出流
            out = new PrintWriter(conn.getOutputStream());
            // 发送请求参数
            out.print(param);
            // flush输出流的缓冲
            out.flush();
            // 定义BufferedReader输入流来读取URL的响应
            in = new BufferedReader(
                    new InputStreamReader(conn.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
        } catch (Exception e) {
        	logger.error("发送 POST 请求出现异常！"+e);
            //e.printStackTrace();
        }
        //使用finally块来关闭输出流、输入流
        finally{
            try{
                if(out!=null){
                    out.close();
                }
                if(in!=null){
                    in.close();
                }
            }
            catch(IOException ex){
                ex.printStackTrace();
            }
        }
        return result;
    }    */
}

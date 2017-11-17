package so.xunta.web.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.lang.reflect.Field;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import so.xunta.beans.User;
import so.xunta.persist.UserDao;
import so.xunta.server.LoggerService;
import so.xunta.utils.IdWorker;
import so.xunta.websocket.config.Constants;
import so.xunta.websocket.utils.TemplateMessageUtils;
import so.xunta.websocket.utils.WeChatShareLinksUtils;
import weibo4j.Account;
import weibo4j.Users;
import weibo4j.model.WeiboException;

import com.qq.connect.QQConnectException;
import com.qq.connect.api.OpenID;
import com.qq.connect.api.qzone.UserInfo;
import com.qq.connect.javabeans.AccessToken;
import com.qq.connect.javabeans.qzone.UserInfoBean;
import com.qq.connect.oauth.Oauth;

@Controller
public class SendWeChatTemplateMsgController {
	@Autowired
	LoggerService loggerService;

	@Autowired
	TemplateMessageUtils templateMessageUtils;
	
	static Logger logger = Logger.getRootLogger();

	IdWorker idWorker = new IdWorker(1L, 1L);
	@RequestMapping("/sendMTemplateMsg")
	public void checkUserExist(String openid,String username,String content,HttpServletRequest request,HttpServletResponse response) throws IOException{
		SimpleDateFormat df = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");//设置日期格式
		String result=templateMessageUtils.sendWechatmsgToUser(
				openid, 
				"JRfluXjVBtHF3ADwA6AwP4laOMyLY9pGJao6brmIo_M", 
				"http://www.mxunta.so",
				"#FF0000",
				"您有一个未读消息",
				content, 
				"未读消息", 
				df.format(new Date()),
				username+"给您发送了一条消息："+content);
		if(result.equals("success")){
			JSONObject obj = new JSONObject();
			obj.put("result","ok");
			responseBack(request, response, obj);
		}
	}
	
	private void responseBack(HttpServletRequest request, HttpServletResponse response, JSONObject obj)
			throws IOException {
		System.out.println("执行responseBack...");
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
		    System.out.println("返回成功。。。");
		}
	}
}

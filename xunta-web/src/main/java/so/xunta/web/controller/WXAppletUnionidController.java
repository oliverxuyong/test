package so.xunta.web.controller;

import java.io.IOException;
import java.io.Writer;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import so.xunta.utils.IdWorker;

/**
 * 2018.03.05 叶夷 将小程序的用户信息解密返回
 * 
 * @author aaron.fang
 *
 */

@Controller
public class WXAppletUnionidController {
	static Logger logger = Logger.getLogger(SendWeChatTemplateMsgController.class);

	IdWorker idWorker = new IdWorker(1L, 1L);

	@RequestMapping("/getWXAppletUnionid")
	public void getWXAppletUnionid(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		logger.debug("微信从小程序进入");
		response.setContentType("text/html; charset=utf-8");
		/*
		BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(request.getInputStream()));
		StringBuilder stringBuilder = new StringBuilder();
		String line = null;
		while((line=bufferedReader.readLine())!=null){
		    stringBuilder.append(line);
		}
		String body = stringBuilder.toString();
		logger.debug("模版消息接口被调用时返回的数据包：body="+body);*/
		
		String code = request.getParameter("code");
		logger.debug("code:" + code);
		String codeToToken = "https://api.weixin.qq.com/sns/jscode2session?appid=wx2e46b44f01234193&secret=b9d7395119ef2771a3ce033f3c2cafb1&js_code="+code+"&grant_type=authorization_code";
		String wxAppletInfo = httpclientReq(codeToToken);
		logger.debug("weiXinInfo: " + wxAppletInfo);
		org.json.JSONObject wxAppletInfoJson = new org.json.JSONObject(wxAppletInfo);
		boolean errcodeExit=wxAppletInfoJson.isNull("errcode");
		String openid,unionid;
		JSONObject obj = new JSONObject();
		if(errcodeExit){
			//正常返回的JSON数据包
			/*{
			      "openid": "OPENID",
			      "session_key": "SESSIONKEY",
			      "unionid": "UNIONID"
			}*/
			openid=wxAppletInfoJson.getString("openid");
			unionid=wxAppletInfoJson.getString("unionid");
			obj.put("openid", openid);
			obj.put("unionid", unionid);
		}else{//错误时返回JSON数据包(示例为Code无效)
			logger.error("Code无效");
			int errcode=wxAppletInfoJson.getInt("errcode");
			obj.put("errcode", errcode);
		}
		responseBack(request, response, obj);
		//return obj;
	}
	
	private String httpclientReq(String url) {
		HttpClient httpClient = new HttpClient();
		GetMethod getMethod = new GetMethod(url); // 创建GET方法的实
		String response = null;
		try {
			int statusCode = httpClient.executeMethod(getMethod); // 执行getMethod
			logger.debug("statusCode  :  " + statusCode);
			response = getMethod.getResponseBodyAsString(); // 读取服务器返回的页面代码，这里用的是字符读法
		} catch (HttpException e) {
			logger.error("Please check your provided http address!  发生致命的异常，可能是协议不对或者返回的内容有问题" + e.getMessage(), e);
		} catch (IOException e) { // 发生网络异常
			logger.error(e.getMessage(), e);
		} finally { // 释放连接
			getMethod.releaseConnection();
		}
		return response;
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
}

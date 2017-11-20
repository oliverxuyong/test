package so.xunta.web.controller;

import java.io.IOException;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import org.apache.log4j.Logger;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import so.xunta.server.LoggerService;
import so.xunta.utils.IdWorker;

import so.xunta.websocket.utils.TemplateMessageUtils;


@Controller
public class SendWeChatTemplateMsgController {
	@Autowired
	LoggerService loggerService;

	TemplateMessageUtils templateMessageUtils = new TemplateMessageUtils();
	
	static Logger logger = Logger.getRootLogger();

	IdWorker idWorker = new IdWorker(1L, 1L);
	@RequestMapping("/sendMTemplateMsg")
	public void checkUserExist(String openid,String username,String content,HttpServletRequest request,HttpServletResponse response) throws IOException{
		SimpleDateFormat df = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");//设置日期格式
		String result=templateMessageUtils.sendWechatmsgToUser(
				openid, 
				"JRfluXjVBtHF3ADwA6AwP4laOMyLY9pGJao6brmIo_M", 
				"http://www.xunta.so",
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

package so.xunta.web.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.Writer;
import java.net.URL;
import java.net.URLConnection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import so.xunta.beans.User;
import so.xunta.server.LoggerService;
import so.xunta.server.UserService;
import so.xunta.utils.IdWorker;
import so.xunta.websocket.utils.TemplateMessageUtils;


@Controller
public class SendWeChatTemplateMsgController {
	@Autowired
	LoggerService loggerService;
	@Autowired
	private UserService userService;

	TemplateMessageUtils templateMessageUtils = new TemplateMessageUtils();
	
	static Logger logger = Logger.getRootLogger();

	IdWorker idWorker = new IdWorker(1L, 1L);
	@RequestMapping("/sendMTemplateMsg")
	public void checkUserExist(String userid,String touserid,String content,HttpServletRequest request,HttpServletResponse response) throws IOException{
		logger.debug("模版消息接口被调用时返回的数据：userid="+userid+" touserid="+touserid+" content"+content);
		
		SimpleDateFormat df = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");//设置日期格式
		User user=userService.findUser(Long.valueOf(userid));
		String openid=user.getOpenid();
		String username=user.getName();
		logger.debug("模版消息接口被调用时获取的openid和username：openid="+openid+" username="+username);
		//获得两人共同选择的标签，最多显示三个
		String sameSelectTags=sendPost("http://xunta.so:3000/v1/find/users/same/tags/", "my_user_id="+userid+"matched_user_id"+touserid);
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
		logger.debug("模版消息显示的共同选择的标签："+sameSelectTagList);
		String result=templateMessageUtils.sendWechatmsgToUser(
				openid, 
				"jNHGVWH1ByKjMLFmSIQO5zLFtrdBeJhH-jayd3MyVU8", 
				"http://www.xunta.so",
				"#FF0000",
				username+"["+sameSelectTagList+"]",
				"给你发了一条消息", 
				df.format(new Date()),
				content);
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
	
    /**
     * 向指定 URL 发送POST方法的请求
     * 
     * @param url
     *            发送请求的 URL
     * @param param
     *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @return 所代表远程资源的响应结果
     */
    private String sendPost(String url, String param) {
        PrintWriter out = null;
        BufferedReader in = null;
        String result = "";
        try {
            URL realUrl = new URL(url);
            // 打开和URL之间的连接
            URLConnection conn = realUrl.openConnection();
            // 设置通用的请求属性
            conn.setRequestProperty("accept", "*/*");
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
            System.out.println("发送 POST 请求出现异常！"+e);
            e.printStackTrace();
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
    }    
}

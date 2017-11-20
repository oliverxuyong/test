package so.xunta.utils.validate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.http.ParseException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.json.JSONObject;

/**
 * @author Beyond
 */
public class HttpSender {
	private static Logger logger = Logger.getRootLogger();
	/**
	 * 
	 * @param url
	 *            应用地址，类似于http://ip:port/msg/
	 * @param account
	 *            账号
	 * @param pswd
	 *            密码
	 * @param mobile
	 *            手机号码，多个号码使用","分割
	 * @param msg
	 *            短信内容
	 * @param needstatus
	 *            是否需要状态报告，需要true，不需要false
	 * @return 返回值定义参见HTTP协议文档
	 * @throws Exception
	 */
	@Deprecated
	public static String sendValicateCode_(String phone, String code) throws Exception {
		HttpClient client = new HttpClient();
		// 设置代理服务器地址和端口
		// client.getHostConfiguration().setProxy("proxy_host_addr",proxy_port);
		// 使用GET方法，如果服务器需要通过HTTPS连接，那只需要将下面URL中的http换成https
		// HttpMethod method = new
		// GetMethod("http://10.1.14.20:8088/workflowController/service/todo/addTask");
		// 使用POST方法
		String url = "http://222.73.117.140:8044/mt";
		// String url ="http://localhost/xunta-web/mt";
		PostMethod method = new PostMethod(url);

		String account = "N18521702948";
		String password = "456439";
		String template = "1114";
		JSONObject var_obj = new JSONObject();
		var_obj.put("code", code);
		String var = var_obj.toString();
		int smstype = 1;
		((PostMethod) method).addParameter("account", account);
		((PostMethod) method).addParameter("password", password);
		((PostMethod) method).addParameter("template", template);
		((PostMethod) method).addParameter("phone", phone);
		((PostMethod) method).addParameter("var", var);
		((PostMethod) method).addParameter("smstype", smstype + "");

		HttpMethodParams param = method.getParams();
		param.setContentCharset("UTF-8");

		client.executeMethod(method);
		// 打印服务器返回的状态
		System.out.println(method.getStatusLine());
		// 打印返回的信息
		System.out.println();
		InputStream stream = method.getResponseBodyAsStream();

		BufferedReader br = new BufferedReader(new InputStreamReader(stream, "UTF-8"));
		StringBuffer buf = new StringBuffer();
		String line;
		while (null != (line = br.readLine())) {
			buf.append(line).append("\n");
		}
		System.out.println(buf.toString());
		// 释放连接
		method.releaseConnection();
		return buf.toString();
	}

	public static String sendValicateCode(String phoneNumber, String code, String domain) {
		ChuanglanSMS client = new ChuanglanSMS("N18521702948", "456439");
		CloseableHttpResponse response = null;
		String ret="";
		String groupName="语擎科技";
		if(domain.indexOf("chninn.com")!=-1){
			groupName = "笃行客";
		}else if(domain.indexOf("ainiweddingcloud.com")!= -1){
			groupName = "艾妮婚庆云";
		}
		logger.debug("访问域名"+groupName);
		
		try {
			// 发送短信
			response = client.sendMessage(phoneNumber, "【"+groupName+"】亲爱的用户您好，您的验证码是："+code);
			if (response != null && response.getStatusLine().getStatusCode() == 200) {
				ret = EntityUtils.toString(response.getEntity());
				return ret;
			}

			// 查询余额
			/*response = client.queryBalance();
			if (response != null && response.getStatusLine().getStatusCode() == 200) {
				System.out.println(EntityUtils.toString(response.getEntity()));
				return EntityUtils.toString(response.getEntity());
			}*/

			// 发送国际验证码 response =
			/*client.sendInternationalMessage("18317131907", "【语擎科技】亲爱的用户您好，您的验证码是：1234567");
			if (response != null && response.getStatusLine().getStatusCode() == 200) {
				System.out.println(EntityUtils.toString(response.getEntity()));
				return EntityUtils.toString(response.getEntity());
			}*/

		} catch (ParseException e) {
			JSONObject obj = new JSONObject();
			obj.put("error", e.getMessage());
			return obj.toString();
		} catch (IOException e) {
			JSONObject obj = new JSONObject();
			obj.put("error", e.getMessage());
			return obj.toString();
		}finally {
			client.close();
		}
		return ret;
	}

	public static void main(String[] args) {
		try {
			String sendValicateCode = sendValicateCode("18317131907", "3456","");
			JSONObject state_json = new JSONObject(sendValicateCode);
			if (state_json.getBoolean("success")) {
				//req.getSession().removeAttribute("graph_code");
				System.out.println("发送成功:"+state_json);
			} else {
				System.out.println("发送失败 "+state_json);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}
	}
}

package so.xunta.utils.validate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.json.JSONObject;

/**
 * @ClassName: SimpleClient
 * @Description: 
 * @author 
 * @date
 */
public class SimpleClient {
	public static void main(String[] args) throws IOException {
		HttpClient client = new HttpClient();
		// 设置代理服务器地址和端口
		// client.getHostConfiguration().setProxy("proxy_host_addr",proxy_port);
		// 使用GET方法，如果服务器需要通过HTTPS连接，那只需要将下面URL中的http换成https
		// HttpMethod method = new
		// GetMethod("http://10.1.14.20:8088/workflowController/service/todo/addTask");
		// 使用POST方法
		String url ="http://222.73.117.140:8044/mt";
		//String url ="http://localhost/xunta-web/mt";
		PostMethod method = new PostMethod(url);

		String account = "Z18521702948";
		String password = "660419";
		String template = "100133";
		String phone = "18317131907";
		JSONObject var_obj = new JSONObject();
		var_obj.put("code", "123456");
		String var = var_obj.toString();
		int smstype = 1;
		((PostMethod) method).addParameter("account",account);
		((PostMethod) method).addParameter("password",password);
		((PostMethod) method).addParameter("template", template);
		((PostMethod) method).addParameter("phone", phone);
		((PostMethod) method).addParameter("var",var);
		((PostMethod) method).addParameter("smstype", smstype+"");

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
	}
}
package so.xunta.web.controller.validate;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import so.xunta.beans.User;
import so.xunta.server.LoggerService;
import so.xunta.server.MobilePhoneCodeService;
import so.xunta.server.UserService;
import so.xunta.utils.IdWorker;

@Controller
public class MobilePhonePassResetController {

	@Autowired
	UserService userService;
	@Autowired
	MobilePhoneCodeService mpcService;
	
	@Autowired
	LoggerService loggerService;

	IdWorker idWorker = new IdWorker(1L, 1L);


	/**
	 *  手机密码重设
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/resetpwandlogin")
	public void resetpwandlogin(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		try {
			request.setCharacterEncoding("utf-8");
			response.setCharacterEncoding("utf-8");
			response.setContentType("text/json");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		String password = request.getParameter("newpasswd");
		String phonenumber = request.getParameter("phonenumber");
		String phonevalidatecode = request.getParameter("phonevalidatecode"); 

		// 1.非空验证
		if (StringUtils.isEmpty(password)) {
			res_client(request,response,"密码不能为空",1);
			return;
		}
		if (StringUtils.isEmpty(phonenumber)) {
			res_client(request,response,"手机号不能为空",1);
			return;
		}
		// 2.手机号验证
		if (!isMobileNO(phonenumber)) {
			res_client(request,response,"手机格式不正确",1);
			return;
		}
		
		// 4.手机号验证码
		JSONObject session_phone_code_obj = (JSONObject) request.getSession().getAttribute("phone_code");
		if(session_phone_code_obj == null)
		{
			res_client(request,response, "手机验证码填写不正确", 1);
			return;
		}
		String session_phone_code = session_phone_code_obj.getString("phone_code");
		
		//5.验证手机验证码是否超过5分钟
		long sendtime = session_phone_code_obj.getLong("time");
		if(new Date().getTime()-sendtime>5*60*1000){
			res_client(request,response,"手机验码超过5分钟过期,请重新获取",1);
			return;
		}
	
		if (session_phone_code.equals(phonevalidatecode)) {
			System.out.println("手机验证码填写正确");
			System.out.println("password:" + password);
			System.out.println("phonenumber:" + phonenumber);
			User findUserByPhoneNumber = userService.findUserByPhoneNumber(phonenumber);
			findUserByPhoneNumber.setPassword(password);
			userService.updateUser(findUserByPhoneNumber);
			//初始化话题
			System.out.println("密码重设成功");
			request.getSession().removeAttribute("phone_code");
			JSONObject obj = new JSONObject();
			obj.put("code","0");
			obj.put("message", "重设密码成功");
			obj.put("userid",findUserByPhoneNumber.getUserId()+"");
			obj.put("username",findUserByPhoneNumber.getName());
			obj.put("image_url",findUserByPhoneNumber.getImgUrl() );
			responseBack(request, response,obj);
		}else{
			res_client(request,response, "手机验证码填写不正确", 1);
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

	/**
	 * 往客户端返回信息
	 * 
	 * @param response
	 * @param msg
	 *            　状态信息
	 * @param state
	 *            　0:成功 1:失败
	 * @throws IOException
	 */
	private void res_client(HttpServletRequest req,HttpServletResponse response, String msg, int state) throws IOException {
		JSONObject ret = new JSONObject();
		ret.put("code", state);
		ret.put("message", msg);
		responseBack(req,response,ret);
	}

	public static boolean isMobileNO(String mobiles) {
		if (mobiles == null) {
			return false;
		}
		Pattern p = Pattern.compile("^[1][3,4,5,8][0-9]{9}$");
		Matcher m = p.matcher(mobiles);
		System.out.println(m.matches() + "---");
		return m.matches();
	}
	
}
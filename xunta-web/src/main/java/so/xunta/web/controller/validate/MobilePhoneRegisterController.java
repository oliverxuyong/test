package so.xunta.web.controller.validate;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import so.xunta.beans.User;
import so.xunta.beans.validate.MobilePhoneValidateCode;
import so.xunta.server.LoggerService;
import so.xunta.server.MobilePhoneCodeService;
import so.xunta.server.UserService;
import so.xunta.utils.DateTimeUtils;
import so.xunta.utils.IdWorker;
import so.xunta.utils.validate.HttpSender;

@Controller
public class MobilePhoneRegisterController {

	@Autowired
	UserService userService;
	@Autowired
	MobilePhoneCodeService mpcService;
	
	@Autowired
	LoggerService loggerService;
	
	Logger logger = Logger.getLogger(MobilePhoneRegisterController.class);

	IdWorker idWorker = new IdWorker(1L, 1L);

	/**
	 * 进入手机登录页面
	 */
	@RequestMapping("/phone_login")
	public String phone_login() {
		return "/mobile_login";
	}

	/**
	 * 第一步 客户端获取图形验证码
	 */
	@RequestMapping("/get_graph_validatecode")
	public void createGraphValidateCode(HttpServletRequest req, HttpServletResponse resp) {
		int width = 90;
		// 宽度
		int height = 20;
		BufferedImage buffImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		Graphics2D g = buffImg.createGraphics();
		Random random = new Random();
		g.setColor(Color.WHITE);
		g.fillRect(0, 0, width, height);
		// 设置字体
		Font font = new Font("Times New Roman", Font.BOLD, 20);
		g.setFont(font);
		// 画边框
		g.setColor(Color.GRAY);
		g.drawRect(0, 0, width - 1, height - 1);
		g.setColor(Color.GRAY);
		// 随机产生干扰线
		for (int i = 0; i < 10; i++) {
			int x = random.nextInt(width);
			int y = random.nextInt(height);
			int x1 = random.nextInt(2);
			int y1 = random.nextInt(2);
			g.drawLine(x, y, x + x1, y + y1);
		}
		// 数字字母集合
		char[] numbersAndLettersStore = ("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
				.toCharArray();
		String randomCode = "";
		int red = 0, green = 0, blue = 0;
		for (int i = 0; i < 4; i++) {
			red = random.nextInt(255);
			green = random.nextInt(255);
			blue = random.nextInt(255);
			g.setColor(new Color(red, green, blue));
			String tem = String.valueOf(numbersAndLettersStore[random.nextInt(62)]);
			// as24
			randomCode += tem;
			g.drawString(tem, 15 * i + 16, 17);
		}
		// 验证码保存到Session范围
		HttpSession session = req.getSession();
		session.setAttribute("graph_code", randomCode.toString());
		System.out.println("code------------" + randomCode.toString());
		// 禁止缓存
		resp.setHeader("Prama", "no-cache");
		resp.setHeader("Coche-Control", "no-cache");
		resp.setDateHeader("Expires", 0);
		resp.setContentType("image/jpeg");
		// 将图像输出到
		try {
			ServletOutputStream sos = resp.getOutputStream();
			ImageIO.write(buffImg, "jpeg", sos);
			sos.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}
	}

	/**
	 * 第二步 客户端获取手机验证码，带请求参数图形验证码 图形验证码
	 */
	@RequestMapping("get_mobilephone_validatecode")
	public void getCellPhoneValidateCode(HttpServletRequest req, HttpServletResponse resp) {
		String graph_code = (String) req.getSession().getAttribute("graph_code");
		String graph_code2 = req.getParameter("graph_code");
		StringBuffer url = req.getRequestURL();
		String domain = url.delete(url.length() - req.getRequestURI().length(), url.length()).toString();
		
		if (graph_code != null) {
			if (graph_code.toLowerCase().equals(graph_code2.toLowerCase())) {
				// 图形验证码验证成功
				System.out.println("图形验证码验证成功");
				String phonenumber = req.getParameter("phonenumber");
				System.out.println("手机号码:" + phonenumber);
				if (StringUtils.isEmpty(phonenumber)) {
					try {
						resp.getWriter().write("手机号不能为空");
						return;
					} catch (IOException e) {
						// TODO Auto-generated catch block
						logger.error(e.getMessage(), e);
					}
				}
				if (isMobileNO(phonenumber)) {
					System.out.println("电话号码:" + phonenumber);
					String phone_code = RandomStringUtils.random(6, false, true);
					try {
						System.out.println("电话验证码:"+phone_code);
						String ip = req.getRemoteAddr();
						//1.检验 :同一ip地址在某一天获取手机验证码短信的条数不能大于20
						Long ip_shortmsg_num = mpcService.findShortmsgNumByIP(ip);
						System.out.println("ip:"+ip_shortmsg_num);
						if(ip_shortmsg_num>50){
							res_client(req,resp,ip+"短信验证码发送量达到当天的最大限制",1);
							return;
						}
						//2.检验：同一手机号在某一天获取手机验证码短信的条数不能大于5
						Long numByPhonenumber = mpcService.findShortmsgNumByPhonenumber(phonenumber);
						if(numByPhonenumber>5){
							res_client(req,resp, phonenumber+"短信验证码发送量达到当天的最大限制",1);
							return;
						}
						System.out.println("phonenumber num:"+numByPhonenumber);
						
						
						//3.检验:同一手机号获取验证码时间不能太频繁 1分钟一次
						Long latesttime = mpcService.findTheLatestTimestampByPhonenumber(phonenumber);
						System.out.println("latesttime:"+latesttime);
						if(latesttime !=null&&new Date().getTime()-latesttime<30000)
						{
							res_client(req,resp, "获取验证码不能太频繁,过30秒再试",1);
							return;
						}
						
						
						String state = HttpSender.sendValicateCode(phonenumber, phone_code, domain);
						
						//记录到数据库
						MobilePhoneValidateCode mpv = new MobilePhoneValidateCode();
						mpv.setMobile_phone_number(phonenumber);
						mpv.setIp(ip);
						mpv.setValidatecode(phone_code);
						Date currentTime = new Date();
						mpv.setDatetime_long(currentTime.getTime());
						mpv.setDatetime_str(DateTimeUtils.getTimeStrFromDate(currentTime));
						mpcService.addMobilePhoneCode(mpv);
						
						
						JSONObject state_json = new JSONObject(state);
						JSONObject phone_code_obj = new JSONObject();
						phone_code_obj.put("phone_code", phone_code);
						phone_code_obj.put("time", new Date().getTime());
						req.getSession().setAttribute("phone_code", phone_code_obj);
						System.out.println("state_json:" + state_json.toString());
						if (state_json.getBoolean("success")) {
							//req.getSession().removeAttribute("graph_code");
							res_client(req, resp, "验证码已发送到手机上", 0);
						} else {
							res_client(req, resp,state_json.toString(),1);
						}
					} catch (Exception e) {
						logger.error(e.getMessage(), e);
					}
				} else {
					try {
						res_client(req, resp, "手机号格式不正确",1);
					} catch (IOException e) {
						// TODO Auto-generated catch block
						logger.error(e.getMessage(), e);
					}
				}
			} else {
				System.out.println("图形验证码输入错误");
				try {
					res_client(req, resp, "图形验证码输入错误",1);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					logger.error(e.getMessage(), e);
				}
			}
			//req.getSession().removeAttribute("graph_code");
		} else {
			System.out.println("session 中不存在graph_code");
		}
	}

	/**
	 * 第三步提交注册 客户端　请求注册　带参数nickname password phonenumber,
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/register_mobilephone")
	public void register_validatephonenumber(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		response.setContentType("text/html;charset=utf-8");
		// 查询用户有名是否存在
		// 获取ip 手机号　昵称　密码等参数
		try {
			request.setCharacterEncoding("utf-8");
			response.setCharacterEncoding("utf-8");
			response.setContentType("text/json");
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage(), e);
		}
		String nickname = request.getParameter("nickname");
		String password = request.getParameter("password");
		String phonenumber = request.getParameter("phonenumber");
		String groupname = request.getParameter("groupname");

		// 1.非空验证
		if (StringUtils.isEmpty(nickname)) {
			res_client(request,response, "昵称不能为空",1);
			return;
		}
		if (StringUtils.isEmpty(password)) {
			res_client(request,response,"密码不能为空",1);
			return;
		}
		if (StringUtils.isEmpty(phonenumber)) {
			res_client(request,response,"手机号不能为空",1);
			return;
		}
		// 2.昵称是否重复
		User user = userService.findUserByName(nickname);
		if (user != null) {
			res_client(request,response,"昵称己经存在,请换用其他昵称", 1);
			return;
		}
		// 3.手机号验证
		if (!isMobileNO(phonenumber)) {
			res_client(request,response,"手机格式不正确",1);
			return;
		}
		else{
			User findUserByPhoneNumber = userService.findUserByPhoneNumber(phonenumber);
			if(findUserByPhoneNumber!=null)
			{
				res_client(request,response,"该用户已经存在,不能重复注册",1);
				return;
			}
		}
		
		// 4.手机号验证码
		String phonevalidatecode = request.getParameter("phonevalidatecode");
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

			System.out.println("nickname:" + nickname);
			System.out.println("password:" + password);
			System.out.println("phonenumber:" + phonenumber);
			System.out.println("groupname:"+groupname);
			
			//保存用户
			Long userId = idWorker.nextId();
			String third_party_id =  "null";
			String type ="Phone";
			
			User new_user = new User(userId, third_party_id, nickname,"http://42.121.136.225:8888/user-pic2.jpg", type, groupname, new Timestamp(System.currentTimeMillis()));
			new_user.setThird_party_id(idWorker.nextId()+"");
			new_user.setPassword(password);
			new_user.setPhonenumber(phonenumber);
			User u = userService.addUser(new_user);
			//初始化话题
			if(u.getIfInitedTopics()==0){//代表没有初始化话题列表
				u.setIfInitedTopics(1);
				userService.updateUser(u);
				System.out.println("初始化话题成功");
			}else{
				System.out.println("用户已初始化过话题\n");
			}

			response.setCharacterEncoding("utf-8");

			JSONObject obj = new JSONObject();
			obj.put("userid", u.getUserId().toString());
			obj.put("username",u.getName());
			obj.put("image_url", u.getImgUrl());

			System.out.println("添加用户成功:"+u.getName()+"  "+u.getUserId());
			request.getSession().removeAttribute("phone_code");
			responseBack(request, response,obj );
			
		}else{
			res_client(request,response, "手机验证码填写不正确", 1);
		}
	}
	
	@RequestMapping("/login_mobilephone")
	public void userlogin(String phonenumber,String password,HttpServletRequest request,HttpServletResponse response) throws IOException{
		System.out.println("手机用户登录：phonenumber:"+phonenumber+" password:"+password);
		//1.验证是否为空
		if(StringUtils.isEmpty(phonenumber))
		{
			res_client(request,response,"手机号为空", 1);
			return;
		}
	/*	type="Phone";
		if(StringUtils.isEmpty(type))
		{
			res_client(request,response,"账号类型不能为空",1);
			return;
		}*/
		if(StringUtils.isEmpty(password))
		{
			res_client(request,response,"密码不能为空",1);
			return;
		}
		//2.验证数据库中的用户名密码
		User user = userService.findUserByPhoneNumberAndPassword(phonenumber, password);
		if(user == null)
		{
			res_client(request,response, "手机号或密码错误", 1);
			return;
		}
		else{
			String userid = user.getUserId()+"";
			String username = user.getName();
			JSONObject ret = new JSONObject();
			ret.put("userid", userid);
			ret.put("username", username);
			ret.put("image_url", user.getImgUrl());
			ret.put("code", "1");
			ret.put("message", "登录成功");
			responseBack(request, response, ret);
		}
	}
	
	@RequestMapping("/check_mobilenum_ifexist")
	public void checkMobileNumIfExist(HttpServletRequest req,HttpServletResponse res){
		JSONObject ret = new JSONObject();
		String phoneNumber = req.getParameter("phonenumber");
	/*	if(phoneNumber==null||"".equals(phoneNumber.trim())){
			ret.put("", value)
			res.getWriter().write("{);
			return;
		}*/
		User findUserByPhoneNumber = userService.findUserByPhoneNumber(phoneNumber);
		String r = findUserByPhoneNumber!=null?"yes":"no"; 
		ret.put("ifexist", r);
		res.setContentType("text/json;charset=utf-8");
		try {
			System.out.println("验证手机号是否存在:"+r);
			responseBack(req, res, ret);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
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
		Pattern p = Pattern.compile("^[1][3,4,5,7,8][0-9]{9}$");
		Matcher m = p.matcher(mobiles);
		System.out.println(m.matches() + "---");
		return m.matches();
	}
	
}
package so.xunta.web.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

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
public class LoginController {

	@Autowired
	UserDao userDao;

	@Autowired
	LoggerService loggerService;
	
	static Logger logger = Logger.getRootLogger();

	IdWorker idWorker = new IdWorker(1L, 1L);

	// 登录验证
	public boolean checkLogin() {
		return false;
	}

	@RequestMapping("/")
	public void index(HttpServletRequest request, HttpServletResponse response) {
		response.setContentType("text/html;charset=utf-8");
		try {
			request.getRequestDispatcher("/client_code/index.html").forward(request, response);
		} catch (ServletException | IOException e) {
			logger.error(e.getMessage(), e);
		}
	}

	@RequestMapping("/login")
	public String qqloginj(String username, HttpServletRequest request, HttpServletResponse response) {
		response.setContentType("text/html;charset=utf-8");
		// 查询用户有名是否存在
		so.xunta.beans.User user = userDao.findUserByName(username);
		if (user == null) {
			user = new so.xunta.beans.User();
			user.setUserId(idWorker.nextId());
			user.setName(username);
			userDao.addUser(user);
		} else {
			System.out.println("用户不为空");
			// 查询用户话题
			// List<Topic> topicList =
			// topicDao.findTopicByUid(user.getUserId());
			// request.setAttribute("topiclist",topicList);
		}
		return "/success";
	}

	@RequestMapping("/loginjsp")
	public String loginJsp(String username, HttpServletRequest request, HttpServletResponse response) {
		response.setContentType("text/html;charset=utf-8");
		return "/login";
	}

	/**
	 * xunta.so与apicloudhelp.com 共用同一个client_id
	 * 
	 * @param request
	 * @param response
	 *
	 @RequestMapping("/qqlogin") public void qqlogin(HttpServletRequest request,
	 *                             HttpServletResponse response) {
	 *                             response.setContentType
	 *                             ("text/html;charset=utf-8"); try {
	 *                             System.out.println("跳转的地址为："+new
	 *                             Oauth().getAuthorizeURL(request)); String
	 *                             domain = "xunta.so"; String client_id =
	 *                             "101100198"; String app_key =
	 *                             "6f2b759b6c847f6d91b393cf89e1bd0a";
	 *                             StringBuffer url = request.getRequestURL();
	 *                             String tempContextUrl =
	 *                             url.delete(url.length() -
	 *                             request.getRequestURI().length(),
	 *                             url.length()).toString();
	 *                             System.out.println("tempContextUrl:"
	 *                             +tempContextUrl); String redirect_url = "";
	 *                             if(tempContextUrl.indexOf("mxunta.so")!=-1){
	 *                             domain = "www.mxunta.so"; redirect_url =
	 *                             "https://graph.qq.com/oauth2.0/authorize?client_id=101214455&redirect_uri=http://www.mxunta.so/qq_callback&response_type=code&state=d9a9dec4b13adc021c1e35ced1e91103&scope=get_user_info,add_topic,add_one_blog,add_album,upload_pic,list_album,add_share,check_page_fans,add_t,add_pic_t,del_t,get_repost_list,get_info,get_other_info,get_fanslist,get_idollist,add_idol,del_ido,get_tenpay_addr"
	 *                             ; }else
	 *                             if(tempContextUrl.indexOf("apicloudhelp.com"
	 *                             )!=-1){ domain = "www.apicloudhelp.com";
	 *                             redirect_url =
	 *                             "https://graph.qq.com/oauth2.0/authorize?client_id=101100198&redirect_uri=http://www.apicloudhelp.com/qq_callback&response_type=code&state=c5f6304dd05a96ddae0e0717ef5aba64&scope=get_user_info,add_topic,add_one_blog,add_album,upload_pic,list_album,add_share,check_page_fans,add_t,add_pic_t,del_t,get_repost_list,get_info,get_other_info,get_fanslist,get_idollist,add_idol,del_ido,get_tenpay_addr"
	 *                             ; }else
	 *                             if(tempContextUrl.indexOf("chninn.com")!=-1){
	 *                             domain = "www.chninn.com"; redirect_url =
	 *                             "https://graph.qq.com/oauth2.0/authorize?client_id=101100198&redirect_uri=http://www.chninn.com/qq_callback&response_type=code&state=c5f6304dd05a96ddae0e0717ef5aba64&scope=get_user_info,add_topic,add_one_blog,add_album,upload_pic,list_album,add_share,check_page_fans,add_t,add_pic_t,del_t,get_repost_list,get_info,get_other_info,get_fanslist,get_idollist,add_idol,del_ido,get_tenpay_addr"
	 *                             ; }else{
	 *                             if(tempContextUrl.indexOf("xunta.so/XunTaTestWeb"
	 *                             )!=-1){ domain = "www.xunta.so/XunTaTestWeb";
	 *                             redirect_url =
	 *                             "https://graph.qq.com/oauth2.0/authorize?client_id=101100198&redirect_uri=http://www.xunta.so/XunTaTestWeb/qq_callback&response_type=code&state=c5f6304dd05a96ddae0e0717ef5aba64&scope=get_user_info,add_topic,add_one_blog,add_album,upload_pic,list_album,add_share,check_page_fans,add_t,add_pic_t,del_t,get_repost_list,get_info,get_other_info,get_fanslist,get_idollist,add_idol,del_ido,get_tenpay_addr"
	 *                             ; }else{ redirect_url =
	 *                             "https://graph.qq.com/oauth2.0/authorize?client_id=101100198&redirect_uri=http://xunta.so/qq_callback&response_type=code&state=c5f6304dd05a96ddae0e0717ef5aba64&scope=get_user_info,add_topic,add_one_blog,add_album,upload_pic,list_album,add_share,check_page_fans,add_t,add_pic_t,del_t,get_repost_list,get_info,get_other_info,get_fanslist,get_idollist,add_idol,del_ido,get_tenpay_addr"
	 *                             ; } }
	 *                             System.out.println("请求qq授权:"+redirect_url);
	 *                             //response.sendRedirect(new
	 *                             Oauth().getAuthorizeURL(request));
	 *                             response.sendRedirect(redirect_url);
	 * 
	 *                             } catch (QQConnectException e) {
	 *                             logger.error(e.getMessage(), e); } catch (IOException e)
	 *                             { // TODO Auto-generated catch block
	 *                             logger.error(e.getMessage(), e); } }
	 */

	@RequestMapping("/weibo_login")
	public void sina_weibo_login(HttpServletRequest request, HttpServletResponse response) throws IOException {
		System.out.println("微博登录");
		weibo4j.Oauth oauth = new weibo4j.Oauth();
		try {
			response.sendRedirect(oauth.authorize("code", null));
		} catch (IOException e) {
			try {
				response.getWriter().write(e.getMessage());
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		} catch (WeiboException e) {
			response.getWriter().write(e.getMessage());
		}
	}

	@RequestMapping("/weibo_callback")
	public void weibo_callback(String code, HttpServletRequest request, HttpServletResponse response)
			throws ClassNotFoundException, WeiboException, IllegalArgumentException, IllegalAccessException,
			JSONException, weibo4j.org.json.JSONException {
		weibo4j.Oauth oauth = new weibo4j.Oauth();
		weibo4j.http.AccessToken access_token = oauth.getAccessTokenByCode(code);
		Account am = new Account(access_token.getAccessToken());
		weibo4j.org.json.JSONObject uid = am.getUid();
		System.out.println(uid.getLong("uid"));
		Users um = new Users(access_token.getAccessToken());
		weibo4j.model.User user = um.showUserById(String.valueOf(uid.getLong("uid")));
		Field[] fields = User.class.getDeclaredFields();
		System.out.println(user.toString());
		org.json.JSONObject user_json = new org.json.JSONObject();
		for (Field field : fields) {
			field.setAccessible(true);
			Object obj = field.get(user);
			if (obj != null) {
				user_json.put(field.getName(), obj.toString());
			}
		}
		try {
			response.setCharacterEncoding("utf-8");
			response.setContentType("text/json");
			response.getWriter().write(user_json.toString());
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}

	/**
	 * 从微信公众号登录
	 * @author 叶夷
	 */
	@RequestMapping("/wxpnCallback")
	public void wxpnCallback(HttpServletRequest request, HttpServletResponse response) throws ClassNotFoundException,
			WeiboException, IllegalArgumentException, IllegalAccessException, JSONException,
			weibo4j.org.json.JSONException, UnsupportedEncodingException {
		System.out.println("微信从公众号登录");
		response.setContentType("text/html; charset=utf-8");
		String code = request.getParameter("code");
		System.out.println("code:" + code);
		String appid = "wxdac88d71df6be268";
		String secret = "753b50cf29b6b08e733e357cc0ed348c";
		String codeToToken = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + secret
				+ "&code=" + code + "&grant_type=authorization_code";
		String weiXinInfo = httpclientReq(codeToToken);
		System.out.println("weiXinInfo: " + weiXinInfo);
		org.json.JSONObject weiXinInfoJson = new org.json.JSONObject(weiXinInfo);
		String accessToken = weiXinInfoJson.get("access_token").toString();
		String openid = weiXinInfoJson.get("openid").toString();

		System.out.println("============");
		System.out.println("openid: " + openid);
		System.out.println("============");

		String userInfo = httpclientReq("https://api.weixin.qq.com/sns/userinfo?access_token=" + accessToken
				+ "&openid=" + openid + "&lang=zh_CN");
		System.out.println("get json: \n" + userInfo);
		JSONObject userInfoJson = new JSONObject(new String(userInfo.getBytes("ISO-8859-1"), "UTF-8"));
		String nickname = userInfoJson.get("nickname").toString();
		String sex = userInfoJson.get("sex").toString();
		String unionid = userInfoJson.get("unionid").toString();
		// 获取wechat头像并保存本地
		String headImgUrl = userInfoJson.get("headimgurl").toString();
		System.out.println("imageUrl ====>  " + headImgUrl);

		if (sex.equals("1")) {
			sex = "男";
		} else {
			sex = "女";
		}
		String uid = unionid;
		String image = headImgUrl;
		String name = nickname;
		String type = "WX";
		so.xunta.beans.User finduser = userDao.findUserByThirdPartyIdAndType(uid, type);
		if (finduser != null) {
			image = finduser.getImgUrl();
			name = finduser.getName();
		}
		// TemplateMessageTestUtils.saveAsFileWriter(uid, openid);

		// 更新已关注的用户openid
		// TempInsertOpenidUtils.updateOpenid();

		//如果有些用户的openid没有保存，则登录时保存更新
		User user = userDao.findUserByThirdPartyId(unionid);
		if (user != null && user.getOpenid() == null) {
			System.out.println("user openid: " +openid);
			user.setOpenid(openid);
			userDao.updateUser(user);
		}
		responseCookieAndHtml(request, response, uid, unionid, image, name, type, openid);
	}

	@RequestMapping("/wx_callback")
	public void wx_callback(String code, HttpServletRequest request, HttpServletResponse response)
			throws ClassNotFoundException, WeiboException, IllegalArgumentException, IllegalAccessException,
			JSONException, weibo4j.org.json.JSONException, UnsupportedEncodingException {
		System.out.println("微信登录");
		response.setContentType("text/html; charset=utf-8");
		// 获取code
		String weixin_code = request.getParameter("code");
		// 通过code获取token
		System.out.println("获取到code:" + code);
		// https://open.weixin.qq.com/connect/qrconnect?appid=wxed5db4b066e33c7b&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_login&state=705e582b0990b1e9b2fb860b823f2a9e#wechat_redirec
		String appid = "wx0ad98a24caca02ca";
		String secret = "d967dc101ad34ff81062309e2be96b46";
		StringBuffer url = request.getRequestURL();
		String tempContextUrl = url.delete(url.length() - request.getRequestURI().length(), url.length()).toString();
		System.out.println("tempContextUrl:" + tempContextUrl);
		// 根据不同的域名设置不同的appid 和 AppSecret
		if (tempContextUrl.indexOf("mxunta.so") != -1) {
			appid = "wxed5db4b066e33c7b";
			secret = "705e582b0990b1e9b2fb860b823f2a9e";
		} else if (tempContextUrl.indexOf("apicloudhelp.com") != -1) {
			appid = "wx21bb67455f378f10";
			secret = "6cfd35dff4ff07214fa6ed096ac60417";
		} else if (tempContextUrl.indexOf("chninn.com") != -1) {
			appid = "wx18d4b6814c1fb62a";
			secret = "1d226da4c01b7367486b0b477dc7343d";
		} else if (tempContextUrl.indexOf("ainiweddingcloud.com") != -1) {
			appid = "wx93e3523f339ede0d";
			secret = "9754e6b7c33feb2a246ce7f8e81a4c01";
		}
		String codeToToken = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + secret
				+ "&code=" + weixin_code + "&grant_type=authorization_code";
		System.out.println(codeToToken);
		String weiXinInfo = httpclientReq(codeToToken);
		org.json.JSONObject weiXinInfoJson = new org.json.JSONObject(weiXinInfo);
		System.out.println("微信登录获取返回的weiXinInfoJson:" + weiXinInfoJson.toString(2));
		String accessToken = weiXinInfoJson.get("access_token").toString();
		String openid = weiXinInfoJson.get("openid").toString();
		// 通过token 换取 userInfo
		String userInfo = httpclientReq("https://api.weixin.qq.com/sns/userinfo?access_token=" + accessToken
				+ "&openid=" + openid + "");
		JSONObject userInfoJson = new JSONObject(userInfo);
		String nickname = new String(userInfoJson.get("nickname").toString().getBytes("ISO-8859-1"), "UTF-8");
		String sex = userInfoJson.get("sex").toString();
		//String province = userInfoJson.get("province").toString();
		//String city = userInfoJson.get("city").toString();
	//	String country = userInfoJson.get("country").toString();
		String unionid = userInfoJson.get("unionid").toString();
		// 获取wechat头像并保存本地
		String headImgUrl = userInfoJson.get("headimgurl").toString();
		System.out.println("imageUrl ====>  " + headImgUrl);

		if (sex.equals("1")) {
			sex = "男";
		} else {
			sex = "女";
		}
		String uid = unionid;
		String image = headImgUrl;
		String name = nickname;
		String type = "WX";
		so.xunta.beans.User finduser = userDao.findUserByThirdPartyIdAndType(uid, type);
		if (finduser != null) {
			image = finduser.getImgUrl();
			name = finduser.getName();
		}

		responseCookieAndHtml(request, response, uid, unionid, image, name, type, null);

	}

	private void responseCookieAndHtml(HttpServletRequest request, HttpServletResponse response, String uid,
			String unionid, String image, String name, String type, String openid) {
		try {

			Cookie cookie_name = new Cookie("name", URLEncoder.encode(name, "UTF-8"));
			Cookie cookie_userid = new Cookie("uid", uid);
			Cookie cookie_unionid = new Cookie("unionid", unionid);
			Cookie cookie_imageUrl = new Cookie("image", image);
			Cookie cookie_openid = new Cookie("openid", openid);
			
			System.out.println("============");
			System.out.println("openid: "+openid);
			System.out.println("============");
			
			System.out.println("image:" + image);
			System.out.println("name:haha" + name);
			Cookie cookie_type = new Cookie("type", type);
			List<Cookie> cookies = new ArrayList<Cookie>();

			String domain = getDomainWithOutContext(request);
			if (domain.contains("www")) {
			} else {
				domain = "http://www." + domain.substring(domain.indexOf("http://") + 7);
			}
			System.out.println("set cookie on domain:" + domain);

			cookies.add(cookie_userid);
			cookies.add(cookie_name);
			cookies.add(cookie_imageUrl);
			cookies.add(cookie_type);
			cookies.add(cookie_unionid);
			cookies.add(cookie_openid);
			

			for (Cookie cookie : cookies) {
				// cookie.setMaxAge(24*60*60*30);
				response.addCookie(cookie);
			}
			request.getSession().setAttribute("setcookies", cookies);
		//	loggerService.log(uid, name, type + "授权登录成功获取用户信息");
			logger.info("授权登录成功获取用户信息");
			// request.getRequestDispatcher("/client_code/index.html").forward(request,
			// response);
			String domainWithContext = getDomainWithContext(request);
			/**
			 * check if has 'www' in url
			 */
			if (domainWithContext.contains("www")) {
			} else {
				domainWithContext = "http://www."
						+ domainWithContext.substring(domainWithContext.indexOf("http://") + 7);
				request.getSession().setAttribute("indexpageurl", domainWithContext + "client_code/index.html");
				System.out.println("==> redirect to url :" + domainWithContext + "showindexpage?indexpageurl="
						+ domainWithContext + "client_code/index.html&name=" + name + "&uid=" + uid + "&unionid="
						+ unionid + "&image=" + image + "&type=" + type);
				String recirectUrl = domainWithContext + "showindexpage?indexpageurl=" + domainWithContext
						+ "client_code/index.html&name=" + URLEncoder.encode(name, "UTF-8") + "&uid=" + uid
						+ "&unionid=" + unionid + "&image=" + image + "&type=" + type;
				response.sendRedirect(recirectUrl);
				return;
			}
			System.out.println("==>redirect to url :" + domainWithContext);
			response.sendRedirect(domainWithContext + "client_code/index.html");
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}

	@RequestMapping("/showindexpage")
	public void showindexpage(HttpServletRequest request, HttpServletResponse response)
			throws UnsupportedEncodingException {
		String indexpageurl = request.getParameter("indexpageurl");
		String name = URLDecoder.decode(request.getParameter("name"), "UTF-8");

		System.out.println("showindexpage name:" + name);
		String uid = request.getParameter("uid");
		String unionid = request.getParameter("unionid");
		String image = request.getParameter("image");
		String type = request.getParameter("type");

		System.out.println("showindexpage indexPageUrl:" + indexpageurl);

		Cookie cookie_name = new Cookie("name", URLEncoder.encode(name, "utf-8"));
		Cookie cookie_userid = new Cookie("uid", uid);
		Cookie cookie_unionid = new Cookie("unionid", unionid);
		Cookie cookie_imageUrl = new Cookie("image", image);
		Cookie cookie_type = new Cookie("type", type);
		List<Cookie> cookies = new ArrayList<Cookie>();

		cookies.add(cookie_userid);
		cookies.add(cookie_name);
		cookies.add(cookie_imageUrl);
		cookies.add(cookie_type);
		cookies.add(cookie_unionid);

		System.out.println("cookies:" + cookies);
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				// cookie.setMaxAge(24*60*60*30);
				response.addCookie(cookie);
			}
		}
		try {
			response.sendRedirect(indexpageurl);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}

	}

	/**
	 * get url like : http://mxunta.so/xunta-web/
	 * 
	 * @param request
	 * @return
	 */
	public String getDomainWithContext(HttpServletRequest request) {
		StringBuffer url = request.getRequestURL();
		String tempContextUrl = url.delete(url.length() - request.getRequestURI().length(), url.length())
				.append(request.getServletContext().getContextPath()).append("/").toString();
		return tempContextUrl;
	}

	/**
	 * get url like:http://mxunta.so/
	 * 
	 * @param request
	 * @return
	 */
	public String getDomainWithOutContext(HttpServletRequest request) {
		StringBuffer url = request.getRequestURL();
		String tempContextUrl = url.delete(url.length() - request.getRequestURI().length(), url.length()).append("/")
				.toString();
		return tempContextUrl;
	}

	@SuppressWarnings("deprecation")
	@RequestMapping("/qq_callback")
	public void qqLoginSuccess(HttpServletRequest request, HttpServletResponse response) {
		response.setContentType("text/html; charset=utf-8");
		System.out.println("执行qq_callback");
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}

		try {
			//这里有空指针异常
			AccessToken accessTokenObj = (new Oauth()).getAccessTokenByQueryString(request.getQueryString(),
					request.getParameter("state"));
			String code = request.getParameter("code");
			String state = request.getParameter("state");
			System.out.println("获取到的code:" + code);
			System.out.println("state:" + state);
			request.getSession().setAttribute("code", code);
			request.getSession().setAttribute("state", state);
			String accessToken = null, openID = null;
			long tokenExpireIn = 0L;
			if (accessTokenObj.getAccessToken().equals("")) {
				// 我们的网站被CSRF攻击了或者用户取消了授权
				// 做一些数据统计工作
				System.out.print("没有获取到响应参数");
			} else {
				accessToken = accessTokenObj.getAccessToken();
				tokenExpireIn = accessTokenObj.getExpireIn();

				request.getSession().setAttribute("demo_access_token", accessToken);
				request.getSession().setAttribute("demo_token_expirein", String.valueOf(tokenExpireIn));

				// 利用获取到的accessToken 去获取当前用的openid -------- start
				OpenID openIDObj = new OpenID(accessToken);
				openID = openIDObj.getUserOpenID();

				// 利用获取到的accessToken 去获取当前用户的openid --------- end

				UserInfo qzoneUserInfo = new UserInfo(accessToken, openID);
				UserInfoBean userInfoBean = qzoneUserInfo.getUserInfo();

				if (userInfoBean.getRet() == 0) {
					String uid = openID;
					String image = userInfoBean.getAvatar().getAvatarURL50();
					String name = userInfoBean.getNickname();
					String type = "QQ";

					so.xunta.beans.User finduser = userDao.findUserByThirdPartyIdAndType(uid, type);
					if (finduser != null) {
						name = finduser.getName();
						image = finduser.getImgUrl();
					}
					responseCookieAndHtml(request, response, uid, uid, image, name, type, null);
				} else {
					out.println("很抱歉，我们没能正确获取到您的信息，原因是： " + userInfoBean.getMsg());
				}
			}
		} catch (QQConnectException e) {
			logger.error(e.getMessage(), e);
		}
	}

	public static String httpclientReq(String url) {
		HttpClient httpClient = new HttpClient();
		GetMethod getMethod = new GetMethod(url); // 创建GET方法的实
		String response = null;
		try {
			int statusCode = httpClient.executeMethod(getMethod); // 执行getMethod
			System.out.println("statusCode  :  " + statusCode);
			response = getMethod.getResponseBodyAsString(); // 读取服务器返回的页面代码，这里用的是字符读法
		} catch (HttpException e) {
			System.out.println("Please check your provided http address!  发生致命的异常，可能是协议不对或者返回的内容有问题"); // 发生致命的异常，可能是协议不对或者返回的内容有问题
			logger.error(e.getMessage(), e);
		} catch (IOException e) { // 发生网络异常
			logger.error(e.getMessage(), e);
		} finally { // 释放连接
			getMethod.releaseConnection();
		}
		return response;
	}

	@RequestMapping("/user_login")
	public void user_login(String uid, HttpServletRequest request, HttpServletResponse response) {
		// 传一个uid,查询是否存在

		request.getSession().setAttribute(Constants.WEBSOCKET_USERNAME, uid);
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/json");
		try {
			response.getWriter().write("ok");
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}
}

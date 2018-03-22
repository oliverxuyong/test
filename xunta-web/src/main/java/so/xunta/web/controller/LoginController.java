package so.xunta.web.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.lang.reflect.Field;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.sql.Timestamp;
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
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.qq.connect.QQConnectException;
import com.qq.connect.api.OpenID;
import com.qq.connect.api.qzone.UserInfo;
import com.qq.connect.javabeans.AccessToken;
import com.qq.connect.javabeans.qzone.UserInfoBean;
import com.qq.connect.oauth.Oauth;

import so.xunta.beans.Token;
import so.xunta.beans.User;
import so.xunta.persist.TokenDao;
import so.xunta.persist.UserDao;
import so.xunta.server.LoggerService;
import so.xunta.server.OpenId2EventScopeService;
import so.xunta.server.WeChatService;
import so.xunta.utils.HttpRequestUtil;
import so.xunta.utils.IdWorker;
import so.xunta.utils.WeChatServerConfiCheckUtils;
import so.xunta.websocket.config.Constants;
import weibo4j.Account;
import weibo4j.Users;
import weibo4j.model.WeiboException;

@Controller
public class LoginController {

	@Autowired
	UserDao userDao;

	@Autowired
	LoggerService loggerService;

	@Autowired
	private WeChatService weChatService;
	
	@Autowired
	private OpenId2EventScopeService openId2EventScopeService;
	
	@Autowired
	private TokenDao tokenDao;

	static Logger logger = Logger.getLogger(LoginController.class);

	IdWorker idWorker = new IdWorker(1L, 1L);

	@Value("${appid}")
	private String appid;
	@Value("${appsecret}")
	private String appsecret;
	@Value("${templateid}")
	private String templateid;
	@Value("${templateurl}")
	private String templateurl;
	@Value("${serverToken}")
	private String serverToken;
	@Value("${towCode_templateContent}")
	private String towCode_templateContent;
	@Value("${key}")
	private String key;

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
			logger.debug("用户不为空");
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
	 *                             logger.error(e.getMessage(), e); } catch
	 *                             (IOException e) { // TODO Auto-generated
	 *                             catch block logger.error(e.getMessage(), e);
	 *                             } }
	 */

	@RequestMapping("/weibo_login")
	public void sina_weibo_login(HttpServletRequest request, HttpServletResponse response) throws IOException {
		logger.info("微博登录");
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
		logger.debug(uid.getLong("uid"));
		Users um = new Users(access_token.getAccessToken());
		weibo4j.model.User user = um.showUserById(String.valueOf(uid.getLong("uid")));
		Field[] fields = User.class.getDeclaredFields();
		logger.debug(user.toString());
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
	 * 
	 * @author 叶夷
	 */
	@RequestMapping("/wxpnCallback")
	public void wxpnCallback(HttpServletRequest request, HttpServletResponse response) throws ClassNotFoundException,
			WeiboException, IllegalArgumentException, IllegalAccessException, JSONException,
			weibo4j.org.json.JSONException, UnsupportedEncodingException {
		logger.info("微信从公众号登录:"+request.getQueryString());
		response.setContentType("text/html; charset=utf-8");
		String code = request.getParameter("code");
		logger.debug("code:" + code);

		// 获得登录的url
		String loginUrl = request.getRequestURL().toString();
		logger.info("从微信公众号进来的url:" + loginUrl);

		/*// 判断从哪个网址进来的公众号之后匹配其相应的公众号参数
		if (loginUrl.contains("www.ainiweddingcloud.com")) {
			appid = aini_appid;
			secret = aini_appsecret;
		} else {
			appid = xunta_appid;
			secret = xunta_appsecret;
		}*/

		String codeToToken = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + appsecret
				+ "&code=" + code + "&grant_type=authorization_code";
		String weiXinInfo = httpclientReq(codeToToken);
		logger.debug("weiXinInfo: " + weiXinInfo);
		org.json.JSONObject weiXinInfoJson = new org.json.JSONObject(weiXinInfo);
		String accessToken = weiXinInfoJson.get("access_token").toString();
		String openid = weiXinInfoJson.get("openid").toString();

		logger.debug("============");
		logger.debug("openid: " + openid);
		logger.debug("============");

		String userInfo = httpclientReq("https://api.weixin.qq.com/sns/userinfo?access_token=" + accessToken
				+ "&openid=" + openid + "&lang=zh_CN");
		logger.debug("get json: \n" + userInfo);
		JSONObject userInfoJson = new JSONObject(new String(userInfo.getBytes("ISO-8859-1"), "UTF-8"));
		String nickname = userInfoJson.get("nickname").toString();
		String sex = userInfoJson.get("sex").toString();
		String unionid = userInfoJson.get("unionid").toString();
		// 获取wechat头像并保存本地
		String headImgUrl = userInfoJson.get("headimgurl").toString();
		logger.debug("imageUrl ====>  " + headImgUrl);

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
		User user=null;
		//2018.03.22  叶夷    通过openid查找用户是否存在然后更新用户信息
		user=userDao.findUserByOpenId(openid);
		if(user!=null){
			user.setUnion_id(unionid);
			userDao.updateUser(user);
		}

		// 如果有些用户的openid没有保存，则登录时保存更新
		user = userDao.findUserByThirdPartyId(unionid);
		if (user != null && user.getOpenid() == null) {
			logger.debug("user openid: " + openid);
			user.setOpenid(openid);
			userDao.updateUser(user);
		}
		responseCookieAndHtml(request, response, uid, unionid, image, name, type, openid);
	}
	
	/*
	 * 2018.02.02  叶夷   微信小程序登录
	*/
	@RequestMapping("/wxAppletLogin")
	public void wxMiniAppsLogin(HttpServletRequest request, HttpServletResponse response) throws ClassNotFoundException,
			WeiboException, IllegalArgumentException, IllegalAccessException, JSONException,
			weibo4j.org.json.JSONException, UnsupportedEncodingException {
		logger.info("微信从小程序登录url:"+request.getRequestURL());
		logger.info("微信从小程序登录:"+request.getQueryString());
		response.setContentType("text/html; charset=utf-8");
		
		String[] paremetersArray=request.getQueryString().split("&");
		String uid,unionid,image,name,type,openid;
		unionid=paremetersArray[0].split("=")[1];
		uid=unionid;	
		image=paremetersArray[1].split("=")[1];
		name=paremetersArray[2].split("=")[1];
		type="WX";
		openid=paremetersArray[3].split("=")[1];
		
		/*so.xunta.beans.User finduser = userDao.findUserByThirdPartyIdAndType(uid, type);
		if (finduser != null) {
			image = finduser.getImgUrl();
			name = finduser.getName();
		}

		// 如果有些用户的openid没有保存，则登录时保存更新
		User user = userDao.findUserByThirdPartyId(unionid);
		if (user != null && user.getOpenid() == null) {
			logger.debug("user openid: " + openid);
			user.setOpenid(openid);
			userDao.updateUser(user);
		}*/
		
		responseCookieAndHtml(request, response, uid, unionid, image, name, type, openid);
	}

	@RequestMapping("/wx_callback")
	public void wx_callback(String code, HttpServletRequest request, HttpServletResponse response)
			throws ClassNotFoundException, WeiboException, IllegalArgumentException, IllegalAccessException,
			JSONException, weibo4j.org.json.JSONException, UnsupportedEncodingException {
		// logger.info("微信登录");
		response.setContentType("text/html; charset=utf-8");
		// 获取code
		String weixin_code = request.getParameter("code");
		// 通过code获取token
		logger.debug("获取到code:" + code);
		// https://open.weixin.qq.com/connect/qrconnect?appid=wxed5db4b066e33c7b&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_login&state=705e582b0990b1e9b2fb860b823f2a9e#wechat_redirec
		String appid = "wx0ad98a24caca02ca";
		String secret = "d967dc101ad34ff81062309e2be96b46";
		StringBuffer url = request.getRequestURL();
		String tempContextUrl = url.delete(url.length() - request.getRequestURI().length(), url.length()).toString();
		logger.debug("tempContextUrl:" + tempContextUrl);
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
		logger.debug(codeToToken);
		String weiXinInfo = httpclientReq(codeToToken);
		org.json.JSONObject weiXinInfoJson = new org.json.JSONObject(weiXinInfo);
		logger.debug("微信登录获取返回的weiXinInfoJson:" + weiXinInfoJson.toString(2));
		String accessToken = weiXinInfoJson.get("access_token").toString();
		String openid = weiXinInfoJson.get("openid").toString();
		// 通过token 换取 userInfo
		String userInfo = httpclientReq("https://api.weixin.qq.com/sns/userinfo?access_token=" + accessToken
				+ "&openid=" + openid + "");
		JSONObject userInfoJson = new JSONObject(userInfo);
		String nickname = new String(userInfoJson.get("nickname").toString().getBytes("ISO-8859-1"), "UTF-8");
		String sex = userInfoJson.get("sex").toString();
		// String province = userInfoJson.get("province").toString();
		// String city = userInfoJson.get("city").toString();
		// String country = userInfoJson.get("country").toString();
		String unionid = userInfoJson.get("unionid").toString();
		// 获取wechat头像并保存本地
		String headImgUrl = userInfoJson.get("headimgurl").toString();
		logger.debug("imageUrl ====>  " + headImgUrl);

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
			logger.info(name + "微信登录");
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

			logger.debug("============");
			logger.debug("openid: " + openid);
			logger.debug("============");

			logger.debug("image:" + image);
			logger.debug("name:" + name);
			Cookie cookie_type = new Cookie("type", type);
			List<Cookie> cookies = new ArrayList<Cookie>();

			//2018.02.08  叶夷   获取请求路径的协议
			String protocal="https：";
			logger.info("登录时获取路径的协议:" + protocal);
			
			String domain = getDomainWithOutContext(request);
			logger.debug("domain:" + domain);
			if (domain.contains("www")) {
			} else {
				//domain = "http://www." + domain.substring(domain.indexOf("http://") + 7);
				//2018.02.08  叶夷   将协议变成请求的协议
				domain = protocal+"://www." + domain.substring(domain.indexOf(protocal+"://") + 7);
			}
			logger.debug("set cookie on domain:" + domain);

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
			// loggerService.log(uid, name, type + "授权登录成功获取用户信息");
			logger.debug("授权登录成功获取用户信息");
			// request.getRequestDispatcher("/client_code/index.html").forward(request,
			// response);
			String domainWithContext = getDomainWithContext(request);
			logger.debug("domainWithContext:" + domainWithContext);
			/**
			 * check if has 'www' in url
			 */
			if (domainWithContext.contains("www")) {
			} else {
				//domainWithContext = "http://www."
				//2018.02.08  叶夷   将协议变成请求的协议
				domainWithContext = protocal+"://www."
						+ domainWithContext.substring(domainWithContext.indexOf(protocal+"://") + 7);
				request.getSession().setAttribute("indexpageurl", domainWithContext + "client_code/index.html");
				logger.debug("==> redirect to url :" + domainWithContext + "showindexpage?indexpageurl="
						+ domainWithContext + "client_code/index.html&name=" + name + "&uid=" + uid + "&unionid="
						+ unionid + "&image=" + image + "&type=" + type);
				String recirectUrl = domainWithContext + "showindexpage?indexpageurl=" + domainWithContext
						+ "client_code/index.html&name=" + URLEncoder.encode(name, "UTF-8") + "&uid=" + uid
						+ "&unionid=" + unionid + "&image=" + image + "&type=" + type;
				response.sendRedirect(recirectUrl);
				return;
			}
			domainWithContext=domainWithContext.replace("http:", "https:");
			logger.debug("==>redirect to url :" + domainWithContext);
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

		logger.debug("showindexpage name:" + name);
		String uid = request.getParameter("uid");
		String unionid = request.getParameter("unionid");
		String image = request.getParameter("image");
		String type = request.getParameter("type");

		logger.debug("showindexpage indexPageUrl:" + indexpageurl);

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

		logger.debug("cookies:" + cookies);
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
		logger.debug("执行qq_callback");
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}

		try {
			// 这里有空指针异常
			AccessToken accessTokenObj = (new Oauth()).getAccessTokenByQueryString(request.getQueryString(),
					request.getParameter("state"));
			String code = request.getParameter("code");
			String state = request.getParameter("state");
			logger.debug("获取到的code:" + code);
			logger.debug("state:" + state);
			request.getSession().setAttribute("code", code);
			request.getSession().setAttribute("state", state);
			String accessToken = null, openID = null;
			long tokenExpireIn = 0L;
			if (accessTokenObj.getAccessToken().equals("")) {
				// 我们的网站被CSRF攻击了或者用户取消了授权
				// 做一些数据统计工作
				logger.debug("没有获取到响应参数");
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
						logger.info(name + "QQ登录");
					}
					responseCookieAndHtml(request, response, uid, uid, image, name, type, null);
				} else if (out != null) {
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

	/** 生成微信权限验证的参数，传到前端去验证,为了自定义微信分享链接 */
	@RequestMapping("/sendShareLinksMsg")
	public void sendWeChatShareLinkMsg(HttpServletRequest request, HttpServletResponse response)
			throws UnsupportedEncodingException {
		String url = request.getParameter("url");
		// 判断从哪个网址进来的公众号之后匹配其相应的公众号参数
		/*if (url.contains(aini_templateurl)) {
			appid = aini_appid;
			secret = aini_appsecret;
		} else {
			appid = xunta_appid;
			secret = xunta_appsecret;
		}*/

		JSONObject ret = weChatService.makeWXTicket(url, appid, appsecret);
		try {
			logger.debug("执行sendWeChatShareLinkMsg...");
			response.setCharacterEncoding("utf-8");
			responseBack(request, response, ret);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
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

	/** 2017.11.17 叶夷 从微信分享链接进入这里，然后访问微信自动登录的链接 */
	@RequestMapping("/wxShareLinksLogin")
	public void sendWeChatShareLinkLogin(HttpServletRequest request, HttpServletResponse response) {
		try {
			response.sendRedirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdac88d71df6be268&redirect_uri=http%3a%2f%2fwww.xunta.so%2fwxpnCallback&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect");// 跳转到微信自动登录页面
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}

	/**
	 * 2017.12.04 叶夷 微信带参数的二维码扫描之后到这里的路径
	 */
	@RequestMapping("/wxTwoBarCodeLogin")
	public void sendWeChatTwoBarCodeLogin(HttpServletRequest request, HttpServletResponse response) {
		logger.info("执行wxTwoBarCodeLogin..."+request.getQueryString());
		// start:2017.12.04 叶夷 这里只是为了微信服务器配置验证
		// 微信加密签名
		String signature = request.getParameter("signature");
		String timestamp = request.getParameter("timestamp");
		// 随机数
		String nonce = request.getParameter("nonce");
		// 随机字符串
		//String echostr = request.getParameter("echostr");
		WeChatServerConfiCheckUtils wcscs = new WeChatServerConfiCheckUtils();
		logger.info("验证结果:" + wcscs.checkSignature(serverToken, signature, timestamp, nonce));
		if (wcscs.checkSignature(serverToken, signature, timestamp, nonce)) {
			logger.info("扫描关注之后发送模版消息...");
			processRequest(request);
			
			//这里只是为了服务器配置验证
			
			/*PrintWriter out;
			try {
				out = response.getWriter();
				out.print(echostr);
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}*/
		}
		// end:2017.12.04 叶夷 这里只是为了微信服务器配置验证
		
	}
	
	/**
     * 处理微信发来的请求
     * 
     * @param request
     * @return xml
     */
    private void processRequest(HttpServletRequest request) {
    	Map<String, String> map = new HashMap<String, String>();
		SAXReader reader = new SAXReader();
		InputStream ins = null;
		Document doc = null;
		try {
			ins = request.getInputStream();
			doc = reader.read(ins);

			Element root = doc.getRootElement();
			@SuppressWarnings("unchecked")
			List<Element> list = root.elements();
			for (Element e : list) {
				map.put(e.getName(), e.getText());
				logger.info("解析扫码之后的事件推送数据:" + e.getName() + "->" + e.getText());
			}
			ins.close();
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		} catch (DocumentException e) {
			logger.error(e.getMessage(), e);
		}

		// 开发者微信号
//		String toUserName = map.get("ToUserName");
		// 发送方帐号（一个OpenID）
		String fromUserName = map.get("FromUserName");
		// 消息创建时间(整型)
//		String createTime = map.get("CreateTime");
//		// 消息类型 event
//		String msgType = map.get("MsgType");
//		// 事件类型（subscribe）
		String event=map.get("Event");
//		// 用户未关注：事件KEY值，qrscene_为前缀，后面为二维码参数值；用户已关注：事件key值，是一个32位无符号整数，即创建二维码时的二维码scene_id
		String eventKey=map.get("EventKey");
//		// 二维码的ticke，可以用来换取二维码图片
		String ticket=map.get("Ticket");
//
//		StringBuffer str = new StringBuffer();
//		str.append("<xml>");
//		str.append("<ToUserName><![CDATA[" + toUserName + "]]></ToUserName>");
//		str.append("<FromUserName><![CDATA[" + fromUserName + "]]></FromUserName>");
//		str.append("<CreateTime>" + createTime+ "</CreateTime>");
//		str.append("<MsgType><![CDATA[" + msgType + "]]></MsgType>");
//		str.append("<Event><![CDATA[" + event + "]]></Event>");
//		str.append("<EventKey><![CDATA[" + eventKey +"]]></EventKey>");
//		str.append("<Ticket><![CDATA[" + ticket +"]]></Ticket>");
//		str.append("</xml>");
//		System.out.println(str.toString());
//		return str.toString();
		logger.info("ticket="+ticket);
		if(!ticket.equals("") || ticket!=null){
			//2017.12.08 叶夷 如果是刚关注，二维码参数是qrscene_general
			//	未关注时：event=subscribe   已关注时：event=SCAN
			if(event.equals("subscribe")){
			
				/**
				 * start:2017.12.07 叶夷 删除自定义菜单
				 */
				/*logger.info("开始删除自定义菜单");
				String menu_delete_url = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=ACCESS_TOKEN";
				String deleteAccessToken = weChatService.getToken(appid, appsecret);
				logger.info("accessToken=" + deleteAccessToken);
				String deleteUrl = menu_delete_url.replace("ACCESS_TOKEN", deleteAccessToken);
				JSONObject deleteJsonObject = HttpRequestUtil.httpRequest(deleteUrl, "GET", null);
				logger.info("删除菜单结果:" + deleteJsonObject);*/
				/**
				 * end:2017.12.07 叶夷 删除自定义菜单
				 */

				/**
				 * start:2017.12.07 叶夷 创建自定义菜单
				 */
				String accessToken=createMenu();
				/**
				 * end:2017.12.07 叶夷 创建自定义菜单
				 */

				logger.info("fromUserName=" + fromUserName + " templateid=" + templateid + " templateurl="
						+ templateurl + " templateContent=" + towCode_templateContent + " appid=" + appid
						+ " appsecret=" + appsecret);
				
				/**
				 * start: 2018.03.22  叶夷    发送客服消息
				 */
				String sendMessageUrl = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN";
				String sendMessageUrl1=sendMessageUrl.replace("ACCESS_TOKEN", accessToken);
				String content="在xunta中可按照你设置的任意“关注点”将与你最适合互动的人匹配在一起.从此你的关系触角可按照你自己设定的方向任意延伸, 所有人都被你“点兵点将”.";
				String sendMessageString =  "{\"touser\": \""+fromUserName+"\",\"msgtype\": \"text\", \"text\": {\"content\": \""+content+"\"}}";
				logger.info("sendMessageString=" + sendMessageString);
				JSONObject sendMessagejsonObject = HttpRequestUtil.httpRequest(sendMessageUrl1, "POST", sendMessageString);
				logger.info("创建菜单结果:" + sendMessagejsonObject);
				/**
				 * end: 2018.03.22  叶夷    发送客服消息
				 */

				logger.info("eventKey=" + eventKey);
				eventKey = eventKey.substring(eventKey.indexOf("_") + 1);
				logger.info("转换后的eventKey=" + eventKey);
				JSONObject eventKeyJson = new JSONObject(eventKey);
				logger.debug("eventKeyJson=" + eventKeyJson.toString()+" "+(eventKeyJson.has("userId")));
				if (!eventKeyJson.has("userId")) {
					String userId = eventKeyJson.getString("userId");
					logger.debug("eventKey->userId=" + userId);
					// 通过userid查找用户，然后存储openid
					User user = userDao.findUserByUserid(Long.valueOf(userId));
					if (user != null) {
						user.setOpenid(fromUserName);
						userDao.updateUser(user);
					}
				}
				logger.debug("eventKeyJson.isNull('eventScope')=" + eventKeyJson.isNull("eventScope"));
				if (!eventKeyJson.isNull("eventScope")) {
					String eventScope = eventKeyJson.getString("eventScope");
					logger.debug("eventKey->eventScope=" + eventScope);
					// 2017.12.07 叶夷 将openid和二维码参数存储
					openId2EventScopeService.setOpenId(fromUserName, eventScope);
				}
			}
		}
    } 
    
	//微信公众号创建自定义菜单
    private String createMenu(){
    	logger.info("开始创建自定义菜单");
		String menu_create_url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
		String accessToken = weChatService.getToken(appid, appsecret);
		logger.info("accessToken=" + accessToken);
		String url = menu_create_url.replace("ACCESS_TOKEN", accessToken);
		String menuString = "{\"button\":" + "[" + "{" + "\"type\":\"view\"," + "\"name\":\"请点我\","
				+ "\"key\":\"" + key + "\"," + "\"url\":\"" + templateurl + "\"" + "}" + "]" + "}";
		logger.info("menuString=" + menuString);
		JSONObject jsonObject = HttpRequestUtil.httpRequest(url, "POST", menuString);
		logger.info("创建菜单结果:" + jsonObject);
		
		//如果请求微信的接口AccessToken失效，则重新获得且存储
		if(!jsonObject.isNull("errmsg")){
			String errmsg = jsonObject.getString("errmsg");
			if (!"ok".equals(errmsg)) { // 如果为errmsg为ok，则代表发送成功，公众号推送信息给用户了。
				String errcode=jsonObject.get("errcode").toString();
				logger.debug("errcode="+errcode);
				if(errcode.equals("40001")){//如果模版消息token错误则重新获取token，重新发送
					String token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";
					String requestUrl = token_url.replace("APPID", appid).replace("APPSECRET", appsecret);
					// 发起GET请求获取凭证
					JSONObject jsonObject1 = HttpRequestUtil.httpRequest(requestUrl, "GET", null);
					Token tokenObject=weChatService.getTokenForMysql(appid);
					if (null != jsonObject1) {
						String newAccessToken = jsonObject.getString("access_token");
						accessToken=newAccessToken;
						int expires_in = jsonObject.getInt("expires_in");// 失效时间，以秒为单位
						Long newfailureTimeLong = System.currentTimeMillis() + expires_in * 1000;// 失效时间毫秒数
						Timestamp newfailureTime = new Timestamp(newfailureTimeLong);
						Timestamp newcreateTime = new Timestamp(System.currentTimeMillis());
						tokenObject.setAccessToken(newAccessToken);
						tokenObject.setCreateTime(newcreateTime);
						tokenObject.setFailureTime(newfailureTime);
						tokenDao.updateToken(tokenObject);// 存在但是失效则更新
						createMenu();
					}
				}
			}
		}
		return accessToken;
    }
}

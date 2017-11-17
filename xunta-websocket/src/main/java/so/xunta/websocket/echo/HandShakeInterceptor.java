package so.xunta.websocket.echo;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import so.xunta.beans.User;
import so.xunta.server.UserService;
import so.xunta.websocket.config.Constants;

public class HandShakeInterceptor extends HttpSessionHandshakeInterceptor {
	Logger logger = Logger.getRootLogger();
	
	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Map<String, Object> attributes) throws Exception {
		logger.info("Before Handshake");
		
		ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;

        HttpServletRequest req = servletRequest.getServletRequest();
        String userid  = req.getParameter("userid");
		String boot = req.getParameter("boot");
		
		if(userid!=null&&!"".equals(userid.trim()))
		{
			boolean ifuserExist = checkIfUserExistInDb(userid);
			if(!ifuserExist){
				logger.info("非法用户登录连接websocket");
				return false;
			}
			
			if(EchoWebSocketHandler.checkExist(userid)){
				logger.info(userid+"之前的连接还存在，清除");
				EchoWebSocketHandler.removeUser(userid);
			}
			attributes.put(Constants.WEBSOCKET_USERNAME,userid);
			attributes.put("boot", boot);
			return true;
		}else{
			logger.info("userid参数非法！");
			return false;
		}

		
		/*if (request instanceof ServletServerHttpRequest) {
	            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
	            HttpServletRequest req = servletRequest.getServletRequest();
	            HttpSession session  = req.getSession(false);
	            if (session != null) {
	                //使用userName区分WebSocketHandler，以便定向发送消息
	                String userName = (String) session.getAttribute(Constants.WEBSOCKET_USERNAME);
	                if(userName==null){
	                	System.out.println("用户名为空");
	                	return false;
	                }
	                if(EchoWebSocketHandler.checkExist(userName)){
	                	System.out.println(userName+"连接已经存在");
	                	EchoWebSocketHandler.removeUser(userName);
	                }
	                attributes.put(Constants.WEBSOCKET_USERNAME,userName);
	            }else{
	            	System.out.println("session为空");
	            	System.out.println();
	            	return false;
	            }
	     }
		return true;*/
	}

	private boolean checkIfUserExistInDb(String userid) {
		WebApplicationContext webContext = ContextLoader.getCurrentWebApplicationContext();
		UserService userService = webContext.getBean(UserService.class);
		//System.out.println("userService:"+userService);
		User user = userService.findUser(Long.valueOf(userid));
		if(user ==null){
			return false;
		}
		else{
			return true;
		}
		
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Exception ex) {
		//System.out.println("After Handshake");
		super.afterHandshake(request, response, wsHandler, ex);
	}
}

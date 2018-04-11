package so.xunta.websocket.echo;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import so.xunta.beans.User;
import so.xunta.server.CpShowingService;
import so.xunta.server.LoggerService;
import so.xunta.server.RecommendService;
import so.xunta.server.UserService;
import so.xunta.utils.IdWorker;
import so.xunta.websocket.config.Constants;
import so.xunta.websocket.config.WebSocketContext;
import so.xunta.websocket.task.RecommendUpdateTask;
import so.xunta.websocket.utils.RecommendTaskPool;

/**
 * Echo messages by implementing a Spring {@link WebSocketHandler} abstraction.
 */
public class EchoWebSocketHandler extends TextWebSocketHandler {

	@Autowired
	private WebSocketContext websocketContext;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private RecommendService recommendService;
	
	@Autowired
	private LoggerService loggerService;
	
	@Autowired
	private RecommendTaskPool recommendTaskPool;
	
	@Autowired
	private CpShowingService cpShowingService;

	IdWorker idWorker = new IdWorker(1L, 1L);

	private static final Logger logger;
	private Logger logger1 = Logger.getLogger(EchoWebSocketHandler.class);

	private static List<WebSocketSession> users;

	public static List<WebSocketSession> getUsers() {
		return users;
	}

	public static void setUsers(CopyOnWriteArrayList<WebSocketSession> users) {
		EchoWebSocketHandler.users = users;
	}

	private static boolean isRunning = false;

	static {
		users = new CopyOnWriteArrayList<WebSocketSession>();
		logger = Logger.getRootLogger();
	}

	public EchoWebSocketHandler() {
		super();
		/*if (!isRunning) {
			timer.schedule(new HeartBeatTask(), 1000, 4000);
			isRunning = true;
		}*/
		if(!isRunning){
			//timer.schedule(saveUnreadMsgTask,5000,2000);
			//isRunning = true;
			//System.out.println("saveUnreasMsgTask是否为空:"+saveUnreadMsgTask);
		}
	}

	/**
	 * 消息中央处理器
	 */
	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		String userid = session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString();
		String clientIP = session.getRemoteAddress().toString().substring(1);
		logger1.debug("客户端"+userid+"请求：" + message.getPayload());
	
	
		org.json.JSONObject obj = null;
		String _interface = null;
		String addition_type = null;
		try {
			obj = new org.json.JSONObject(message.getPayload());
			User user = userService.findUser(Long.valueOf(userid));
			_interface = obj.get("_interface").toString();
			if(obj.has("isPushCP")&&obj.getString("isPushCP").equals("true")){
				addition_type = "isPushCP";
			}
			loggerService.log(userid, user.getName(),clientIP,obj.toString(),_interface,addition_type,user.getUserGroup());
			logger1.info(user.getName()+"请求接口"+_interface);
		} catch (Exception e) {
			logger.error(e.getMessage(),e);
			session.sendMessage(new TextMessage("json数据格式错误"));
			return;
		}

	//	logger.info("_interface:" + _interface);
		websocketContext.executeMethod(_interface, session, message);
	}

	/**
	 * 建立连接
	 */
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		userOnline(session);
	}

	
	private void userOnline(WebSocketSession session) {
		Long userid  = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		String clientIP = session.getRemoteAddress().toString().substring(1);
		if (!checkExist(session)) {
			users.add(session);
			User u = userService.findUser(userid);
			
			/*if(session.getAttributes().get("boot").equals("yes"))
			{
				
				logger.info("用户:"+u.getUserId()+"  "+u.getName() +"  打开应用上线");
			}else{
				logger.info("用户"+u.getUserId()+"  "+u.getName()+"恢复连接");
				
				//re_sendMsg(userid,5); //zheng 先取消，以后的更新任务还会有类似的功能
			}*/
			logger.info("用户:"+u.getUserId()+"  "+u.getName() +"  上线");
			loggerService.log(userid.toString(), u.getName(),clientIP,"用户上线","登录",null,u.getUserGroup());
			recommendService.initRecommendParm(u);
			cpShowingService.initUserShowingCps(u.getUserId()+"");
			
			RecommendUpdateTask recommendUpdateTask = new RecommendUpdateTask(recommendService,userid+"");
			recommendTaskPool.execute(recommendUpdateTask);
			
		}
	}

	/**
	 * 连接正常关闭
	 */
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
			Long userid  = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
			String clientIP = session.getRemoteAddress().toString().substring(1);
			users.remove(session);	
			if(status.equals(CloseStatus.SERVICE_RESTARTED)){
				logger.info("用户:"+userid+" WebSocketSession服务重启");
				return;
			}
			User u = userService.findUser(userid);
			recommendService.syncLastUpdateTime(u);
			cpShowingService.clearUserShowingCps(userid+"");
			
			loggerService.log(userid.toString(), u.getName(), clientIP,"用户离线","登出",null,u.getUserGroup());
			logger.info("用户:"+u.getUserId()+"  "+u.getName() +"  离线:"+status.getReason()+";"+status.getCode());
	}

	/**
	 * 连接异常关闭
	 */
	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		Long userid  = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		User u = userService.findUser(userid);
		
		logger.info("用户:"+u.getUserId()+"  "+u.getName()+" 连接异常:"+exception.getMessage());
	}

	/**
	 * 给所有在线用户发送消息
	 *
	 * @param message
	 */
	public static void sendMessageToUsers(TextMessage message) {
		for (WebSocketSession user : users) {
			try {
				if (user.isOpen()) {
					user.sendMessage(message);
				}
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
			}
		}
	}

	/**
	 * 给所有用户发消息，但过滤掉指定的用户
	 * 
	 * @param message
	 * @param filterUserids
	 */
	public static void sendMessageToUsersExceptFilterUsers(TextMessage message, List<String> filterUserids) {

		for (WebSocketSession user : users) {
			try {
				if (user.isOpen()
						&& !filterUserids.contains(user.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString())) {
					user.sendMessage(message);
				} else {
					logger.debug("发消息过滤:" + user.getAttributes().get(Constants.WEBSOCKET_USERNAME));
				}
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
			}
		}
	}

	/**
	 * 给某个用户发送消息
	 *
	 * @param userName
	 * @param message
	 */
	public void sendMessageToUser(String userName, TextMessage message) {

		for (WebSocketSession user : users) {
			if (user.getAttributes().get(Constants.WEBSOCKET_USERNAME).equals(userName)) {
				try {
					if (user.isOpen()) {
						user.sendMessage(message);
					}
				} catch (IOException e) {
					logger.error(e.getMessage(), e);
				}
				break;
			}
		}
	}

	public static WebSocketSession getUserById(Long userid) {
		WebSocketSession _user=null;
		for (WebSocketSession user : users) {
			if (user.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString().equals(userid.toString())) {
				if (user.isOpen()) {
					_user = user;
				}
				break;
			}
		}
		return _user;
	}

	public static boolean checkExist(WebSocketSession session) {
		for (WebSocketSession user : users) {
			if (user.getAttributes().get(Constants.WEBSOCKET_USERNAME)
					.equals(session.getAttributes().get(Constants.WEBSOCKET_USERNAME))) {
				return true;
			}
		}
		return false;
	}

	public static void removeUser(String userid) {
		for (int i = 0; i < users.size(); i++) {
			WebSocketSession u = users.get(i);
			String _userid = (String) (u.getAttributes().get(Constants.WEBSOCKET_USERNAME));
			if (_userid.equals(userid)) {
				//logger.info("用户重复连接websocket,移除原来的session" + u.getAttributes().get(Constants.WEBSOCKET_USERNAME));
				users.remove(u);
				
				if (u.isOpen()) {
					try {
						u.close();
					} catch (Exception e) {
						logger.error(e.getMessage()+"用户连接已关闭，无法重复close");
					}
				}
			}
		}
	}

	public static boolean checkExist(String userId) {
		for (WebSocketSession user : users) {
			if (user.getAttributes().get(Constants.WEBSOCKET_USERNAME).equals(userId)) {
				return true;
			}
		}
		return false;
	}

	@PostConstruct
	public void init() {
		logger.info("websocketcontext init .....");
		recommendTaskPool.setRejectedHandler();
		try {
			if (websocketContext.getwebsocketContext().size() == 0) {
				websocketContext.scanPackage("so.xunta.websocket");
			}
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage(), e);
		}
		//recommendService.init();
	}
}

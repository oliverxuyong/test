package so.xunta.websocket.config;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.PreDestroy;

import org.apache.log4j.Logger;
import org.hibernate.SessionFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.mysql.jdbc.AbandonedConnectionCleanupThread;

import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.utils.FilePathUtil2;
import so.xunta.websocket.utils.RecommendTaskPool;

@Component
public class WebSocketContext {
	@Autowired
	private RecommendTaskPool recommendTaskPool;
	@Autowired
	SessionFactory sessionFactory;
	private static final Logger logger;

	static {
		logger = Logger.getRootLogger();
	}
	private static Set<Class<?>> websocketContext;

	static {
		websocketContext = new HashSet<Class<?>>();
	}

	public Set<Class<?>> getwebsocketContext() {
		return websocketContext;
	}

	public void scanPackage(String packagename) throws UnsupportedEncodingException {
		List<String> classNames = FilePathUtil2.getClassName(packagename, true);
		if (classNames != null) {
			for (String className : classNames) {
				try {
					Class<?> clazz = Thread.currentThread().getContextClassLoader().loadClass(className);
					WebSocketTypeAnnotation[] anos = clazz.getAnnotationsByType(WebSocketTypeAnnotation.class);
					if (anos.length == 1) {
						getwebsocketContext().add(clazz);
					} else {
					}
				} catch (ClassNotFoundException e) {
					logger.error(e.getMessage(), e);
				}
			}
		}
	}

	/**
	 * 执行某个方法
	 * 
	 * @param method
	 */
	public void executeMethod(String method, WebSocketSession session, TextMessage message) {
		boolean methodFind = false;
		Set<Class<?>> clazz = getwebsocketContext();
		for (Class<?> c : clazz) {
			Method[] methods = c.getDeclaredMethods();
			for (Method m : methods) {
				boolean flag = m.isAccessible();
				m.setAccessible(true);
				if (m.isAnnotationPresent(WebSocketMethodAnnotation.class)) {
					WebSocketMethodAnnotation[] wt = m.getAnnotationsByType(WebSocketMethodAnnotation.class);
					for (int i = 0; i < wt.length; i++) {
						String methodname = wt[i].ws_interface_mapping();
						if (methodname.equals(method)) {
							try {
								methodFind = true;
								WebApplicationContext webContext = ContextLoader.getCurrentWebApplicationContext();
								m.invoke(webContext.getBean(c), session, message);
								break;
							} catch (IllegalArgumentException e) {
								logger.error(e.getMessage(),e);
							} catch (BeansException e) {
								logger.error(e.getMessage(),e);
							} catch (IllegalAccessException e) {
								logger.error(e.getMessage(),e);
							} catch (InvocationTargetException e) {
								logger.error(e.getMessage(),e);
							}
						}
					}
					if (methodFind) {
						break;
					}
				}
				m.setAccessible(flag);
			}
		}

		if (!methodFind) {
			logger.warn(method + "该方法找不到");
		}
	}

	@PreDestroy
	public void destroy() {
		logger.debug("destroy....");
		recommendTaskPool.destroy();
		sessionFactory.close();
		try {
			AbandonedConnectionCleanupThread.shutdown();
		} catch (InterruptedException e) {
			logger.error(e.getMessage(), e);
		}

		Enumeration<Driver> drivers = DriverManager.getDrivers();
		while (drivers.hasMoreElements()) {
			try {
				Driver driver = drivers.nextElement();
				DriverManager.deregisterDriver(driver);
			} catch (SQLException e) {
				logger.error(e.getMessage(),e);
			}
		}
	}

}

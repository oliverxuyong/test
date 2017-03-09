package so.xunta.websocket.config;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.log4j.Logger;
import org.springframework.beans.BeansException;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.utils.FilePathUtil2;

@Component
public class WebSocketContext {
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
					// TODO Auto-generated catch block
					e.printStackTrace();
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
								e.printStackTrace();
							} catch (BeansException e) {
								e.printStackTrace();
							} catch (IllegalAccessException e) {
								e.printStackTrace();
							} catch (InvocationTargetException e) {
								e.printStackTrace();
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
			logger.info(method + "该方法找不到");
		}
	}

	@PostConstruct
	public void init() {
		System.out.println("websocketcontext init .....");
	}

	@PreDestroy
	public void destroy() {
		System.out.println("destroy ....");
	}

}

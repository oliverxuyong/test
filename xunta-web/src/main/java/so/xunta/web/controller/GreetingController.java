package so.xunta.web.controller;

import java.io.IOException;
import java.util.Date;


import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.socket.TextMessage;

import so.xunta.websocket.echo.EchoWebSocketHandler;

@Controller
public class GreetingController {

	@RequestMapping(value = "/greetings")
	public void greet(String greeting) {
		String text = "[" + getTimestamp() + "]:" + greeting;
		System.out.println(text);
		EchoWebSocketHandler.sendMessageToUsers(new TextMessage("你好！我是管理员"));
	}

	private Long getTimestamp() {
		return new Date().getTime();
	}

	@RequestMapping("/getClasspath")
	public void getClassPath(HttpServletResponse res) throws IOException {

		
		try {
			res.getWriter().write("ok");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@RequestMapping("/getclazz")
	public void getClazz(HttpServletResponse res) throws IOException, InstantiationException {

		
		try {
			res.getWriter().write("ok");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
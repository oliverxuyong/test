package so.xunta.web.controller.test;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import so.xunta.beans.User;
import so.xunta.server.UserService;
import so.xunta.utils.IdWorker;

@Controller
public class UserCURDTest {
	@Autowired
	private UserService userService;
	IdWorker idWorder = new IdWorker(1L, 1L);
	
	@RequestMapping("/addusertest")
	public void addusertest(HttpServletRequest request,HttpServletResponse response){
		User user1 = new User(2L, "a", "lily", "http://image.user", "QQ","徽州新移民");
		User user2 = new User(3L, "b", "易发宝", "http://image.user", "QQ","徽州新移民");
		User user3 = new User(4L, "c", "寻Ta", "http://image.user", "QQ","徽州新移民");
		User user4 = new User(5L, "d", "语擎", "http://image.user", "QQ","徽州新移民");
		User user5 = new User(6L, "e", "大力水手", "http://image.user", "QQ","徽州新移民");
		User user6 = new User(7L, "f", "户外旅行专家", "http://image.user", "QQ","徽州新移民");
		User user7 = new User(8L, "g", "水上漂", "http://image.user", "QQ","徽州新移民");

		 userService.addUser(user1);
		 userService.addUser(user2);
		 userService.addUser(user3);
		 userService.addUser(user4);
		 userService.addUser(user5);
		 userService.addUser(user6);
		 userService.addUser(user7);
		 
		res(response,"ok");
	}

	private void res(HttpServletResponse response,String content) {
		try {
			response.getWriter().write(content);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

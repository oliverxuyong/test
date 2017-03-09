package so.xunta.web.controller;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import so.xunta.beans.User;
import so.xunta.server.UserService;
import so.xunta.utils.IdWorker;

@Controller
@Transactional
public class InitController {

	@Autowired
	private UserService userService;


	IdWorker idworker = new IdWorker(1L, 1L);


	@PostConstruct
	public void initSystemUser(){
		//系统管理员Id 为 1L
		User systemUser = new User();
	//	systemUser.setImgUrl("http://mxunta.so/xunta-web/assets/images/xun.jpg");
		systemUser.setImgUrl("");
		systemUser.setName("寻Ta管理员");
		systemUser.setThird_party_id("1");
		systemUser.setType("sys");
		systemUser.setUserId(1L);
		systemUser.setUserGroup("系统管理员");
		if(userService.findUser(1L)==null){
			System.out.println("初始化系统管理员");
			userService.addUser(systemUser);
		}
	}
	
	public boolean checkIfThirdPartyId(String str){
		String regx = "##(.+)##";
		Pattern pattern = Pattern.compile(regx);
		Matcher matcher = pattern.matcher(str);
		if(matcher.find())
		{
			return true;
		}
		return false;
		
	}
	
}

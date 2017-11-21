package so.xunta.web.controller;

import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import so.xunta.utils.DateTimeUtils;
import so.xunta.utils.IdWorker;

@Controller
public class PublicController {

	
	Logger logger = Logger.getLogger(PublicController.class);
	
	IdWorker idWorker = new IdWorker(1L, 1L);


	@RequestMapping("/nextid")
	public void nextId(HttpServletRequest request, HttpServletResponse response) {
		Long nextId = idWorker.nextId();
		String str = String.format("获取id请求:%s",nextId.toString());
		logger.debug(str);
		JSONObject ret = new JSONObject();
		ret.put("id",nextId.toString());
		
		response.setContentType("text/json");
		response.setCharacterEncoding("utf-8");
		try {
			response.getWriter().write(ret.toString(2));
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}
	@RequestMapping("/server_time")
	public void server_time(HttpServletRequest request, HttpServletResponse response) {
		Date date = new Date();
		Long time_long = date.getTime();
		String time_str = DateTimeUtils.getTimeStrFromDate(date);
		JSONObject ret = new JSONObject();
		ret.put("time_long",time_long);
		ret.put("time_str",time_str);
		
		
		String str = String.format("获取时间请求:%s",ret.toString(2));
		logger.debug(str);
		
		response.setContentType("text/json");
		response.setCharacterEncoding("utf-8");
		try {
			response.getWriter().write(ret.toString(2));
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}
	@RequestMapping("/nextid_and_stime")
	public void nextid_and_stime(HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject ret = new JSONObject();
		
		Long nextId = idWorker.nextId();
		
		Date date = new Date();
		Long time_long = date.getTime();
		String time_str = DateTimeUtils.getTimeStrFromDate(date);
		
		ret.put("id",nextId.toString());
		ret.put("time_long",time_long);
		ret.put("time_str",time_str);
		
		
		String str = String.format("获取id请求:%s",ret.toString(2));
		logger.debug(str);
		
		response.setContentType("text/json");
		response.setCharacterEncoding("utf-8");
		try {
			response.getWriter().write(ret.toString(2));
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}


}

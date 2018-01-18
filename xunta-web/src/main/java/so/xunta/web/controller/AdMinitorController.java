package so.xunta.web.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AdMinitorController {
	
	static Logger logger = Logger.getRootLogger();

	/**
	 * 这是今日头条的第三方监控接口
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/thirdPartyMonitoring")
	public void thirdPartyMonitoring(HttpServletRequest request,HttpServletResponse response) throws IOException{
		logger.info("今日头条广告第三方监控:"+request.getQueryString());
	}
}

package so.xunta.web.controller;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

/**
 * Servlet Filter implementation class CrossOriginFilter
 */
@WebFilter(filterName="CrossOriginFilterConfig",urlPatterns={"/*"},initParams={
		@WebInitParam(name="code",value="utf-8")
})
public class CrossOriginFilter implements Filter {

	private FilterConfig fconfig;
	Logger logger =Logger.getLogger(CrossOriginFilter.class);
    /**
     * Default constructor. 
     */
    public CrossOriginFilter() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		String code = fconfig.getInitParameter("code");
		response.setCharacterEncoding(code);
		HttpServletResponse res = (HttpServletResponse)response;
		HttpServletRequest req = (HttpServletRequest)request;
		StringBuffer url = req.getRequestURL();
		String sourceChannel = req.getParameter("from");
		logger.debug("请求:"+req.getRequestURL());
		String urlstr = url.toString();
		if(urlstr.equals("http://www.xunta.so/xunta-web/")){
			if(sourceChannel==null){
				logger.info("有一般用户请求xunta网址");
			}else if(sourceChannel.equals("baidu")){
				logger.info("有baidu用户从网页版请求xunta网址");
			}else if(sourceChannel.equals("weibo")){
				logger.info("有weibo用户从网页版请求xunta网址");
			}
		}
		if(urlstr.indexOf("www")==-1)
		{
			String requestURI = req.getRequestURI();
			if(requestURI.equals("/xunta-web/")||requestURI.equals("/")){
				String replace = (req.getRequestURL().toString()).replaceAll("http://","http://www.");
				res.sendRedirect(replace);
				return;
			}else{
				chain.doFilter(request, res);
			}
			
			
		}else{
			//logger.debug("域名："+tempContextUrl);
			//res.addHeader("Access-Control-Allow-Origin", tempContextUrl);
			chain.doFilter(request, res);
		}
	
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		this.fconfig = fConfig;
	}

}

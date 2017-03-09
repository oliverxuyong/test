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

/**
 * Servlet Filter implementation class CrossOriginFilter
 */
@WebFilter(filterName="clientcode",urlPatterns={"/*"},initParams={
		@WebInitParam(name="code",value="utf-8")
})
public class StaticResourcesFilter implements Filter {

	private FilterConfig fconfig;
    /**
     * Default constructor. 
     */
    public StaticResourcesFilter() {
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
		String url = req.getRequestURL().toString();  
		System.out.println("请求:"+req.getRequestURL());
		if(url.indexOf("client_code")!=-1){
			System.out.println(url+"中包含client_code");
			chain.doFilter(req, res);
		}else{
			System.out.println(url+"中不包含client_code");
			String[] suffixes = {"html","htm","gif","jpg","jpeg","bmp","png","ico","txt","js","css","xml"};
			boolean flag = false;
			for(int i=0,size=suffixes.length;i<size;i++)
			{
				if(url.endsWith("."+suffixes[i])){
					flag = true;
					break;
				}
			}
			if(flag){		
				url = url.replace("xunta-web","xunta-web/client_code");
				res.sendRedirect(url);
			}else{
				chain.doFilter(req, res);
			}
		}
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		this.fconfig = fConfig;
	}

}

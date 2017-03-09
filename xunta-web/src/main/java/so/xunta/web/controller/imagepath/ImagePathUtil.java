package so.xunta.web.controller.imagepath;

import javax.servlet.http.HttpServletRequest;

public class ImagePathUtil {
	public static String getPath(HttpServletRequest request,String filepath) 
	{
		String path = request.getContextPath();
		String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
		return basePath+filepath;
	}
}

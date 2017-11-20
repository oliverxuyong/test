package so.xunta.web.controller;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ImageController {
	Logger logger = Logger.getLogger(ImageController.class);
	///useravatar/"+newname
	@RequestMapping(value="/useravatar/{imagename}/{suffix}/image")
	public void getimage(@PathVariable String imagename,@PathVariable String suffix,HttpServletRequest request,HttpServletResponse response)
	{
		logger.debug("获取图片");
		String catalina_home= System.getProperty("catalina.home");
		String upload_image_save_location = catalina_home+"/uploadimages/";
		
		if(imagename != null &&!"".equals(imagename.trim())){
			String imageUrl = upload_image_save_location+imagename+"."+suffix;//图片路径
			logger.debug(imageUrl);
			FileInputStream is;
			try {
				is = new FileInputStream(imageUrl);
				int i = is.available(); // 得到文件大小
				byte data[] = new byte[i];
				is.read(data); // 读数据
				is.close();
				response.setContentType("image/*"); // 设置返回的文件类型
				OutputStream toClient = response.getOutputStream(); // 得到向客户端输出二进制数据的对象
				toClient.write(data); // 输出数据
				toClient.close();
			} catch (FileNotFoundException e) {
				logger.error(e.getMessage(), e);
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
			}
		}	
	}
}

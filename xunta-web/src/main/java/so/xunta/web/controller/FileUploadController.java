package so.xunta.web.controller;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import so.xunta.beans.User;
import so.xunta.server.UserService;
import so.xunta.utils.ImageUtil;
import so.xunta.web.controller.imagepath.ImagePathUtil;

@Controller
public class FileUploadController {
	
	@Autowired
	private UserService userService;

	@RequestMapping("uploadpage")
	public String uploadpage()
	{
		return "/upload";
	} 
	@RequestMapping("upload")
	public void upload(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		request.setCharacterEncoding("UTF-8");
		DiskFileItemFactory factory = new DiskFileItemFactory();
		ServletFileUpload upload = new ServletFileUpload(factory);
		upload.setHeaderEncoding("UTF-8");// 处理图片名中文
		upload.setFileSizeMax(1024 * 1024 * 5);// 设置每个图片最大为5M
		upload.setSizeMax(1024 * 1024 * 5);// 一共最多能上传10M
		String osname = System.getProperty("os.name"); //javaEE版
		String catalina_home= System.getProperty("catalina.home");
		String upload_image_save_location = catalina_home+"/uploadimages";
		System.out.println("系统名称:"+osname+"  catalina.home:"+catalina_home);
		String userid = "";
		String imageUrl = "";
		User findUser =null;
		try {
			List<FileItem> items = upload.parseRequest(request);
			Iterator<FileItem> itr = items.iterator();
			while (itr.hasNext()) {
				FileItem item = (FileItem) itr.next();
				if (item.isFormField()) {
					System.out.println("表单参数名:" + item.getFieldName() + "，表单参数值:" + item.getString("UTF-8"));
					userid = item.getString();
					if("".equals(userid.trim())){
						show(response,1,"上传图片失败,userid is NULL",imageUrl);
						return;
					}else{
						 findUser = userService.findUser(Long.valueOf(userid));
						if(findUser == null)
						{
							show(response,1,"上传图片失败,数据库中不存在该用户id:"+userid,imageUrl);
							return;
						}
					}
				} else {
					if (item.getName() != null && !item.getName().equals("")) {
						System.out.println("上传图片的大小:" + item.getSize());

						System.out.println("上传图片的类型:" + item.getContentType());
						if(!item.getContentType().contains("image"))
						{
							//  非图片
							show(response,1,"上传图片失败,上传的文件非图片格式"+userid,imageUrl);
							return;

						}
						// item.getName()返回上传图片在客户端的完整路径名称
						System.out.println("上传图片的名称:" + item.getName());
						String filename = item.getName();
						//获取图片名后缀
						String suffix = filename.substring(filename.indexOf(".")+1);
						String imagepreffixname = "img_"+userid;
						String newname= imagepreffixname+"."+suffix;
						System.out.println("newname:"+newname);
						File tempFile = new File(newname);
						System.out.println("tempFile.getname():"+tempFile.getName());
						// 上传图片的保存路径
						File dir = new File(upload_image_save_location);
						if(!dir.exists())
						{
							dir.mkdirs();
						}
						
						File file = new File(upload_image_save_location, tempFile.getName());
						ImageUtil imageUtil = new ImageUtil();
						item.write(file);
						imageUtil.thumbnailImage(file,150,100, "thumb_", false);
						imageUrl = "/useravatar/"+"thumb_"+imagepreffixname+"/"+suffix+"/image";
						System.out.println("imageUrl:"+imageUrl);
						findUser.setImgUrl(ImagePathUtil.getPath(request,imageUrl));
						userService.updateUser(findUser);
						show(response, 0, "上传图片成功", ImagePathUtil.getPath(request,imageUrl));
					} else {
						request.setAttribute("upload.message", "没有选择上传图片！");
						show(response,1,"上传图片失败,没有选择上传图片",imageUrl);
					}
				}
			}
		} catch (FileUploadException e) {
			show(response,1,"上传图片失败"+e.getMessage(),imageUrl);
		} catch (Exception e) {
			show(response,1,"上传图片失败"+e.getMessage(),imageUrl);
		}
	}
	
	
	public void show(HttpServletResponse res,int code,String msg,String imageurl) throws IOException
	{
		org.json.JSONObject json = new org.json.JSONObject();
		json.put("code", code);
		json.put("msg", msg);
		json.put("image_url",imageurl);
		res.setContentType("text/json;charset=utf-8");
		System.out.println(json.toString());
		res.getWriter().write(json.toString());
	}
}

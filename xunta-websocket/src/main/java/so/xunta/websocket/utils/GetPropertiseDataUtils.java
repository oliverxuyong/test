package so.xunta.websocket.utils;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

import org.apache.log4j.Logger;

public class GetPropertiseDataUtils {
	private Logger logger = Logger.getRootLogger();
	/**
	 * 获得配置文件中参数的值
	 * @param propertiseFileName 配置文件名
	 * @param propertiseValue  参数名
	 * @return
	 */
	public String getPropertiseData(String propertiseFileName,String propertiseValue) {
		String data=null;
		Properties prop = new Properties();
		try {
			// 读取属性文件a.properties
			InputStream in = new BufferedInputStream(new FileInputStream(propertiseFileName));
			prop.load(in); // /加载属性列表
			data=prop.getProperty(propertiseValue);
			logger.debug("获得配置文件中的值 key="+propertiseValue+"  value="+data);
			in.close();
		} catch (Exception e) {
			logger.error(e);
		}
		return data;
	}
}

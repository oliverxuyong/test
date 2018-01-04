package so.xunta.server.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import so.xunta.beans.WeChatProperties;
import so.xunta.persist.WeChatPropertiesDao;
import so.xunta.server.WeChatPropertiesService;

@Service
public class WeChatPropertiesServiceImpl implements WeChatPropertiesService{
	Logger logger =Logger.getLogger(WeChatPropertiesServiceImpl.class);
	
	@Autowired
	private WeChatPropertiesDao weChatPropertiesDao;
	
	@Override
	public WeChatProperties getDataFromUserGroup(String usergroup) {
		//WeChatProperties a = weChatPropertiesDao.getDataFromUserGroup(usergroup);
		//logger.debug("测试2："+a.getAppid());
		return weChatPropertiesDao.getDataFromUserGroup(usergroup);
	}
}

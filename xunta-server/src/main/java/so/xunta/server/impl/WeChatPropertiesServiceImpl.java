package so.xunta.server.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.beans.WeChatProperties;
import so.xunta.persist.WeChatPropertiesDao;
import so.xunta.server.WeChatPropertiesService;

@Service
@Transactional
public class WeChatPropertiesServiceImpl implements WeChatPropertiesService{
	@Autowired
	private WeChatPropertiesDao weChatPropertiesDao;
	
	@Override
	public WeChatProperties getDataFromUserGroup(String usergroup) {
		return weChatPropertiesDao.getDataFromUserGroup(usergroup);
	}
}

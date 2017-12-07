package so.xunta.server.impl;

import org.springframework.beans.factory.annotation.Autowired;
import so.xunta.persist.OpenId2EventScopeDao;
import so.xunta.server.OpenId2EventScopeService;

public class OpenId2EventScopeServiceImpl implements OpenId2EventScopeService {
	@Autowired
	private OpenId2EventScopeDao openId2EventScopeDao;
	@Override
	public String getEventScope(String openId) {
		return openId2EventScopeDao.getEventScope(openId);
	}

	@Override
	public void setOpenId(String openId, String eventScope) {
		openId2EventScopeDao.setOpenId(openId, eventScope);
	}

}

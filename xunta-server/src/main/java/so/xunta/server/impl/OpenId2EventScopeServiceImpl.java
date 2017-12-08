package so.xunta.server.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.xunta.persist.OpenId2EventScopeDao;
import so.xunta.server.OpenId2EventScopeService;

@Service
public class OpenId2EventScopeServiceImpl implements OpenId2EventScopeService {
	@Autowired
	private OpenId2EventScopeDao openId2EventScopeDao;
	@Override
	public String getEventScope(String openId) {
		return openId2EventScopeDao.getEventScope(openId);
	}

	@Override
	public void setOpenId(String openId, String eventScope) {
		System.out.println("存储的eventScope="+eventScope);
		openId2EventScopeDao.setOpenId(openId, eventScope);
	}

}

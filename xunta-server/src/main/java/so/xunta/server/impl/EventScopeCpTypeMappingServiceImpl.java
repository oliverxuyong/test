package so.xunta.server.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.persist.EventScopeCpTypeMappingDao;
import so.xunta.server.EventScopeCpTypeMappingService;

@Transactional
@Service
public class EventScopeCpTypeMappingServiceImpl implements EventScopeCpTypeMappingService {

	@Autowired
	private EventScopeCpTypeMappingDao eventScopeCpTypeMappingDao;

	@Override
	public void setEventScopeCpTypeMapping(String eventScope, String cpType) {
		eventScopeCpTypeMappingDao.setEventScopeCpTypeMapping(eventScope, cpType);		
	}

	@Override
	public List<String> getEventScope(String cpType) {
		return eventScopeCpTypeMappingDao.getEventScope(cpType);
	}

	@Override
	public List<String> getCpType(String eventScope) {
		return eventScopeCpTypeMappingDao.getCpType(eventScope);
	}

}

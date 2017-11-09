package so.xunta.server.impl;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.xunta.beans.UserVisitLogger;
import so.xunta.persist.LoggerDao;
import so.xunta.server.LoggerService;
@Service
@Transactional
public class LoggerServiceImpl implements LoggerService {

	@Autowired
	private LoggerDao loggerDao;
	@Override
	public void log(String userId,String username,String clientIP,String info,String requestType, String addition_type, String whereUserFrom) {
		UserVisitLogger logger = new UserVisitLogger(userId, username, clientIP, info, requestType, addition_type, whereUserFrom);
		loggerDao.logInfo(logger);
	}

}

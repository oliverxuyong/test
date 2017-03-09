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
	public void log(String userId,String username,String info) {
		UserVisitLogger logger = new UserVisitLogger(userId, username, info);
		loggerDao.logInfo(logger);
	}

}

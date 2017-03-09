package so.xunta.persist.impl;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.UserVisitLogger;
import so.xunta.persist.LoggerDao;
@Repository
@Transactional
public class LoggerDaoImpl implements LoggerDao {
	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	public void logInfo(UserVisitLogger logger) {
		Session session = sessionFactory.getCurrentSession();
		session.save(logger);
	}
}

package so.xunta.persist.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.beans.CpChoiceDO;
import so.xunta.persist.CpChoiceDao;

@Repository
@Transactional
public class CpChoiceDaoImpl implements CpChoiceDao {
	@Autowired
	SessionFactory sessionFactory;
	
	@Override
	public CpChoiceDO saveCpChoice(CpChoiceDO cpChoice) {
		Session session = sessionFactory.getCurrentSession();
		BigInteger cpcdId = (BigInteger)session.save(cpChoice);
		cpChoice.setId(cpcdId);
		return cpChoice;

	}

	@Override
	public void updateCpChoice(CpChoiceDO cpChoice) {
		Session session = sessionFactory.getCurrentSession();
		session.update(cpChoice);
	}
}

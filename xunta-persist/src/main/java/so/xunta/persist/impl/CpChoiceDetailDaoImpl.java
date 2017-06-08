package so.xunta.persist.impl;

import java.math.BigInteger;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

import so.xunta.beans.CpChoiceDetailDO;
import so.xunta.persist.CpChoiceDetailDao;

public class CpChoiceDetailDaoImpl implements CpChoiceDetailDao {

	@Autowired
	SessionFactory sessionFactory;
	
	
	@Override
	public CpChoiceDetailDO saveCpChoiceDetail(CpChoiceDetailDO cpChoiceDetail) {
		Session session = sessionFactory.getCurrentSession();
		BigInteger cpcdId = (BigInteger)session.save(cpChoiceDetail);
		cpChoiceDetail.setId(cpcdId);
		return cpChoiceDetail;
	}

}

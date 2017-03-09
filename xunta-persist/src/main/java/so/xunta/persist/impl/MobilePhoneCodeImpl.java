package so.xunta.persist.impl;

import java.util.Calendar;

import javax.transaction.Transactional;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.validate.MobilePhoneValidateCode;
import so.xunta.persist.MobilePhoneCodeDao;

@Repository
@Transactional
public class MobilePhoneCodeImpl implements MobilePhoneCodeDao {

	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	public void addMobilePhoneCode(MobilePhoneValidateCode mpvcode) {
		Session session = sessionFactory.getCurrentSession();
		session.save(mpvcode);
	}

	/**
	 * ip 在当天总的短信发送量
	 */
	@Override
	public Long findShortmsgNumByIP(String ip) {
		Session session = sessionFactory.getCurrentSession();
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND,0);
		Long timestamp = calendar.getTime().getTime();
		String hql = "select count(*) from MobilePhoneValidateCode as m where m.ip =:ip and m.datetime_long > :timestamp";
		Query query = session.createQuery(hql).setParameter("ip", ip).setParameter("timestamp", timestamp);
		return (Long) query.uniqueResult();
	}

	@Override
	public Long findShortmsgNumByPhonenumber(String phonenumber) {
		Session session = sessionFactory.getCurrentSession();
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND,0);
		Long timestamp = calendar.getTime().getTime();
		String hql = "select count(*) from MobilePhoneValidateCode as m where m.mobile_phone_number =:phonenumber  and m.datetime_long >:timestamp";
		Query query = session.createQuery(hql).setParameter("phonenumber", phonenumber).setParameter("timestamp", timestamp);
		return (Long)query.uniqueResult();
	}

	@Override
	public Long findTheLatestTimestampByPhonenumber(String phonenumber) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "select m.datetime_long from MobilePhoneValidateCode as m where m.mobile_phone_number = :phonenumber order by m.datetime_long desc";
		Query query = session.createQuery(hql).setParameter("phonenumber", phonenumber).setMaxResults(1);
		return (Long)query.uniqueResult();
	}

}

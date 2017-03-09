package so.xunta.persist.impl;

import javax.transaction.Transactional;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.Dic;
import so.xunta.persist.DicDao;

@Repository
@Transactional
public class DicDaoImpl implements DicDao {

	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	public String getValue(String key) {
		String hql = "from Dic as d where d._key = :key";
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(hql).setParameter("key",key);
		Object uniqueResult = query.uniqueResult();
		if(uniqueResult==null)
		{
			return null;
		}else{
			Dic dic = (Dic)uniqueResult;
			return dic.getValue();
		}
	}

	@Override
	public void updateValue(String key, String newValue) {
		String hql = "from Dic as d where d._key = :key";
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(hql).setParameter("key",key);
		Object uniqueResult = query.uniqueResult();
		if(uniqueResult!=null){
			Dic dic = (Dic)uniqueResult;
			dic.setValue(newValue);
			session.update(dic);
		}
	}

	@Override
	public void addValue(String key, String value) {
		Session session = sessionFactory.getCurrentSession();
		Dic dic = new Dic();
		dic.set_key(key);
		dic.setValue(value);
		session.save(dic);
	}

}

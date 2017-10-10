package so.xunta.persist.impl;

import java.math.BigInteger;
import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.ConcernPointDO;
import so.xunta.persist.ConcernPointDao;

@Transactional
@Repository
public class ConcernPointDaoImpl implements ConcernPointDao {

	@Autowired
	SessionFactory sessionFactory;
	
	@Override
	public ConcernPointDO saveConcernPoint(ConcernPointDO cp) {
		Session session = sessionFactory.getCurrentSession();
		BigInteger cpid = (BigInteger)session.save(cp);
		cp.setId(cpid);
		return cp;
	}

	@Override
	public ConcernPointDO getConcernPoint(BigInteger id) {
		Session session = sessionFactory.getCurrentSession();
		String sql = "select cp.* from concern_point as cp where cp.id = :id ";
		Query query = session.createSQLQuery(sql).addEntity(ConcernPointDO.class).setBigInteger("id", id);
		return (ConcernPointDO)query.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ConcernPointDO> listConcernPointsByCreator(Long uid,int startPoint,int howMany) {
		Session session = sessionFactory.getCurrentSession();
		String sql = "select cp.* from concern_point as cp where cp.creator_uid = :uid order by cp.modified_time ";
		Query query = session.createSQLQuery(sql).addEntity(ConcernPointDO.class).setLong("uid", uid).setFirstResult(startPoint).setMaxResults(howMany);
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ConcernPointDO> listConcernPointsByCreator() {
		Session session = sessionFactory.getCurrentSession();
		String sql = "select cp.* from concern_point as cp order by cp.weight ";
		Query query = session.createSQLQuery(sql).addEntity(ConcernPointDO.class);
		return query.list();
	}
	
	@Override
	public ConcernPointDO updateConcernPoint(ConcernPointDO cp) {
		Session session = sessionFactory.getCurrentSession();
		session.update(cp);
		return cp;
	}

}

package so.xunta.persist.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.ArrayList;
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

	/**
	 * 2017.08.11 叶夷  通过uid和cpid查找cp是否存在
	 */
	@Override
	public CpChoiceDO getCpChoice(Long userid, BigInteger cpId) {
		Session session = sessionFactory.getCurrentSession();
		String sql="SELECT cp.* FROM cp_choice cp WHERE user_id=:userId AND cp_id =:cpId";
		Object obj = session.createSQLQuery(sql).addEntity(CpChoiceDO.class).setLong("userId", userid).setBigInteger("cpId", cpId).uniqueResult();
		if(obj != null){
			return (CpChoiceDO)obj;
		}else{
			return null;
		}
	}
	
	@Override
	public List<CpChoiceDO> getSelectedCpsBeforeTime(Long userid, Timestamp lastUpdateTime) {
		Session session = sessionFactory.getCurrentSession();
		String sql="SELECT cpc.* FROM cp_choice as cpc WHERE cpc.user_id=:userid AND cpc.create_time<:lastUpdateTime ";
		@SuppressWarnings("unchecked")
		List<CpChoiceDO> result = (List<CpChoiceDO>)session.createSQLQuery(sql).addEntity(CpChoiceDO.class).setLong("userid", userid).setTimestamp("lastUpdateTime", lastUpdateTime).list();
		if(result==null){
			result = new ArrayList<CpChoiceDO>();
		}
		return result;
	}

	@Override
	public List<CpChoiceDO> getSelectedCps(Long userid, String property) {
		Session session = sessionFactory.getCurrentSession();
		String sql="SELECT cpc.* FROM cp_choice as cpc WHERE cpc.user_id=:userid AND cpc.property=:property ORDER BY cpc.create_time ";
		@SuppressWarnings("unchecked")
		List<CpChoiceDO> result = (List<CpChoiceDO>)session.createSQLQuery(sql).addEntity(CpChoiceDO.class).setLong("userid", userid).setString("property", property).list();
		return result;
	}
}

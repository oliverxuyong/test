package so.xunta.persist.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.beans.CpChoiceDetailDO;
import so.xunta.persist.CpChoiceDetailDao;

@Repository
@Transactional
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

	@Override
	public Map<BigInteger, String> getSelectedCpAfterTime(Long userid, Timestamp lastUpdateTime) {
		Session session = sessionFactory.getCurrentSession();
		String sql="SELECT cp_id,is_selected FROM cp_choice_detail WHERE user_id=:userid AND create_time>=:lastUpdateTime GROUP BY cp_id HAVING MAX(create_time) ";
		@SuppressWarnings("unchecked")
		List<Map<String,Object>> result = (List<Map<String,Object>>)session.createSQLQuery(sql).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).setLong("userid", userid).setDate("lastUpdateTime", lastUpdateTime).list();
		
		Map<BigInteger, String> returnCP = new HashMap<BigInteger, String>();
		for(Map<String,Object> resultLine:result){
			returnCP.put((BigInteger)resultLine.get("cp_id"),resultLine.get("is_selected").toString());
		}
		return returnCP;
	}
	
	@Override
	public List<BigInteger> getSelectedCpBeforeTime(Long userid, Timestamp lastUpdateTime) {
		Session session = sessionFactory.getCurrentSession();
		String sql="SELECT cp_id FROM cp_choice_detail WHERE user_id=:userid AND create_time<:lastUpdateTime GROUP BY cp_id HAVING MAX(create_time) AND is_selected='Y' ";
		@SuppressWarnings("unchecked")
		List<Map<String,Object>> result = (List<Map<String,Object>>)session.createSQLQuery(sql).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).setLong("userid", userid).setDate("lastUpdateTime", lastUpdateTime).list();
		
		List<BigInteger> returnCP = new ArrayList<>();
		for(Map<String,Object> resultLine:result){
			returnCP.add((BigInteger)resultLine.get("cp_id"));
		}
		return returnCP;
	}

	@Override
	public CpChoiceDetailDO getCpChoiceDetail(Long userid, BigInteger cpId) {
		Session session = sessionFactory.getCurrentSession();
		String sql="SELECT cp.* FROM cp_choice_detail cp WHERE user_id=:userId AND cp_id =:cpId GROUP BY cp_id HAVING MAX(create_time) ";
		Object obj = session.createSQLQuery(sql).addEntity(CpChoiceDetailDO.class).setLong("userId", userid).setBigInteger("cpId", cpId).uniqueResult();
		if(obj != null){
			return (CpChoiceDetailDO)obj;
		}else{
			return null;
		}
	}

}

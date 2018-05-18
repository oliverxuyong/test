package so.xunta.persist.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
		BigInteger cpcdId = null;
		try {
			cpcdId = (BigInteger)session.save(cpChoiceDetail);
		} catch (Exception e) {
			e.printStackTrace();
		}
		cpChoiceDetail.setId(cpcdId);
		return cpChoiceDetail;
	}

	@Override
	public List<CpChoiceDetailDO> getOperatedCpAfterTime(Long userid, Timestamp lastUpdateTime) {
		Session session = sessionFactory.getCurrentSession();
		String sql="SELECT * FROM cp_choice_detail WHERE user_id= :userid AND create_time>= :lastUpdateTime GROUP BY cp_id HAVING MAX(create_time) ";
		@SuppressWarnings("unchecked")
		List<CpChoiceDetailDO> result = (List<CpChoiceDetailDO>)session.createSQLQuery(sql).addEntity(CpChoiceDetailDO.class).setLong("userid", userid).setTimestamp("lastUpdateTime", lastUpdateTime).list();
		if(result==null){
			result = new ArrayList<CpChoiceDetailDO>();
		}
		return result;
	}
	
	@Deprecated
	@Override
	public List<BigInteger> getSelectedCpBeforeTime(Long userid, Timestamp lastUpdateTime) {
		Session session = sessionFactory.getCurrentSession();
		String sql="SELECT cp_id,is_selected FROM cp_choice_detail WHERE user_id=:userid AND create_time<:lastUpdateTime GROUP BY cp_id HAVING MAX(create_time) AND is_selected='Y' ";
		@SuppressWarnings("unchecked")
		List<Map<String,Object>> result = (List<Map<String,Object>>)session.createSQLQuery(sql).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).setLong("userid", userid).setTimestamp("lastUpdateTime", lastUpdateTime).list();
		
		List<BigInteger> returnCP = new ArrayList<>();
		for(Map<String,Object> resultLine:result){
			returnCP.add((BigInteger)resultLine.get("cp_id"));
		}
		return returnCP;
	}

	@Override
	public CpChoiceDetailDO getCpChoiceDetailBeforeTime(Long userid, BigInteger cpId,Timestamp myLastUpdateTime) {
		Session session = sessionFactory.getCurrentSession();
		String sql="SELECT * FROM cp_choice_detail WHERE user_id=:userId AND cp_id =:cpId AND create_time<:lastUpdateTime AND is_selected='Y' ORDER BY create_time DESC ";
		@SuppressWarnings("unchecked")
		List<CpChoiceDetailDO> result = (List<CpChoiceDetailDO>)session.createSQLQuery(sql).addEntity(CpChoiceDetailDO.class).setLong("userId", userid).setBigInteger("cpId", cpId).setTimestamp("lastUpdateTime", myLastUpdateTime).list();
		if(result.size()!= 0){
			return result.get(0);
		}else{
			return null;
		}
	}

	@Override
	public Map<Long, Set<CpChoiceDetailDO>> getOperatedCpAfterTime(Set<String> userid, Timestamp lastUpdateTime) {
		Session session = sessionFactory.getCurrentSession();
		String sql="SELECT * FROM cp_choice_detail WHERE user_id in (:userid) AND create_time>= :lastUpdateTime GROUP BY user_id,cp_id HAVING COUNT(cp_id)%2!=0 AND MAX(create_time) ";
		@SuppressWarnings("unchecked")
		List<CpChoiceDetailDO> result = (List<CpChoiceDetailDO>)session.createSQLQuery(sql).addEntity(CpChoiceDetailDO.class).setParameterList("userid", userid).setTimestamp("lastUpdateTime", lastUpdateTime).list();
		Map<Long,Set<CpChoiceDetailDO>> returnMap = new HashMap<Long,Set<CpChoiceDetailDO>>();
		for(CpChoiceDetailDO cpc:result){
			Long userId = cpc.getUser_id();
			Set<CpChoiceDetailDO> cpcs=returnMap.get(userId);
			if(cpcs==null){
				cpcs=new HashSet<CpChoiceDetailDO>();
				cpcs.add(cpc);
				returnMap.put(userId, cpcs);
			}else{
				cpcs.add(cpc);
			}			
		}
		return returnMap;
	}

}

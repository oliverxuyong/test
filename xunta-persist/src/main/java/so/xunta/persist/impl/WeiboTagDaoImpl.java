package so.xunta.persist.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.WeiboTag;
import so.xunta.persist.WeiboTagDao;

@Transactional
@Repository
public class WeiboTagDaoImpl implements WeiboTagDao {
	Logger logger =Logger.getLogger(WeiboTagDaoImpl.class);
	
	@Autowired
	SessionFactory sessionFactory;

	//2018.03.26 叶夷 遍历获得微博标签的所有的name
	@SuppressWarnings("unchecked")
	@Override
	public List<WeiboTag> queryAllName() {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from WeiboTag group by name";
		Query query = session.createQuery(hql);
		return query.list();
	}

	//2018.03.26 叶夷 通过name获得其对应的标签
	@SuppressWarnings("unchecked")
	@Override
	public List<WeiboTag> queryTextFromName(String name) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from WeiboTag where name = :name ";
		Query query = session.createQuery(hql).setParameter("name", name);
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<String> getAllTags() {
		Session session = sessionFactory.getCurrentSession();
		String hql = "select distinct tag from WeiboTag ";
		Query query = session.createQuery(hql);
		return (List<String>)query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public Map<String, Double> getRelateTags(String tag, int magnitude,List<String> meanlessTags) {
		Session session = sessionFactory.getCurrentSession();
		String sql = "SELECT ts.tag r_tag, ts.score/tc.choice rank_score"
					+"FROM "
					+"(SELECT w1.tag, COUNT(w1.name) score "
					+ "FROM weiboTag w1,(SELECT DISTINCT w.name a FROM weiboTag w WHERE w.tag=:tag) n "
					+ "WHERE w1.tag!=:tag AND w1.name = n.a GROUP BY w1.tag) ts,"
					+"tag_choice tc "
					+"WHERE ts.tag = tc.tag AND tc.choice>:magnitude "
					+"ORDER BY rank_score DESC; ";
		List<Map<String,Object>> result = session.createSQLQuery(sql).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).
				setString("tag", tag).setString("tag", tag).setInteger("magnitude", magnitude).list();
		
		int size = result.size();
		int topN;
		
		if(size >= 500){
			topN = 100;
		}else if(size >= 400){
			topN = 90;
		}else if(size >= 300){
			topN = 80;
		}else if(size >= 200){
			topN = 70;
		}else if(size >= 100){
			topN = 60;
		}else if( size >=50){
			topN = 50;
		}else{
			topN = size;
		}
		
		Map<String,Double> returnMap = new HashMap<String,Double>();
		for(int i = 0;i< topN ;i++){
			Map<String,Object> line = result.get(i);
			String rTag = line.get("r_tag").toString();
			if(!meanlessTags.contains(rTag)){
				returnMap.put(rTag,Double.valueOf(line.get("rank_score").toString()));
			}
		}
		return returnMap;
	}
	
}

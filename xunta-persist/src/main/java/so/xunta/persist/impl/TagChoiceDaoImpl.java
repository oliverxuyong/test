package so.xunta.persist.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.TagChoiceDO;
import so.xunta.persist.TagChoiceDao;

@Repository
public class TagChoiceDaoImpl implements TagChoiceDao {
	Logger logger =Logger.getLogger(TagChoiceDaoImpl.class);
	
	@Autowired
	SessionFactory sessionFactory;
	
	@Override
	public TagChoiceDO getTagChoice(String tag) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from TagChoiceDO where tag = :tag ";
		Query query = session.createQuery(hql).setParameter("tag", tag);
		return (TagChoiceDO)query.list().get(0);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<String> getTopChoiceTags() {
		Session session = sessionFactory.getCurrentSession();
		String hql = "select tag from TagChoiceDO where choice>=1000 ";
		Query query = session.createQuery(hql);
		return (List<String>)query.list();
	}

}

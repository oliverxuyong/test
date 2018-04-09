package so.xunta.persist.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.TopicUserMapping;
import so.xunta.persist.TopicUserMappingDao;

@Transactional
@Repository
public class TopicUserMappingDaoImpl implements TopicUserMappingDao {
	@Autowired
	SessionFactory sessionFactory;

	@Override
	public TopicUserMapping addTopicUserMapping(TopicUserMapping topicUserMapping) {
		Session session = sessionFactory.getCurrentSession();
		session.save(topicUserMapping);
		return topicUserMapping;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<TopicUserMapping> findTopicUserMappingByTopicId(String topicId) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from tbl_topic_user_mapping where topic_id = :topic_id";
		Query query = session.createQuery(hql).setParameter("topic_id", topicId);
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TopicUserMapping> findTopicUserMappingByTopicIdAndUserType(String topic_id, String user_type) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from tbl_topic_user_mapping where topic_id = :topic_id and user_type= :user_type";
		Query query = session.createQuery(hql).setParameter("topic_id", topic_id).setParameter("user_type", user_type);
		return query.list();
	}

	@Override
	public TopicUserMapping updateTopicUserMapping(TopicUserMapping topicUserMapping) {
		Session session = sessionFactory.getCurrentSession();
		session.update(topicUserMapping);
		return topicUserMapping;
	}

	@Override
	public TopicUserMapping findTopicUserMappingByTopicIdAndUserId(String topic_id, String user_id) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from tbl_topic_user_mapping where topic_id = :topic_id and user_id= :user_id";
		Query query = session.createQuery(hql).setParameter("topic_id", topic_id).setParameter("user_id", user_id);
		return (TopicUserMapping) query.uniqueResult();
	}
}

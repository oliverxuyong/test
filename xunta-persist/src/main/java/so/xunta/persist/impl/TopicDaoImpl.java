package so.xunta.persist.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.Topic;
import so.xunta.persist.TopicDao;

@Transactional
@Repository
public class TopicDaoImpl implements TopicDao {
	@Autowired
	SessionFactory sessionFactory;

	@Override
	public Topic addTopic(Topic topic) {
		Session session = sessionFactory.getCurrentSession();
		session.save(topic);
		return topic;
	}

	@Override
	public Topic findUserByTopicId(String topicId) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from Topic where topic_id = :topic_id";
		Query query = session.createQuery(hql).setParameter("topic_id",topicId);
		return (Topic) query.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Topic> findUserByCreatorUid(String creator_uid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from Topic where creator_uid in (:creator_uid)";
		Query query = session.createQuery(hql).setParameter("creator_uid", creator_uid);
		return query.list();
	}
}

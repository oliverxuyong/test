package so.xunta.persist.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.TopicChatmsg;
import so.xunta.persist.TopicChatMsgDao;

@Transactional
@Repository
public class TopicChatMsgDaoImpl implements TopicChatMsgDao {
	@Autowired
	SessionFactory sessionFactory;

	@Override
	public TopicChatmsg addTopicChatmsg(TopicChatmsg topicChatmsg) {
		Session session = sessionFactory.getCurrentSession();
		session.save(topicChatmsg);
		return topicChatmsg;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TopicChatmsg> findNewTopicChatmsgByTopicId(String topic_id) {
		Session session = sessionFactory.getCurrentSession();
		//String hql = "from TopicChatmsg where topic_id = :topic_id ORDER BY create_datetime_long DESC LIMIT 1";//limit在hql中不能使用，并设置查询出来集合的数目，我们应该使用setMaxResults(e)方法来解决
		String hql = "from TopicChatmsg where topic_id = :topic_id ORDER BY create_datetime_long DESC";
		Query query = session.createQuery(hql).setParameter("topic_id", topic_id).setMaxResults(1);
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TopicChatmsg> findTopicChatmsgByTopicIdAndMsgType(String topicId, String type) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from TopicChatmsg where topic_id = :topic_id and type= :type";
		Query query = session.createQuery(hql).setParameter("topic_id", topicId).setParameter("type", type);
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TopicChatmsg> findTopicChatmsgByHistory(String topicId, long create_datetime_long, int msgCount) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from TopicChatmsg where topic_id = :topic_id and create_datetime_long<:create_datetime_long ORDER BY create_datetime_long DESC";
		Query query = session.createQuery(hql).setParameter("topic_id", topicId).setParameter("create_datetime_long", create_datetime_long).setMaxResults(msgCount);
		return query.list();
	}
}

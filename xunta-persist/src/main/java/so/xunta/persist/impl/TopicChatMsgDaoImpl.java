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

	@Override
	public TopicChatmsg findNewTopicChatmsgByTopicId(String topic_id) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from tbl_topic_chatmsg where topic_id = :topic_id ORDER BY create_datetime_long DESC LIMIT 1";
		Query query = session.createQuery(hql).setParameter("topic_id", topic_id);
		return (TopicChatmsg) query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TopicChatmsg> findTopicChatmsgByTopicIdAndMsgType(String topicId, String type) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from tbl_topic_chatmsg where topic_id = :topic_id and type= :type";
		Query query = session.createQuery(hql).setParameter("topic_id", topicId).setParameter("type", type);
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TopicChatmsg> findTopicChatmsgByHistory(String topicId, long create_datetime_long, int msgCount) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from tbl_topic_chatmsg where topic_id = :topic_id and create_datetime_long<:create_datetime_long ORDER BY create_datetime_long DESC LIMIT :msgCount";
		Query query = session.createQuery(hql).setParameter("topic_id", topicId).setParameter("create_datetime_long", create_datetime_long).setParameter("msgCount", msgCount);
		return query.list();
	}
}

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
	public List<TopicChatmsg> findTopicChatmsgByTopicId(String topic_id) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from TopicChatmsg where topic_id = :topic_id";
		Query query = session.createQuery(hql).setParameter("topic_id", topic_id);
		return query.list();
	}
}

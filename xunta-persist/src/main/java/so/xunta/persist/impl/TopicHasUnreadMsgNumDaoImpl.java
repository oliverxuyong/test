package so.xunta.persist.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.beans.TopicHasUnreadMsgNum;
import so.xunta.persist.TopicHasUnreadMsgNumDao;

@Repository
@Transactional
public class TopicHasUnreadMsgNumDaoImpl implements TopicHasUnreadMsgNumDao {
	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	public void addUserHasUnReadMsgTopicDao(TopicHasUnreadMsgNum usrHasUnreadMsgTopic) {
		Session session = sessionFactory.getCurrentSession();
		session.save(usrHasUnreadMsgTopic);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TopicHasUnreadMsgNum> findUserHasUnreadMsgTopicByUserid(Long userid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from TopicHasUnreadMsgNum as um where um.userid = :userid";
		return session.createQuery(hql).setParameter("userid", userid).list();
	}

	@Override
	public void deleteUserHasUnreadMsgTopicByUserId(Long userid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "delete from TopicHasUnreadMsgNum as um where um.userid = :userid";
		session.createQuery(hql).setParameter("userid", userid).executeUpdate();
	}
	
	@Override
	public void deleteUserHasUnreadMsgTopicByTopicid(Long topicid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "delete from TopicHasUnreadMsgNum as um where um.topicid = :topicid";
		session.createQuery(hql).setParameter("topicid", topicid).executeUpdate();
	}
	
	@Override
	public void increaseUnreadMsgNumbyOne(Long userid,Long topicid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from TopicHasUnreadMsgNum as um where um.topicid = :topicid";
		TopicHasUnreadMsgNum u = null;
		try {
			u = (TopicHasUnreadMsgNum) session.createQuery(hql).setParameter("topicid", topicid).uniqueResult();
		} catch (Exception e) {
			System.out.println(this.getClass().getName()+"报错:"+e.getMessage());
		}
		if(u!=null){
			u.setUnreadNum(u.getUnreadNum()+1);
			session.update(u);
		}else{
			TopicHasUnreadMsgNum uhu = new TopicHasUnreadMsgNum(userid, topicid, 1);
			session.save(uhu);
		}
	
	}
	
	@Override
	public TopicHasUnreadMsgNum findUserHasUnreadMsgTopicByTopicid(Long topicid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from TopicHasUnreadMsgNum as um where um.topicid = :topicid";
		return (TopicHasUnreadMsgNum) session.createQuery(hql).setParameter("topicid", topicid).uniqueResult();
	}

	@Override
	public void recordUnReadMsgDecreaseOne(Long userid, Long topicid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from TopicHasUnreadMsgNum as um where um.topicid = :topicid";
		TopicHasUnreadMsgNum u = null;
		try {
			u = (TopicHasUnreadMsgNum) session.createQuery(hql).setParameter("topicid", topicid).uniqueResult();
		} catch (Exception e) {
			System.out.println(this.getClass().getName()+"报错:"+e.getMessage());
		}
		if(u!=null&&u.getUnreadNum()>0){
			u.setUnreadNum(u.getUnreadNum()-1);
			session.update(u);
		}
	}
}

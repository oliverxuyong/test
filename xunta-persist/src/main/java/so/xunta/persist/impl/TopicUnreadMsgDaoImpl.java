package so.xunta.persist.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import so.xunta.beans.TopicUnreadMsg;
import so.xunta.persist.TopicUnreadMsgDao;

@Repository
@Transactional
public class TopicUnreadMsgDaoImpl implements TopicUnreadMsgDao {

	@Autowired
	SessionFactory sessionFactory;
	
	@Override
	public void addUnreadMsg(TopicUnreadMsg topicUnreadMsg) {
		Session session = sessionFactory.getCurrentSession();
		session.save(topicUnreadMsg);
	}
	
	@Override
	public void addUnreadMsgs(List<TopicUnreadMsg> unreadMsgs) {
		if(unreadMsgs==null||unreadMsgs.size()==0){
			return;
		}
		StringBuffer  values_buf = new StringBuffer();
		
		for(int i=0;i<unreadMsgs.size();i++){
			TopicUnreadMsg um = unreadMsgs.get(i);
			String value;
			if(i==unreadMsgs.size()-1){//最后一个
				
				value = String.format("(%d,%d,%d)",um.getMsgid(),um.getTopicid(),um.getUserid());
			}else{
				value = String.format("(%d,%d,%d),",um.getMsgid(),um.getTopicid(),um.getUserid());
			}
			values_buf.append(value);
		}
		String sql = String.format("insert ignore into tbl_topic_unreadmsg(msgid,topicid,userid) values %s",values_buf.toString());
		
		Session session = sessionFactory.getCurrentSession();
		int count = session.createSQLQuery(sql).executeUpdate();
		System.out.println(sql);
		System.out.println("执行sql 插入数据条 数:"+count);
	}

	@Override
	public void deleteUnreadMsgByTopicid(Long topicid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "delete from TopicUnreadMsg as um where um.topicid = :topicid";
		session.createQuery(hql).setParameter("topicid", topicid).executeUpdate();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TopicUnreadMsg> findUnreadMsgs(Long userid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from UnreadMsg as um where um.userid = :userid";
		return session.createQuery(hql).setParameter("userid", userid).list();
	}

	@Override
	public void deleteUnreadMsgs(Long topicid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "delete from TopicUnreadMsg as um where um.topicid = :topicid";
		session.createQuery(hql).setParameter("topicid", topicid).executeUpdate();
	}

	/**
	 * 删除话题下的一条未读消息
	 */
	@Override
	public void deleteOneUnreadMsg(Long topicid, Long msgid) {
		
		Session session = sessionFactory.getCurrentSession();
		
		String hql = "delete from TopicUnreadMsg as um where um.topicid = :topicid and um.msgid = :msgid";
		
		session.createQuery(hql).setParameter("topicid", topicid).setParameter("msgid", msgid).executeUpdate();
		
	}

	@Override
	public void deleteUserAllUnreadMsgs(Long userid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "delete from TopicUnreadMsg as um where um.userid = :userid";
		session.createQuery(hql).setParameter("userid", userid).executeUpdate();

	}

}

package so.xunta.persist.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.User;
import so.xunta.persist.UserDao;

@Transactional
@Repository
public class UserDaoImpl implements UserDao {
	@Autowired
	SessionFactory sessionFactory;
	
	public User findUserByName(String username) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from User as u where u.name = :username";
		Query query = session.createQuery(hql).setParameter("username",username);
		return (User) query.uniqueResult();
	}

	public User addUser(User user) {
		Session session = sessionFactory.getCurrentSession();
		session.save(user);
		return user;
	}
	

	@Override
	public User updateUser(User user) {
		Session session = sessionFactory.getCurrentSession();
		session.update(user);
		return user;
	}

	@Override
	public User findUserByThirdPartyIdAndType(String thirdPartyId, String type) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from User as u where u.third_party_id = :third_party_id and u.type= :type";
		Query query = session.createQuery(hql).setParameter("third_party_id",thirdPartyId).setParameter("type", type);
		return (User) query.uniqueResult();
	}

	@Override
	public User findUserByThirdPartyId(String thirdPartyId) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from User as u where u.third_party_id = :third_party_id";
		Query query = session.createQuery(hql).setParameter("third_party_id",thirdPartyId);
		return (User) query.uniqueResult();
	}
	
	@Override
	public User findUserByTwoThirdPartyIdAndType(String thirdPartyId1, String thirdPartyId2) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from User as u where u.third_party_id = :third_party_id1 or u.third_party_id=:third_party_id2";
		Query query = session.createQuery(hql).setParameter("third_party_id1",thirdPartyId1).setParameter("third_party_id2", thirdPartyId2);
		return (User) query.uniqueResult();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<User> findUserInIds(List<Long> user_ids) {
		if(user_ids==null||user_ids.size()==0){
			return new ArrayList<User>();
		}
		Session session = sessionFactory.getCurrentSession();
		String hql = "from User as u where u.userId in (:userIds)";
		Query query = session.createQuery(hql).setParameterList("userIds", user_ids);
		return query.list();
	}

	@Override
	public User findUserByUserid(Long userid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from User as u where u.userId = :userid";
		Query query = session.createQuery(hql).setParameter("userid",userid);
		return (User) query.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<User> findAllUsers() {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from User as u where u.userId != 1 ";
		return session.createQuery(hql).list();
	}

	@Override
	public void deleteUser(Long userid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "delete from User as u where u.userId = :userid";
		Query query = session.createQuery(hql).setParameter("userid", userid);
		query.executeUpdate();
		
	}

	@Override
	public User findUserByPhoneNumberAndPassword(String phonenumber, String password) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from User as u where u.phonenumber = :phonenumber and u.password = :password";
		Query query = session.createQuery(hql).setParameter("phonenumber",phonenumber).setParameter("password", password);
		return (User) query.uniqueResult();
	}

	@Override
	public User findUserByPhoneNumber(String phonenumber) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from User as u where u.phonenumber = :phonenumber ";
		Query query = session.createQuery(hql).setParameter("phonenumber",phonenumber);
		return (User) query.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<User> findUserByGroup(Long userId) {
		// zheng
		Session session = sessionFactory.getCurrentSession();
		String sql = "select u.* from tbl_user as u where u.userGroup='寻TA超级帐号' or u.userGroup = (select u1.userGroup from tbl_user as u1 where u1.userId = :userId)";
		Query query = session.createSQLQuery(sql).addEntity(User.class).setParameter("userId",userId);
		return query.list();
	}

	@Override
	public int getLinkedUserCounts(Long userid) {
		// zheng
		Session session = sessionFactory.getCurrentSession();
		String sql = "SELECT COUNT(DISTINCT t1.userid) "+
					  "FROM tbl_topic t1,"+ 
					  		"(SELECT DISTINCT tr.register_topicid rtid "+
					  		 "FROM tbl_topic_register tr, "+
					  			 "(SELECT topicId FROM tbl_topic WHERE userid=:userid) t "+ 
					  		 "WHERE tr.center_topicid = t.topicId AND register_topicid!=-1) tri "+
					  "WHERE t1.topicId=tri.rtid and t1.ifclosed=0";
		
		return Integer.parseInt(session.createSQLQuery(sql).setParameter("userid",userid).list().get(0).toString());
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Long> getLinkedUserIds(Long userid, int start, int amount) {
		// zheng
		Session session = sessionFactory.getCurrentSession();
		String sql = "SELECT DISTINCT tt.userid as userId FROM tbl_topic tt, "+
						"(SELECT tr.register_topicid rtid "+
						 "FROM tbl_topic_register tr,"+ 
						    "(SELECT topicId FROM tbl_topic WHERE userid=:userid AND ifclosed=0) t "+ 
					     "WHERE tr.center_topicid = t.topicId AND register_topicid!=-1) tri "+
					  "WHERE tt.topicId=tri.rtid AND  tt.ifclosed=0 "+
					  "GROUP BY tt.userId "+
					  "ORDER BY COUNT(tt.topicId) DESC, tt.newest_response_time_long DESC, userid DESC";
		List<User> result= session.createSQLQuery(sql).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).setParameter("userid",userid).setFirstResult(start).setMaxResults(amount).list();
		List<Long> utopicIds = new ArrayList<Long>();
		for(int i = 0;i<result.size();i++)
		{
			Map<String,Object> map = (Map<String, Object>) result.get(i);
			utopicIds.add(Long.valueOf(map.get("userId").toString()));
		}
		return utopicIds;
	}
}

package so.xunta.persist.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
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
	public List<User> findUserSameGroup(Long userId) {
		// zheng
		Session session = sessionFactory.getCurrentSession();
		String sql = "select u.* from tbl_user as u where u.userGroup='寻TA超级帐号' or u.userGroup = (select u1.userGroup from tbl_user as u1 where u1.userId = :userId)";
		Query query = session.createSQLQuery(sql).addEntity(User.class).setParameter("userId",userId);
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<User> findUserByGroup(String userGroup) {
		Session session = sessionFactory.getCurrentSession();
		String sql = "select u.* from tbl_user as u where u.userGroup = :userGroup";
		Query query = session.createSQLQuery(sql).addEntity(User.class).setParameter("userGroup",userGroup);
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<User> findUsersByScope(String eventScope) {
		Session session = sessionFactory.getCurrentSession();
		String sql = "select u.* from tbl_user as u where u.event_scope = :eventScope";
		Query query = session.createSQLQuery(sql).addEntity(User.class).setParameter("eventScope",eventScope);
		return query.list();
	}

	@Override
	public User findUserByOpenId(String openid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from User as u where u.openid = :openid";
		Query query = session.createQuery(hql).setParameter("openid",openid);
		return (User) query.uniqueResult();
	}
}

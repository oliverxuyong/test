package so.xunta.persist.impl;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.Token;
import so.xunta.persist.TokenDao;
/**
 * 2017.11.29 对微信公众号token的操作
 * @author 叶夷
 *
 */
@Transactional
@Repository
public class TokenDaoIml implements TokenDao {
	Logger logger =Logger.getLogger(TokenDaoIml.class);
	@Autowired
	SessionFactory sessionFactory;

	@Override
	public Token getTokenForAppid(String appid) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from tbl_token as t where t.appid = :appid";
		Query query = session.createQuery(hql).setParameter("appid",appid);
		return (Token) query.uniqueResult();
	}

	@Override
	public Token saveToken(Token token) {
		Session session = sessionFactory.getCurrentSession();
		session.save(token);
		return token;
	}

}

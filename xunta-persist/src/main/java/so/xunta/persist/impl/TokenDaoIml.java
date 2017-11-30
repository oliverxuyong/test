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
		System.out.println("开始测试Dao查找token1"+appid);
		Session session = sessionFactory.getCurrentSession();
		System.out.println("开始测试Dao查找token2");
		String hql = "from tbl_token as t where t.appid = :appid";
		Query query = session.createQuery(hql).setParameter("appid",appid);
		System.out.println("测试Dao查找token:"+query.uniqueResult());
		return (Token) query.uniqueResult();
	}

	@Override
	public Token saveToken(Token token) {
		Session session = sessionFactory.getCurrentSession();
		session.save(token);
		//System.out.println("测试Dao保存token:"+token.getAppid());
		return token;
	}

}

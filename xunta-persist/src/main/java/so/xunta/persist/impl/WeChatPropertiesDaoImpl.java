package so.xunta.persist.impl;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.Token;
import so.xunta.beans.WeChatProperties;
import so.xunta.persist.WeChatPropertiesDao;

/**
 * @author Bright Zheng
 * 使用Redis 值为Set类型完成C2U的操作
 * */
@Repository
public class WeChatPropertiesDaoImpl implements WeChatPropertiesDao {
	Logger logger =Logger.getLogger(TokenDaoIml.class);
	@Autowired
	SessionFactory sessionFactory;
	@Override
	public WeChatProperties getDataFromUserGroup(String usergroup) {
		Session session = sessionFactory.getCurrentSession();
		String sql = "select * from tbl_wechat where usergroup = :usergroup";
		Query query = session.createSQLQuery(sql).addEntity(Token.class).setParameter("usergroup",usergroup);
		return (WeChatProperties) query.uniqueResult();
	}

}

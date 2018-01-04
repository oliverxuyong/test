package so.xunta.persist.impl;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.beans.WeChatProperties;
import so.xunta.persist.WeChatPropertiesDao;

/**
 * @author Bright Zheng
 * 使用Redis 值为Set类型完成C2U的操作
 * */
@Service
@Transactional
public class WeChatPropertiesDaoImpl implements WeChatPropertiesDao {
	Logger logger =Logger.getLogger(WeChatPropertiesDaoImpl.class);
	@Autowired
	SessionFactory sessionFactory;
	@Override
	public WeChatProperties getDataFromUserGroup(String usergroup) {
		Session session = sessionFactory.getCurrentSession();
		String sql = "select * from tbl_wechat where usergroup = :usergroup";
		Query query = session.createSQLQuery(sql).addEntity(WeChatProperties.class).setParameter("usergroup",usergroup);
		logger.debug("测试1："+(WeChatProperties)query.uniqueResult()==null);
		return (WeChatProperties) query.uniqueResult();
	}

}

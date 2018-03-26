package so.xunta.persist.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.WeiboTag;
import so.xunta.persist.WeiboTagDao;

/**2018.03.26 
 * @author 叶夷
 * */

@Transactional
@Repository
public class WeiboTagDaoImpl implements WeiboTagDao {
	Logger logger =Logger.getLogger(WeChatPropertiesDaoImpl.class);
	
	@Autowired
	SessionFactory sessionFactory;

	//2018.03.26 叶夷 遍历获得微博标签的所有的name
	@SuppressWarnings("unchecked")
	@Override
	public List<WeiboTag> queryAllName() {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from weiboTag group by name";
		Query query = session.createQuery(hql);
		return query.list();
	}

	//2018.03.26 叶夷 通过name获得其对应的标签
	@SuppressWarnings("unchecked")
	@Override
	public List<WeiboTag> queryTextFromName(String name) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from weiboTag where name in (:name)";
		Query query = session.createQuery(hql).setParameter("name", name);
		return query.list();
	}
	
	

}

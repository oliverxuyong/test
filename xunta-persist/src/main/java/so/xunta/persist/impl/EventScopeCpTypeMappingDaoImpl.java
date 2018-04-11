package so.xunta.persist.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import so.xunta.beans.EventScopeCpTypeMappingDO;
import so.xunta.persist.EventScopeCpTypeMappingDao;

@Transactional
@Repository
public class EventScopeCpTypeMappingDaoImpl implements EventScopeCpTypeMappingDao {

	@Autowired
	SessionFactory sessionFactory;
	
	@SuppressWarnings("unchecked")
	@Override
	public List<String> getEventScopes() {
		Session session = sessionFactory.getCurrentSession();
		String hql = "select distinct event_scope from EventScopeCpTypeMappingDO group by event_scope ";
		List<String> eventScopes = (List<String>)session.createQuery(hql).list();
		return eventScopes;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<String> getCpTypes() {
		Session session = sessionFactory.getCurrentSession();
		String hql = "select distinct cp_type from EventScopeCpTypeMappingDO group by cp_type ";
		List<String> cpTypes = (List<String>)session.createQuery(hql).list();
		return cpTypes;
	}

	@Override
	public List<String> getEventScope(String cpType) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "select distinct event_scope from EventScopeCpTypeMappingDO where cp_type = :cpType ";
		@SuppressWarnings("unchecked")
		List<String> eventScopes= (List<String>)session.createQuery(hql).setParameter("cpType", cpType).list();
		return eventScopes;
	}

	@Override
	public List<String> getCpType(String eventScope) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "select distinct cp_type from EventScopeCpTypeMappingDO where event_scope = :eventScope ";
		@SuppressWarnings("unchecked")
		List<String> cpTypes= session.createQuery(hql).setParameter("eventScope", eventScope).list();
		return cpTypes;
	}

	@Override
	public void setEventScopeCpTypeMapping(String eventScope, String cpType) {
		Session session = sessionFactory.getCurrentSession();
		EventScopeCpTypeMappingDO eventScopeCpTypeMappingDO = new EventScopeCpTypeMappingDO();
		eventScopeCpTypeMappingDO.setEvent_scope(eventScope);
		eventScopeCpTypeMappingDO.setCp_type(cpType);
		session.save(eventScopeCpTypeMappingDO);
	}

}

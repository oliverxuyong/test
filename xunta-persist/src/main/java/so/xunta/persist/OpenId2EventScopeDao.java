package so.xunta.persist;

/**
 * @author Bright Zheng
 * 临时性缓存OpenId对应的EventScope
 * */
public interface OpenId2EventScopeDao {
	/**
	 * 返回openId对应的eventScope的同时删除缓存中的数据,如不存在则返回null
	 * */
	public String getEventScope(String openId);
	
	/**
	 * 将openId-eventScope 对缓存，如果openId已存在则会覆盖eventScope
	 * */
	public void setOpenId(String openId,String eventScope);
}

package so.xunta.server;

public interface OpenId2EventScopeService {
	/**
	 * 返回openId对应的eventScope的同时删除缓存中的数据,如不存在则返回null
	 * */
	public String getEventScope(String openId);
	
	/**
	 * 将openId-eventScope 对缓存，如果openId已存在则会覆盖eventScope
	 * */
	public void setOpenId(String openId,String eventScope);
}

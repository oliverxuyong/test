package so.xunta.persist;

import org.springframework.stereotype.Repository;

import so.xunta.beans.WeChatProperties;

@Repository
public interface WeChatPropertiesDao {
	//通过usergroup获得微信公众号所需数据
	public WeChatProperties getDataFromUserGroup(String usergroup);
}

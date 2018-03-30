package so.xunta.persist;

import java.util.List;
import so.xunta.beans.TopicUnreadMsg;

public interface TopicUnreadMsgDao {

	public void addUnreadMsg(TopicUnreadMsg unreadMsg);
	
	public void addUnreadMsgs(List<TopicUnreadMsg> unreadMsgs);
	
	public void deleteUnreadMsgByTopicid(Long topicid);
	
	public List<TopicUnreadMsg> findUnreadMsgs(Long userid);
	
	/**
	 * 清空某个话题下的未读消息
	 * @param topicid
	 */
	public void deleteUnreadMsgs(Long topicid);
	
	/**
	 * 删除一条 消息
	 */
	public void deleteOneUnreadMsg(Long topicid,Long msgid);
	
	/**
	 * 删除用户所有的未读消息
	 */
	public void deleteUserAllUnreadMsgs(Long userid);
	
}

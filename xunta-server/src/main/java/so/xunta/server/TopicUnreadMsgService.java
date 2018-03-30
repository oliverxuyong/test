package so.xunta.server;

import java.util.List;

import so.xunta.beans.TopicUnreadMsg;

public interface TopicUnreadMsgService {
	/**
	 * 保存未读消息
	 * @param unreadMsg
	 */
	public void addUnreadMsg(TopicUnreadMsg topicUnreadMsg);
	
	
	public List<TopicUnreadMsg> findUnreadChatMessage(Long userid);
	
	/**
	 * 清除某个话题下的历史消息
	 * @param topicid
	 */
	public void deleteUnreadMsgs(Long topicid);
	
	
	/**
	 * 删除一条 未读消息记录
	 * @param topicid
	 * @param msgid
	 */
	public void deleteOneUnreadMsg(Long topicid, Long msgid);
	
	/**
	 * 删除用户所有的未读消息
	 * @param userid
	 */
	public void deleteUserAllUnreadMsgs(Long userid);
	
}

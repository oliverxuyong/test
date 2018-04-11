package so.xunta.persist;

import java.util.List;

import so.xunta.beans.TopicHasUnreadMsgNum;

public interface TopicHasUnreadMsgNumDao {
	/**
	 * 添加用户未读消息记录
	 * @param usrHasUnreadMsgTopic
	 */
	public void addUserHasUnReadMsgTopicDao(TopicHasUnreadMsgNum usrHasUnreadMsgTopic);
	
	/**
	 * 根据用户id查询用户话题未读消息数
	 * @param userid
	 * @return
	 */
	public List<TopicHasUnreadMsgNum> findUserHasUnreadMsgTopicByUserid(Long userid);
	
	public TopicHasUnreadMsgNum findUserHasUnreadMsgTopicByTopicid(Long topicid);
	
	/**
	 * 删除用户话题未读消息数
	 * @param userid
	 */
	public void deleteUserHasUnreadMsgTopicByUserId(Long userid);
	public void deleteUserHasUnreadMsgTopicByTopicid(Long topicid);
	
	/**
	 * 将某个话题的未读消息数+1
	 * @param topicid
	 */
	public void increaseUnreadMsgNumbyOne(Long userid,Long topicid);
	
	/**
	 * 将某个话题的未读消息数-1 如果>0
	 * @param topicid
	 */
	public void recordUnReadMsgDecreaseOne(Long userid, Long topicid);
}

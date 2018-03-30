package so.xunta.server;

import java.util.List;

import so.xunta.beans.TopicHasUnreadMsgNum;

/**
 * 记录用户的每个话题的未读消息数，对话题没有记录的或者有记录的但数目为0的代表就是没有未读消息 后面的逻辑会将情况控制在未读消息为0的将记录删除
 * 
 * @author Thinkpad
 *
 */
public interface TopicHasUnreadMsgNumService {

	/**
	 * 当有未读消息时，调用该方法，该方法将检查是否存在对应topicid的记录， 若没有则添加一条记录 若有则更新增加未读消息数
	 * 
	 * @param userid
	 * @param topicid
	 */
	public void recordUnReadMsgIncreaseOne(Long userid, Long topicid);

	/**
	 * 减少一条
	 * 
	 * @param userid
	 * @param topicid
	 */
	public void recordUnReadMsgDecreaseOne(Long userid, Long topicid);

	/**
	 * 当客户端首次登录获取话题列表页后，就将用户所有的话题未读消息记录删除
	 * 
	 * @param userid
	 */
	public void deleteUserUnReadTopicMsgByUserid(Long userid);

	/**
	 * 用户点击进入话题时，查看某一个话题的历史消息时，删除该话题的未读消息记录
	 */
	public void deleteUserUnreadTopicMsgByTopicid(Long topicid);

	/**
	 * 查询用户的未读话题消息记录
	 */
	public List<TopicHasUnreadMsgNum> findUserHasUnreadMsgTopicByUserid(Long userid);

}

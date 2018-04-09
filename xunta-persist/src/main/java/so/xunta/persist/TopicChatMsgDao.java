package so.xunta.persist;

import java.util.List;
import org.springframework.stereotype.Repository;
import so.xunta.beans.TopicChatmsg;

/**
 * 2018.03.29  
 * @author 叶夷
 */
@Repository
public interface TopicChatMsgDao {
	public TopicChatmsg addTopicChatmsg(TopicChatmsg topicChatmsg);//添加消息
	public TopicChatmsg findNewTopicChatmsgByTopicId(String topicId);//通过查找topic_id获取该话题最新一条信息
	public List<TopicChatmsg> findTopicChatmsgByHistory(String topicId,long create_datetime_long,int msgCount);//分页查找msg,为了显示历史消息
	public List<TopicChatmsg> findTopicChatmsgByTopicIdAndMsgType(String topicId,String type);//通过查找topic_id和type获取该话题的所有TopicChatmsg
}

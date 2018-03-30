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
	public List<TopicChatmsg> findTopicChatmsgByTopicId(String topicId);//通过查找topic_id获取该话题的所有TopicChatmsg
}

package so.xunta.persist;

import java.util.List;

import org.springframework.stereotype.Repository;

import so.xunta.beans.Topic;

/**
 * 2018.03.29  
 * @author 叶夷
 */
@Repository
public interface TopicDao {
	public Topic addTopic(Topic topic);//添加话题
	public Topic findUserByTopicId(String topicId);//通过查找topic_id获取topic
	public List<Topic> findUserByCreatorUid(String creator_uid);//通过查找creator_uid获取topic
}

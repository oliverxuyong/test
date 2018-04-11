package so.xunta.persist;

import java.util.List;

import org.springframework.stereotype.Repository;
import so.xunta.beans.TopicUserMapping;

/**
 * 2018.03.29  
 * @author 叶夷
 */
@Repository
public interface TopicUserMappingDao {
	public TopicUserMapping addTopicUserMapping(TopicUserMapping topicUserMapping);//添加话题关系
	public List<TopicUserMapping> findTopicUserMappingByTopicId(String topicId);//通过查找topic_id获取该话题的所有TopicUserMapping
	public List<TopicUserMapping> findTopicUserMappingByTopicIdAndUserType(String topic_id,String user_type);//通过topic_id和user_type来查找TopicUserMapping数据，这是为了发送普通消息
	public TopicUserMapping updateTopicUserMapping(TopicUserMapping topicUserMapping);//更新话题关系
	public TopicUserMapping findTopicUserMappingByTopicIdAndUserId(String topic_id,String user_id);
	public List<TopicUserMapping> findTopicUserMappingByUserId(String user_id);//通过userid获得没有拒绝的话题，为了1120-1接口
}

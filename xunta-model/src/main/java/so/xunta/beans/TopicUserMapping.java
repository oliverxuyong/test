package so.xunta.beans;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 2018.03.29  
 * @author 叶夷
 * 话题邀请用户信息类
 */
@Entity
@Table(name="tbl_topic_user_mapping")
public class TopicUserMapping extends IdEntity{
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	private String topic_id;//机器生成
	private String user_id;
	private String user_type;//(INVITING 刚被邀请, ENTRANT 是已经加入的, REJECT 拒绝的)
	public TopicUserMapping() {
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTopic_id() {
		return topic_id;
	}
	public void setTopic_id(String topic_id) {
		this.topic_id = topic_id;
	}
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	public String getUser_type() {
		return user_type;
	}
	public void setUser_type(String user_type) {
		this.user_type = user_type;
	}
	
}

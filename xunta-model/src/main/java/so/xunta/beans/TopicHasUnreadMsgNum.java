package so.xunta.beans;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 2018.03.30  保存用户的话题的未读消息数
 * @author 叶夷
 *
 */
@Entity
@Table(name="tbl_topic_unreadnum")
public class TopicHasUnreadMsgNum {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	private Long userid;
	@Column(unique=true,nullable=false)
	private Long topicid;
	private int unreadNum;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Long getUserid() {
		return userid;
	}
	public void setUserid(Long userid) {
		this.userid = userid;
	}
	public Long getTopicid() {
		return topicid;
	}
	public void setTopicid(Long topicid) {
		this.topicid = topicid;
	}
	public int getUnreadNum() {
		return unreadNum;
	}
	public void setUnreadNum(int unreadNum) {
		this.unreadNum = unreadNum;
	}
	public TopicHasUnreadMsgNum() {
		super();
	}
	public TopicHasUnreadMsgNum(Long userid, Long topicid, int unreadNum) {
		super();
		this.userid = userid;
		this.topicid = topicid;
		this.unreadNum = unreadNum;
	}
}


package so.xunta.beans;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 2018.03.30
 * @author 叶夷
 *
 */
@Entity
@Table(name="tbl_topic_unreadmsg")
public class TopicUnreadMsg extends IdEntity{
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	@Column(unique=true)
	private Long msgid;
	private Long topicid;//消息所来自的话题id
	private Long userid;
	public TopicUnreadMsg() {
	}
	public long getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Long getMsgid() {
		return msgid;
	}
	public void setMsgid(Long msgid) {
		this.msgid = msgid;
	}
	public Long getTopicid() {
		return topicid;
	}
	public void setTopicid(Long topicid) {
		this.topicid = topicid;
	}
	public Long getUserid() {
		return userid;
	}
	public void setUserid(Long userid) {
		this.userid = userid;
	}
}



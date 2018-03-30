package so.xunta.beans;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.springframework.data.annotation.Id;

/**
 * 2018.03.30
 * @author 叶夷
 *
 */
@Entity
@Table(name="tbl_topic_unreadmsg",uniqueConstraints = {@UniqueConstraint(columnNames={"topicid","msgid"})})
public class TopicUnreadMsg {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	@Column(nullable=false)
	private Long msgid;
	@Column(nullable=false)
	private Long topicid;//消息所来自的话题id
	@Column(nullable=false)
	private Long userid;
	
	public int getId() {
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
	public TopicUnreadMsg() {
		super();
	}
	
	public TopicUnreadMsg(Long msgid, Long topicid, Long userid) {
		super();
		this.msgid = msgid;
		this.topicid = topicid;
		this.userid = userid;
	}
}



package so.xunta.beans;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 2018.03.29  
 * @author 叶夷
 * 话题聊天信息类
 */
@Entity
@Table(name="tbl_topic_chatmsg")
public class TopicChatmsg extends IdEntity{
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	@Column(unique=true)
	private String chatmsg_id;//机器生成
	private String chatmsg_content;
	private String type;//（INVITE 表示受到邀请时的第一句话，NORMAL 普通群聊消息）
	private String send_uid;
	private String topic_id;
	private String create_datetime;

	public TopicChatmsg() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getChatmsg_id() {
		return chatmsg_id;
	}

	public void setChatmsg_id(String chatmsg_id) {
		this.chatmsg_id = chatmsg_id;
	}

	public String getChatmsg_content() {
		return chatmsg_content;
	}

	public void setChatmsg_content(String chatmsg_content) {
		this.chatmsg_content = chatmsg_content;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getSend_uid() {
		return send_uid;
	}

	public void setSend_uid(String send_uid) {
		this.send_uid = send_uid;
	}

	public String getTopic_id() {
		return topic_id;
	}

	public void setTopic_id(String topic_id) {
		this.topic_id = topic_id;
	}

	public String getCreate_datetime() {
		return create_datetime;
	}

	public void setCreate_datetime(String create_datetime) {
		this.create_datetime = create_datetime;
	}
	
}

package so.xunta.beans;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
/**
 * 该表用于标记预设话题
 * 	并标记预设话题中哪个是大厅
 * @author Thinkpad
 */
@SuppressWarnings("serial")
@Entity
@Table(name="tbl_pub_topic",uniqueConstraints={@UniqueConstraint(columnNames={"topicid"})})
public class PubTopic implements Serializable{
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	private Long userid;//用户id
	private Long topicid;//外键话题id
	private int number;//话题编号
	private int isDating;//是否是大厅0 否,1是
	
	/**
	 * 如果不指定组，默认就是空，查询时就要判断是否为NULL
	 */
	private String groupname;//话题所属的组
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
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
	public String getGroupname() {
		return groupname;
	}
	public void setGroupname(String groupname) {
		this.groupname = groupname;
	}
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	
	public int getIsDating() {
		return isDating;
	}
	public void setIsDating(int isDating) {
		this.isDating = isDating;
	}
	public PubTopic() {
		super();
		// TODO Auto-generated constructor stub
	}
	public PubTopic(Long userid, Long topicid, int number, String groupname,int isDating) {
		super();
		this.userid = userid;
		this.topicid = topicid;
		this.number = number;
		this.groupname = groupname;
		this.isDating = isDating;
	}

}

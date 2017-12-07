package so.xunta.beans;

import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

import org.hibernate.annotations.ColumnDefault;

import so.xunta.beans.annotation.IndexDefinition;
import so.xunta.utils.DateTimeUtils;

@Entity
@Table(name="tbl_user",uniqueConstraints = {@UniqueConstraint(columnNames={"third_party_id","type"})})
public class User extends IdEntity{
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	@Column(unique=true)
	private Long userId;//机器生成
	private String third_party_id;//第三方唯一id
	private String openid;
	@Transient
	private String union_id;
	@Column(unique=true)
	private String name;
	@Column(length=12)
	private String password;
	@Column(length=15)
	private String phonenumber;
	private String imgUrl;
	private String type;//qq 微信　微博
	private Long create_datetime_long;
	private String create_datetime_str;
	@ColumnDefault(value="0")
	private Integer ifInitedTopics = 0;
	private Timestamp last_update_time;
	@ColumnDefault(value="xunta_common")
	private String event_scope;

	/**
	 * 用户名不能重复
	 */
	@Column(nullable=false)
	private String userGroup;

	@IndexDefinition(id=true,termVector=false,analyzed=false)
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	
	@IndexDefinition(termVector=true)
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	@IndexDefinition(analyzed=false,termVector=false)
	public String getImgUrl() {
		return imgUrl;
	}
	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}
	
	@IndexDefinition(analyzed=false,termVector=false)
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	@IndexDefinition(analyzed=false,termVector=false)
	public String getThird_party_id() {
		return third_party_id;
	}
	public void setThird_party_id(String third_party_id) {
		this.third_party_id = third_party_id;
	}
	public String getUserGroup() {
		return userGroup;
	}
	public void setUserGroup(String userGroup) {
		this.userGroup = userGroup;
	}
	@Override
	public boolean equals(Object obj) {
		User _u = (User)obj;
		return _u.userId.equals(userId);
	}
	@Override
	public int hashCode() {
		return userId.hashCode();
	}
	public User() {
		super();
	}
	public User(Long userId, String third_party_id, String name, String imgUrl, String type, 
			String userGroup, Timestamp lastUpdateTime) {
		super();
		this.userId = userId;
		this.third_party_id = third_party_id;
		this.name = name;
		this.imgUrl = imgUrl;
		this.type = type;
		this.userGroup = userGroup;
		Date user_create_date = new Date();
		this.create_datetime_long = user_create_date.getTime();
		this.create_datetime_str = DateTimeUtils.getTimeStrFromDate(user_create_date);
		this.last_update_time = lastUpdateTime;
	}
	@Override
	public String toString() {
		return "userid:"+userId +"  name:"+name+"  group:"+userGroup+"  imageUrl:"+imgUrl;
	}
	@IndexDefinition(analyzed=false,termVector=false)
	public Long getCreate_datetime_long() {
		return create_datetime_long;
	}
	public void setCreate_datetime_long(Long create_datetime_long) {
		this.create_datetime_long = create_datetime_long;
	}
	@IndexDefinition(analyzed=false,termVector=false)
	public String getCreate_datetime_str() {
		return create_datetime_str;
	}
	public void setCreate_datetime_str(String create_datetime_str) {
		this.create_datetime_str = create_datetime_str;
	}
	public String getUnion_id() {
		return union_id;
	}
	public void setUnion_id(String union_id) {
		this.union_id = union_id;
	}
	public String getPhonenumber() {
		return phonenumber;
	}
	public void setPhonenumber(String phonenumber) {
		this.phonenumber = phonenumber;
	}
	public Integer getIfInitedTopics() {
		return ifInitedTopics;
	}
	public void setIfInitedTopics(Integer ifInitedTopics) {
		this.ifInitedTopics = ifInitedTopics;
	}
	public String getOpenid() {
		return openid;
	}
	public void setOpenid(String openid) {
		this.openid = openid;
	}
	public String getEvent_scope() {
		return event_scope;
	}
	public void setEvent_scope(String event_scope) {
		this.event_scope = event_scope;
	}
	public Timestamp getLast_update_time() {
		return last_update_time;
	}
	public void setLast_update_time(Timestamp last_update_time) {
		this.last_update_time = last_update_time;
	}
	
}

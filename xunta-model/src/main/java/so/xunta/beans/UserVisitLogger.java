package so.xunta.beans;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import so.xunta.utils.DateTimeUtils;

@Entity
@Table(name="tbl_logger")
public class UserVisitLogger {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	private String userId;
	private String username;
	@Column(length=65535)
	private String info;
	private String client_ip;
	private String request_type;
	private String addition_type;
	private String where_user_from;
	private Long datetime_long;
	private String datetime_str;
	
	public UserVisitLogger(String userId, String username,String clientIP, String info, String request_type, String addition_type, String where_user_from) {
		super();
		this.userId = userId;
		this.username = username;
		this.client_ip = clientIP;
		this.info = info;
		this.request_type = request_type;
		this.addition_type = addition_type;
		this.where_user_from = where_user_from;
		Date date = new Date();
		this.datetime_long = date.getTime();
		this.datetime_str = DateTimeUtils.getTimeStrFromDate(date);
	}
	public String getRequest_type() {
		return request_type;
	}
	public void setRequest_type(String request_type) {
		this.request_type = request_type;
	}
	public String getAddition_type() {
		return addition_type;
	}
	public void setAddition_type(String addition_type) {
		this.addition_type = addition_type;
	}
	public String getWhere_user_from() {
		return where_user_from;
	}
	public void setWhere_user_from(String where_user_from) {
		this.where_user_from = where_user_from;
	}
	public UserVisitLogger() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getInfo() {
		return info;
	}
	public void setInfo(String info) {
		this.info = info;
	}
	public Long getDatetime_long() {
		return datetime_long;
	}
	public void setDatetime_long(Long datetime_long) {
		this.datetime_long = datetime_long;
	}
	public String getDatetime_str() {
		return datetime_str;
	}
	public void setDatetime_str(String datetime_str) {
		this.datetime_str = datetime_str;
	}
	public String getClient_ip() {
		return client_ip;
	}
	public void setClient_ip(String client_ip) {
		this.client_ip = client_ip;
	}
}

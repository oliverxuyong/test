package so.xunta.beans.validate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="tbl_mobilephone_valicode")
public class MobilePhoneValidateCode {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	@Column(length=15)
	private String mobile_phone_number;//手机号
	@Column(length=15)
	private String ip;
	@Column(length=6)
	private String validatecode;//验证码
	private Long datetime_long;//时间
	@Column(length=20)
	private String datetime_str;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getMobile_phone_number() {
		return mobile_phone_number;
	}
	public void setMobile_phone_number(String mobile_phone_number) {
		this.mobile_phone_number = mobile_phone_number;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public String getValidatecode() {
		return validatecode;
	}
	public void setValidatecode(String validatecode) {
		this.validatecode = validatecode;
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
}

package so.xunta.beans;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 凭证实体类
 */
@Entity
@Table(name="tbl_wechat")
public class WeChatProperties{
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	private String usergroup;
	//微信公众号的id
	private String appid;
	private String appsecret;
	private String templateid;
	private String templateurl;
	private String twoCode_templateContent;
	private String key;
	public WeChatProperties() {
	}
	public WeChatProperties(Long id, String usergroup, String appid, String appsecret, String templateid,
			String templateurl,String twoCode_templateContent, String key) {
		super();
		this.id = id;
		this.usergroup = usergroup;
		this.appid = appid;
		this.appsecret = appsecret;
		this.templateid = templateid;
		this.templateurl = templateurl;
		this.twoCode_templateContent=twoCode_templateContent;
		this.key = key;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getUsergroup() {
		return usergroup;
	}
	public void setUsergroup(String usergroup) {
		this.usergroup = usergroup;
	}
	public String getAppid() {
		return appid;
	}
	public void setAppid(String appid) {
		this.appid = appid;
	}
	public String getAppsecret() {
		return appsecret;
	}
	public void setAppsecret(String appsecret) {
		this.appsecret = appsecret;
	}
	public String getTemplateid() {
		return templateid;
	}
	public void setTemplateid(String templateid) {
		this.templateid = templateid;
	}
	public String getTemplateurl() {
		return templateurl;
	}
	public void setTemplateurl(String templateurl) {
		this.templateurl = templateurl;
	}
	public String getTwoCode_templateContent() {
		return twoCode_templateContent;
	}
	public void setTwoCode_templateContent(String twoCode_templateContent) {
		this.twoCode_templateContent = twoCode_templateContent;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	
}
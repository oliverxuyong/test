package so.xunta.beans;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**2018.03.26 叶夷 
 * 微博标签的实体类
 */
@Entity
@Table(name="weiboTag")
public class WeiboTag {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	private String name;
	private String tag;
	public WeiboTag() {
	}
	public WeiboTag(Long id, String name, String tag) {
		super();
		this.id = id;
		this.name = name;
		this.tag = tag;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTag() {
		return tag;
	}
	public void setTag(String tag) {
		this.tag = tag;
	}
}

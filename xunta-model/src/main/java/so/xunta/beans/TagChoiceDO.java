package so.xunta.beans;

import java.math.BigInteger;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="tag_choice")
public class TagChoiceDO {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private BigInteger id;
	private String tag;
	private Long choice;
	
	public String getTag() {
		return tag;
	}
	public void setTag(String tag) {
		this.tag = tag;
	}
	public Long getChoice() {
		return choice;
	}
	public void setChoice(Long choice) {
		this.choice = choice;
	}
}

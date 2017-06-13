package so.xunta.beans;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name="concern_point")
public class ConcernPointDO{
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private BigInteger id;
	private Long creator_uid;
	private String text;
	@ColumnDefault(value="1.0")
	private BigDecimal weight;
	private Timestamp create_time;
	private Timestamp modified_time;

	public BigInteger getId() {
		return id;
	}
	public void setId(BigInteger id) {
		this.id = id;
	}
	public Long getCreator_uid() {
		return creator_uid;
	}
	public void setCreator_uid(Long creator_uid) {
		this.creator_uid = creator_uid;
	}
	public BigDecimal getWeight() {
		return weight;
	}
	public void setWeight(BigDecimal weight) {
		this.weight = weight;
	}
	public Timestamp getCreate_time() {
		return create_time;
	}
	public void setCreate_time(Timestamp create_time) {
		this.create_time = create_time;
	}
	public Timestamp getModified_time() {
		return modified_time;
	}
	public void setModified_time(Timestamp modified_time) {
		this.modified_time = modified_time;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}

}

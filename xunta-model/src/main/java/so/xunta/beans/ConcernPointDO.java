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
	private Long creatorId;
	private String text;
	@ColumnDefault(value="1.0")
	private BigDecimal widget;
	private Timestamp gmt_create;
	private Timestamp gmt_modified;

	public BigInteger getId() {
		return id;
	}
	public void setId(BigInteger id) {
		this.id = id;
	}
	public Long getCreatorId() {
		return creatorId;
	}
	public void setCreatorId(Long creatorId) {
		this.creatorId = creatorId;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public BigDecimal getWidget() {
		return widget;
	}
	public void setWidget(BigDecimal widget) {
		this.widget = widget;
	}
	public Timestamp getGmt_create() {
		return gmt_create;
	}
	public void setGmt_create(Timestamp gmt_create) {
		this.gmt_create = gmt_create;
	}
	public Timestamp getGmt_modified() {
		return gmt_modified;
	}
	public void setGmt_modified(Timestamp gmt_modified) {
		this.gmt_modified = gmt_modified;
	}
}

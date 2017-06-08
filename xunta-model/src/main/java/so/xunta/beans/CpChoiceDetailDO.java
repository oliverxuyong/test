package so.xunta.beans;

import java.math.BigInteger;
import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cp_choice_detail")
public class CpChoiceDetailDO {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private BigInteger id;
	private Long userId;
	private BigInteger cp_id;
	private String is_selected;
	private Timestamp create_time;
	public BigInteger getId() {
		return id;
	}
	public void setId(BigInteger id) {
		this.id = id;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public BigInteger getCp_id() {
		return cp_id;
	}
	public void setCp_id(BigInteger cp_id) {
		this.cp_id = cp_id;
	}
	public String getIs_selected() {
		return is_selected;
	}
	public void setIs_selected(String is_selected) {
		this.is_selected = is_selected;
	}
	public Timestamp getCreate_time() {
		return create_time;
	}
	public void setCreate_time(Timestamp create_time) {
		this.create_time = create_time;
	}
	
}

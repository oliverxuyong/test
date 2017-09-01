package so.xunta.beans;

import java.math.BigInteger;
import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cp_choice")
public class CpChoiceDO {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private BigInteger id;
	private Long user_id;
	private BigInteger cp_id;
//	private String is_selected;
	private Long tmp_id;
	private Timestamp create_time;
	private Timestamp update_time;
	
	public BigInteger getId() {
		return id;
	}
	public void setId(BigInteger id) {
		this.id = id;
	}
	public Long getUser_id() {
		return user_id;
	}
	public void setUser_id(Long user_id) {
		this.user_id = user_id;
	}
	public BigInteger getCp_id() {
		return cp_id;
	}
	public void setCp_id(BigInteger cp_id) {
		this.cp_id = cp_id;
	}
	/*public String getIs_selected() {
		return is_selected;
	}
	public void setIs_selected(String is_selected) {
		this.is_selected = is_selected;
	}*/
	public Long getTmp_id() {
		return tmp_id;
	}
	public void setTmp_id(Long tmp_id) {
		this.tmp_id = tmp_id;
	}
	public Timestamp getCreate_time() {
		return create_time;
	}
	public void setCreate_time(Timestamp create_time) {
		this.create_time = create_time;
	}
	public Timestamp getUpdate_time() {
		return update_time;
	}
	public void setUpdate_time(Timestamp update_time) {
		this.update_time = update_time;
	}
}

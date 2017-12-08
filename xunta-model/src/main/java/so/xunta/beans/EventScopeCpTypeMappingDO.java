package so.xunta.beans;

import java.math.BigInteger;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="eventscope_cptype_mapping")
public class EventScopeCpTypeMappingDO {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private BigInteger id;
	private String event_scope;
	private String cp_type;
	
	public BigInteger getId() {
		return id;
	}
	public void setId(BigInteger id) {
		this.id = id;
	}
	public String getEvent_scope() {
		return event_scope;
	}
	public void setEvent_scope(String event_scope) {
		this.event_scope = event_scope;
	}
	public String getCp_type() {
		return cp_type;
	}
	public void setCp_type(String cp_type) {
		this.cp_type = cp_type;
	}
	
	
}

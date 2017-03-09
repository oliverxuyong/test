package so.xunta.beans;

import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

@MappedSuperclass
public abstract class IdEntity {
	
	@Transient 
	private boolean isDelete=false;
	@Transient 
	private boolean isSkip=false;
	
	public boolean isDelete() {
		return isDelete;
	}
	public void setDelete(boolean isDelete) {
		this.isDelete = isDelete;
	}
	public boolean isSkip() {
		return isSkip;
	}
	public void setSkip(boolean isSkip) {
		this.isSkip = isSkip;
	}
}

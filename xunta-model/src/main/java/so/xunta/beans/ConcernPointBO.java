package so.xunta.beans;

public class ConcernPointBO {
	private String cpId;
	private String cpText;
	
	public ConcernPointBO(String cpId,String cpText){
		this.cpId = cpId;
		this.cpText = cpText;
	}
	
	public String getCpId() {
		return cpId;
	}
	public void setCpId(String cpId) {
		this.cpId = cpId;
	}
	public String getCpText() {
		return cpText;
	}
	public void setCpText(String cpText) {
		this.cpText = cpText;
	}
}

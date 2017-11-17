package so.xunta.beans;

public class PushRecommendCpDTO {
	private String cpId;
	private String cpText;
	private Long selectPepoleNum;
	
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
	public Long getSelectPepoleNum() {
		return selectPepoleNum;
	}
	public void setSelectPepoleNum(Long selectPepoleNum) {
		this.selectPepoleNum = selectPepoleNum;
	}
}

package so.xunta.beans;

public class RecommendCpBO {
	private String cpId;
	private String cpText;
	private String ifSelectedByMe;
	private Long howManyPeopleSelected;
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
	public String getIfSelectedByMe() {
		return ifSelectedByMe;
	}
	public void setIfSelectedByMe(String ifSelectedByMe) {
		this.ifSelectedByMe = ifSelectedByMe;
	}
	public Long getHowManyPeopleSelected() {
		return howManyPeopleSelected;
	}
	public void setHowManyPeopleSelected(Long howManyPeopleSelected) {
		this.howManyPeopleSelected = howManyPeopleSelected;
	}
}

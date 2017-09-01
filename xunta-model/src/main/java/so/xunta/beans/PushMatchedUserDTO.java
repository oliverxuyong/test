package so.xunta.beans;

public class PushMatchedUserDTO {
	private String userid;
	private String username;
	private String img_src;
	private int new_rank;
	
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getImg_src() {
		return img_src;
	}
	public void setImg_src(String img_src) {
		this.img_src = img_src;
	}
	public int getNew_rank() {
		return new_rank;
	}
	public void setNew_rank(int new_rank) {
		this.new_rank = new_rank;
	}
}

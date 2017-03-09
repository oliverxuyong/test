package so.xunta.beans.search.expert;

import java.io.Serializable;

import so.xunta.beans.User;

/*
 * 
 * 封装人的得分数据，用于推荐
 */
public class UserModelForExpert implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 4933136587772682081L;
	private User user;
	private Float score;
	public UserModelForExpert(User user, Float score) {
		super();
		this.user = user;
		this.score = score;
	}
	
	public UserModelForExpert() {
		super();
		// TODO Auto-generated constructor stub
	}

	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public Float getScore() {
		return score;
	}
	public void setScore(Float score) {
		this.score = score;
	}
	
}

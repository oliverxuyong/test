package so.xunta.beans;

import java.util.ArrayList;
import java.util.List;

public class RecommendPushDTO {
	private List<PushMatchedUserDTO> pushMatchedUsers;
	private List<PushRecommendCpDTO> pushMatchedCPs;
	
	public List<PushMatchedUserDTO> getPushMatchedUsers() {
		return pushMatchedUsers;
	}
	public void addPushMatchedUser(PushMatchedUserDTO pushMatchedUser) {
		if(pushMatchedUser ==null){
			return;
		}
		if(pushMatchedUsers == null){
			pushMatchedUsers = new ArrayList<PushMatchedUserDTO>();
		}
		pushMatchedUsers.add(pushMatchedUser);
	}
	
	public List<PushRecommendCpDTO> getPushMatchedCPs() {
		return pushMatchedCPs;
	}
	public void addPushMatchedCPs(PushRecommendCpDTO pushMatchedCP) {
		if(pushMatchedCP == null){
			return;
		}
		if(pushMatchedCPs == null){
			pushMatchedCPs = new ArrayList<PushRecommendCpDTO>();
		}
		pushMatchedCPs.add(pushMatchedCP);
	}
	
	
}

package so.xunta.persist;

import java.util.Set;

public interface C2uPresentDao {
	
	public void setCpPresentUser(String cpid, String uid,String userEventScope);
	
	public Set<String> getCpPresentUsers(String cpid,String userEventScope);
	
	public void deleteCpPresentUser(String cpid,String uid,String userEventScope);
}

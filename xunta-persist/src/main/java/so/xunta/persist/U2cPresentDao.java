package so.xunta.persist;

import java.util.Set;

public interface U2cPresentDao {
	public void setUserPresentCps(String uid,Set<String> cpids);
	public Set<String> getUserPresentCps(String uid);
	public void dropUserPresentCps(String uid);
	public void delteUserPresentCp(String uid,String cpId);
}

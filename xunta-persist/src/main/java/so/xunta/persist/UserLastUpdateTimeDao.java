package so.xunta.persist;

public interface UserLastUpdateTimeDao {
	
	public String getUserLastUpdateTime(String uid);
	
	public void setUserLastUpdateTime(String uid, String date);
	
	public void clearUserLastUpdateTime(String uid);
}

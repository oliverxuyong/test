package so.xunta.persist;

public interface UserLastU2UUpdateTimeDao {
	
	public String getUserLastUpdateTime(String uid);
	
	public void setUserLastUpdateTime(String uid, String date);
	
	public void clearUserLastUpdateTime(String uid);
	
}

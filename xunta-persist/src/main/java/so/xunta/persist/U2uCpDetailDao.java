package so.xunta.persist;

import java.util.Map;
import java.util.Set;

public interface U2uCpDetailDao {
	public void addU2uOneCp(String uid1,String uid2,String property,String cpId,String cpText);
	public void addU2uCps(String uid1,String uid2,String property,Map<String,String> cps);
	public Map<String,String> getCps(String uid1,String uid2,String property);
	public Set<String> getCpIds(String uid1, String uid2, String property);
	public void removeU2uOneCp(String uid1,String uid2,String property,String cpId);
}

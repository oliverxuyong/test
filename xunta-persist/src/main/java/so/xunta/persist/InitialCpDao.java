package so.xunta.persist;

import java.util.Map;

public interface InitialCpDao {
	public void setCps(Map<String,Double> cps,String eventScope);
	public void setCp(String cpId,Double score, String eventScope);
	
	public Map<String,Double> getInitialCps(String eventScope);
	
//	public Map<String,Double> getRandomCps(String eventScope,int counts);
	
	public boolean ifexist(String eventScope);
	
	public Map<String,Double> getRandomGeneralCps(int counts);
	
	public void removeInitialCps(String eventScope);
}

package so.xunta.persist;

import java.util.Map;

public interface InitialCpDao {
	public void setCps(Map<String,Double> cps);
	
	public Map<String,Double> getInitialCps();
	
	public Map<String,Double> getRandomCps(int counts);
	
	public boolean ifexist();
}

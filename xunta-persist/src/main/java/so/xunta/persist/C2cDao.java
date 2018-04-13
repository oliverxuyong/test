package so.xunta.persist;

import java.util.Map;

public interface C2cDao {
	public void setCpRelateCps(String cpId, Map<String,String> relateCps);
	public Map<String,String> getCpRelateCps(String cpId);
}

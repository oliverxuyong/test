package so.xunta.persist;

import java.util.List;

public interface EventScopeCpTypeMappingDao {
	public static final String DEFAULT_EVENT_SCOPE = "CP_WAREHOUSE";
	public static final String DEFAULT_CP_TYPE = "general"; 
	
	public List<String> getEventScopes();
	public List<String> getCpTypes();
	public List<String> getEventScope(String cpType);
	public List<String> getCpType(String eventScope);
	public void setEventScopeCpTypeMapping(String eventScope,String cpType);
}

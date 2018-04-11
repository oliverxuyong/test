package so.xunta.server;

import java.util.List;

public interface EventScopeCpTypeMappingService {
	public void setEventScopeCpTypeMapping(String eventScope,String cpType);
	public List<String> getEventScope(String cpType);
	public List<String> getCpType(String eventScope);
}

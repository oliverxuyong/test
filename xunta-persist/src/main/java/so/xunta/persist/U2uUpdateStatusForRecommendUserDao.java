package so.xunta.persist;

import java.util.Map;

public interface U2uUpdateStatusForRecommendUserDao {

	public Double updateDeltaRelationValue(String centerUid,String relateUid,double dValue);
	

	public Map<String,String> getUserUpdateStatus(String centerUid);
	

	public void deleteU2uUpdateStatus(String centerUid);
}

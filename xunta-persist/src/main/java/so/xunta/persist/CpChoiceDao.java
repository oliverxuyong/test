package so.xunta.persist;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Set;

import so.xunta.beans.CpChoiceDO;

public interface CpChoiceDao {
	public CpChoiceDO saveCpChoice(CpChoiceDO cpChoice);
	public void updateCpChoice(CpChoiceDO cpChoice);
	
	/**
	 * 2017.08.11 叶夷  通过uid和cpid查找cp是否存在
	 */
	public CpChoiceDO getCpChoice(Long userid, BigInteger cpId);
	
	public List<CpChoiceDO> getSelectedCps(Long userid, String property);
	
	public List<CpChoiceDO> getSelectedCpsBeforeTime(Long userid, Timestamp lastUpdateTime);
	public Map<Long,Set<CpChoiceDO>> getSelectedCpsBeforeTime(Set<String> userids, Timestamp lastUpdateTime);
}

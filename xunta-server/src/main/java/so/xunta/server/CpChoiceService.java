package so.xunta.server;

import java.math.BigInteger;
import java.util.List;

import so.xunta.beans.ConcernPointDO;
import so.xunta.beans.CpChoiceDO;

public interface CpChoiceService {
	/**2017.08.11 叶夷  通过uid和cpid查找cp是否存在*/
	public CpChoiceDO getCpChoice(Long userid, BigInteger cpId);
	
	public List<ConcernPointDO> getUserSelectedCps(Long userid,String property);
}

package so.xunta.server;

import java.math.BigInteger;

import so.xunta.beans.CpChoiceDO;

public interface CpChoiceService {
	/**2017.08.11 叶夷  通过uid和cpid查找cp是否存在*/
	public CpChoiceDO getCpChoice(Long userid, BigInteger cpId);
}

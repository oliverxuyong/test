package so.xunta.persist;

import so.xunta.beans.CpChoiceDO;

public interface CpChoiceDao {
	public CpChoiceDO saveCpChoice(CpChoiceDO cpChoice);
	public void updateCpChoice(CpChoiceDO cpChoice);

}

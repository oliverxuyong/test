package so.xunta.persist;

import org.springframework.stereotype.Repository;

import so.xunta.beans.CpChoiceDetailDO;

@Repository
public interface CpChoiceDetailDao {

	public CpChoiceDetailDO saveCpChoiceDetail(CpChoiceDetailDO cpChoiceDetail);
	
}

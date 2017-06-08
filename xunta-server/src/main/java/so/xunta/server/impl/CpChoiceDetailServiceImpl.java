package so.xunta.server.impl;

import org.springframework.beans.factory.annotation.Autowired;

import so.xunta.beans.CpChoiceDetailDO;
import so.xunta.persist.CpChoiceDetailDao;
import so.xunta.server.CpChoiceDetailService;

public class CpChoiceDetailServiceImpl implements CpChoiceDetailService {

	@Autowired
	private CpChoiceDetailDao cpChoiceDetailDao;
	
	@Override
	public CpChoiceDetailDO saveCpChoiceDetail(CpChoiceDetailDO cpChoiceDetail) {
		return cpChoiceDetailDao.saveCpChoiceDetail(cpChoiceDetail);
	}

}

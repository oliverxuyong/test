package so.xunta.server.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.xunta.beans.CpChoiceDetailDO;
import so.xunta.persist.CpChoiceDetailDao;

import so.xunta.server.SelectOneNewCPService;


@Service
public class SelectOneNewCPServiceImpl implements SelectOneNewCPService{
	
	@Autowired
	private CpChoiceDetailDao cpChoiceDetailDao;

	@Override
	public void addNewCP(CpChoiceDetailDO cpChoiceDetailDO) {			
		cpChoiceDetailDO = cpChoiceDetailDao.saveCpChoiceDetail(cpChoiceDetailDO);
	}

}

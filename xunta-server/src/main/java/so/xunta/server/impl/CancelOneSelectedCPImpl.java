package so.xunta.server.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.xunta.beans.CpChoiceDetailDO;
import so.xunta.persist.CpChoiceDetailDao;
import so.xunta.server.CancelOneSelectedCP;

@Service
public class CancelOneSelectedCPImpl implements CancelOneSelectedCP{
	
	@Autowired
	private CpChoiceDetailDao cpChoiceDetailDao;

	@Override
	public CpChoiceDetailDO deleteSelectedCP(CpChoiceDetailDO selectedCP) {
		CpChoiceDetailDO returnCpChoiceDetail = cpChoiceDetailDao.saveCpChoiceDetail(selectedCP);
		return returnCpChoiceDetail;
	}
}

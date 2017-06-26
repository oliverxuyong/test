package so.xunta.server.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.xunta.beans.CpChoiceDetailDO;
import so.xunta.persist.CpChoiceDetailDao;
import so.xunta.server.RecommendService;
import so.xunta.server.SelectOneNewCPService;
import so.xunta.utils.RecommendTaskPool;

@Service
public class SelectOneNewCPServiceImpl implements SelectOneNewCPService{
	
	@Autowired
	private CpChoiceDetailDao cpChoiceDetailDao;
	
	@Autowired
	private RecommendService recommandService;
	
	@Override
	public CpChoiceDetailDO addNewCP(CpChoiceDetailDO cpChoiceDetailDO) {			
		CpChoiceDetailDO returnCpChoiceDetail = cpChoiceDetailDao.saveCpChoiceDetail(cpChoiceDetailDO);
		
		RecommendTaskPool.getInstance().getThreadPool().execute(new Runnable() {
			@Override
			public void run() {
				recommandService.recordU2UChange(returnCpChoiceDetail.getUser_id()+"",returnCpChoiceDetail.getCp_id()+"",RecommendService.SELECT_CP);
				recommandService.updateU2C(returnCpChoiceDetail.getUser_id()+"");
			}
		});
		return returnCpChoiceDetail;
	}

}

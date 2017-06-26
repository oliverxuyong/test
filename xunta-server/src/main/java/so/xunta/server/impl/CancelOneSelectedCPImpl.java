package so.xunta.server.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.xunta.beans.CpChoiceDetailDO;
import so.xunta.persist.CpChoiceDetailDao;
import so.xunta.server.CancelOneSelectedCP;
import so.xunta.server.RecommendService;
import so.xunta.utils.RecommendTaskPool;

@Service
public class CancelOneSelectedCPImpl implements CancelOneSelectedCP {
	
	@Autowired
	private CpChoiceDetailDao cpChoiceDetailDao;
	
	@Autowired
	private RecommendService recommandService;
	
	@Override
	public CpChoiceDetailDO deleteSelectedCP(CpChoiceDetailDO selectedCP) {
		CpChoiceDetailDO returnCpChoiceDetail = cpChoiceDetailDao.saveCpChoiceDetail(selectedCP);
		
		RecommendTaskPool.getInstance().getThreadPool().execute(new Runnable() {
			@Override
			public void run() {
				recommandService.recordU2UChange(returnCpChoiceDetail.getUser_id()+"",returnCpChoiceDetail.getCp_id()+"",RecommendService.UNSELECT_CP);
				recommandService.updateU2C(returnCpChoiceDetail.getUser_id()+"");
			}
		});
		return returnCpChoiceDetail;
	}

}

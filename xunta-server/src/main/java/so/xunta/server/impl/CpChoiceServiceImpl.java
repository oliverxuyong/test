package so.xunta.server.impl;

import java.math.BigInteger;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.beans.ConcernPointDO;
import so.xunta.beans.CpChoiceDO;
import so.xunta.persist.ConcernPointDao;
import so.xunta.persist.CpChoiceDao;
import so.xunta.server.CpChoiceService;

@Service
@Transactional
public class CpChoiceServiceImpl implements CpChoiceService{
	@Autowired
	private CpChoiceDao cpChoiceDao;
	@Autowired
	private ConcernPointDao concernPointDao;
	
	/**2017.08.11 叶夷  通过uid和cpid查找cp是否存在*/
	@Override
	public CpChoiceDO getCpChoice(Long userid, BigInteger cpId){
		return cpChoiceDao.getCpChoice(userid, cpId);
	}

	@Override
	public List<ConcernPointDO> getUserSelectedCps(Long userid,String property) {
		List<CpChoiceDO> cpChoices = cpChoiceDao.getSelectedCps(userid,property);
		List<ConcernPointDO> cps = new LinkedList<ConcernPointDO>();
		for(CpChoiceDO cpChoice:cpChoices){
			ConcernPointDO cp = concernPointDao.getConcernPointById(cpChoice.getCp_id());
			cps.add(cp);
		}
		return cps;
	}
	
}

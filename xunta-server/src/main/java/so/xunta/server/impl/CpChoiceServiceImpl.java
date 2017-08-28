package so.xunta.server.impl;

import java.math.BigInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.beans.CpChoiceDO;
import so.xunta.persist.CpChoiceDao;
import so.xunta.server.CpChoiceService;

@Service
@Transactional
public class CpChoiceServiceImpl implements CpChoiceService{
	@Autowired
	private CpChoiceDao cpChoiceDao;
	
	/**2017.08.11 叶夷  通过uid和cpid查找cp是否存在*/
	@Override
	public CpChoiceDO getCpChoice(Long userid, BigInteger cpId){
		return cpChoiceDao.getCpChoice(userid, cpId);
	}
}

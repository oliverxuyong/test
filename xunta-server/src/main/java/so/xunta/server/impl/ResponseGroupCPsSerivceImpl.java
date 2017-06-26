package so.xunta.server.impl;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import redis.clients.jedis.Tuple;
import so.xunta.beans.ConcernPointDO;
import so.xunta.beans.RecommendCpBO;
import so.xunta.persist.C2uDao;
import so.xunta.persist.ConcernPointDao;
import so.xunta.persist.CpChoiceDetailDao;
import so.xunta.persist.U2cDao;
import so.xunta.server.ResponseGroupCPsService;

@Service
public class ResponseGroupCPsSerivceImpl implements ResponseGroupCPsService {
	@Autowired
	private U2cDao u2cDao;
	
	@Autowired
	private ConcernPointDao concernPointDao;
	
	@Autowired
	private CpChoiceDetailDao cpChoiceDetailDao;
	
	@Autowired
	private C2uDao c2uDao;
	
	@Override
	public List<RecommendCpBO> getRecommendCPs(Long uid, int startPoint, int howMany) {
		Set<Tuple> cps= u2cDao.getUserCpsByRank(uid.toString(), startPoint, howMany);
		List<RecommendCpBO> returnList = new ArrayList<RecommendCpBO>();
		for(Tuple cp:cps){
			String cpid = cp.getElement();
			//Double cpScore = cp.getScore();
			ConcernPointDO cpDO = concernPointDao.getConcernPoint(BigInteger.valueOf(Long.valueOf(cpid)));
			RecommendCpBO cpBO = new RecommendCpBO();
			cpBO.setCpId(cpid);
			cpBO.setCpText(cpDO.getText());
			cpBO.setHowManyPeopleSelected(c2uDao.getHowManyPeopleSelected(cpid));
			cpBO.setIfSelectedByMe(cpChoiceDetailDao.getCpChoiceDetail(uid, BigInteger.valueOf(Long.valueOf(cpid))).getIs_selected());
			returnList.add(cpBO);
		}
		return returnList;
	}

}

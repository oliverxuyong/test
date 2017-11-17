package so.xunta.server.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.xunta.beans.CpChoiceDO;
import so.xunta.persist.C2uDao;
import so.xunta.persist.C2uPresentDao;
import so.xunta.persist.CpChoiceDao;
import so.xunta.persist.U2cPresentDao;
import so.xunta.server.CpShowingService;
import so.xunta.server.RecommendService;

@Service
public class CpShowingServiceImpl implements CpShowingService {
	@Autowired
	C2uPresentDao c2uPresentDao;
	@Autowired
	U2cPresentDao u2cPresentDao;
	@Autowired
	C2uDao c2uDao;
	@Autowired
	CpChoiceDao cpChoiceDao;
	
	Logger logger =Logger.getLogger(CpShowingServiceImpl.class);

	@Override
	public Set<String> getUsersNeedPush(String uid, String cpid) {
		Set<String> pushUsers = c2uPresentDao.getCpPresentUsers(cpid);
		pushUsers.remove(uid);
		return pushUsers;
	}

	@Override
	public void initUserShowingCps(String uid) {
		List<CpChoiceDO> cpChoices = cpChoiceDao.getSelectedCps(Long.valueOf(uid), RecommendService.POSITIVE_SELECT);
		Set<String> cpids = new HashSet<String>();
		for(CpChoiceDO cpChoice:cpChoices){
			cpids.add(cpChoice.getCp_id()+"");
		}
		addUserShowingCps(uid,cpids);
	}
	
	@Override
	public void addUserShowingCps(String uid, Set<String> cpids) {	
		if(cpids!=null){
			logger.info("设置新的一批用户正在显示的cp列表");
			u2cPresentDao.setUserPresentCps(uid, cpids);
			for(String cpid:cpids){
				c2uPresentDao.setCpPresentUser(cpid, uid);
			}
		}
	}

	@Override
	public int getCpSelectedUserCounts(String cpid) {
		return c2uDao.getHowManyPeopleSelected(cpid,RecommendService.POSITIVE_SELECT).intValue();
	}

	@Override
	public void clearUserShowingCps(String uid) {
		logger.info("删除用户正在显示的cp列表");
		Set<String> oldCpids = u2cPresentDao.getUserPresentCps(uid);
		if(oldCpids!=null && oldCpids.size()>0){
			for(String oldCpid:oldCpids){
				c2uPresentDao.deleteCpPresentUser(oldCpid, uid);
			}
			u2cPresentDao.dropUserPresentCps(uid);
		}	
	}

	@Override
	public void deleteUserShowingCp(String uid, String cpId) {
		u2cPresentDao.delteUserPresentCp(uid, cpId);
		c2uPresentDao.deleteCpPresentUser(cpId, uid);
	}

}

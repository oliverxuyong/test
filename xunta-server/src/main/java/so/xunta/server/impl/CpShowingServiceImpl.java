package so.xunta.server.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.xunta.beans.CpChoiceDO;
import so.xunta.beans.User;
import so.xunta.persist.C2uDao;
import so.xunta.persist.C2uPresentDao;
import so.xunta.persist.CpChoiceDao;
import so.xunta.persist.U2cPresentDao;
import so.xunta.persist.UserDao;
import so.xunta.server.CpShowingService;
import so.xunta.server.RecommendService;

@Service
public class CpShowingServiceImpl implements CpShowingService {
	@Autowired
	private C2uPresentDao c2uPresentDao;
	@Autowired
	private U2cPresentDao u2cPresentDao;
	@Autowired
	private C2uDao c2uDao;
	@Autowired
	private CpChoiceDao cpChoiceDao;
	@Autowired
	private UserDao userDao;
	
	Logger logger =Logger.getLogger(CpShowingServiceImpl.class);

	@Override
	public Set<String> getUsersNeedPush(String uid, String cpid,String eventScope) {
		Set<String> pushUsers = c2uPresentDao.getCpPresentUsers(cpid,eventScope);
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
			logger.debug("设置新的一批用户正在显示的cp列表");
			u2cPresentDao.setUserPresentCps(uid, cpids);
			User u = userDao.findUserByUserid(Long.valueOf(uid));
			for(String cpid:cpids){
				c2uPresentDao.setCpPresentUser(cpid, uid,u.getEvent_scope());
			}
		}
	}

	@Override
	public int getCpSelectedUserCounts(String cpid,String userEventScope) {
		return c2uDao.getHowManyPeopleSelected(cpid,RecommendService.POSITIVE_SELECT,userEventScope).intValue();
	}

	@Override
	public void clearUserShowingCps(String uid) {
		logger.debug("删除用户正在显示的cp列表");
		User u = userDao.findUserByUserid(Long.valueOf(uid));
		Set<String> oldCpids = u2cPresentDao.getUserPresentCps(uid);
		if(oldCpids!=null && oldCpids.size()>0){
			for(String oldCpid:oldCpids){
				c2uPresentDao.deleteCpPresentUser(oldCpid, uid,u.getEvent_scope());
			}
			u2cPresentDao.dropUserPresentCps(uid);
		}	
	}

	@Override
	public void deleteUserShowingCp(String uid, String cpId) {
		User u = userDao.findUserByUserid(Long.valueOf(uid));
		u2cPresentDao.delteUserPresentCp(uid, cpId);
		c2uPresentDao.deleteCpPresentUser(cpId, uid,u.getEvent_scope());
	}

}

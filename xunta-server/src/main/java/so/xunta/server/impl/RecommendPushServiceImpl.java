package so.xunta.server.impl;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import redis.clients.jedis.Tuple;
import so.xunta.beans.ConcernPointDO;
import so.xunta.beans.PushMatchedUserDTO;
import so.xunta.beans.PushRecommendCpDTO;
import so.xunta.beans.RecommendPushDTO;
import so.xunta.beans.User;
import so.xunta.persist.C2uDao;
import so.xunta.persist.ConcernPointDao;
import so.xunta.persist.U2cDao;
import so.xunta.persist.U2uRelationDao;
import so.xunta.persist.UserDao;
import so.xunta.server.RecommendPushService;
import so.xunta.utils.RecommendPushUtil;

@Service
public class RecommendPushServiceImpl implements RecommendPushService {
	@Autowired
	private U2uRelationDao u2uRelationDao;
	@Autowired
	private U2cDao u2cDao;
	@Autowired
	private C2uDao c2uDao;
	@Autowired
	private ConcernPointDao concernPointDao;
	@Autowired
	private UserDao userDao;
	
	Logger logger =Logger.getLogger(RecommendPushServiceImpl.class);
	
	@Override
	public void recordStatusBeforeUpdateTask(String uid) {
		List<String> matched_uids_previous = getMatchedUsers(uid , U_LISTEN_NUM);
		List<String> recommend_cps_previous = getRecommendCPs(uid, CP_LISTEN_NUM);
		RecommendPushUtil.getInstance().recordUserMatchedUids(uid, matched_uids_previous);
		RecommendPushUtil.getInstance().recordUserRecommendCps(uid, recommend_cps_previous);
	}

	@Override
	public RecommendPushDTO generatePushDataAfterUpdateTask(String uid) {
		RecommendPushDTO recommendPushDTO = new RecommendPushDTO();
		
		List<String> matched_uids_previous = RecommendPushUtil.getInstance().getUserMatchedUids(uid);
		List<String> matched_uids_after = getMatchedUsers(uid , U_LISTEN_NUM);
		if((matched_uids_previous.size() < U_LISTEN_NUM) && (matched_uids_after.size() > matched_uids_previous.size())){
			logger.info("原匹配列表还未达到指定长度并且新匹配列表有新用户产生，直接推送");
			generatePushMatchedUsers(matched_uids_after,recommendPushDTO);
		}else{
			for(int i=0;i<(matched_uids_previous.size()>U_TOP_NUM ? U_TOP_NUM : matched_uids_previous.size());i++){
				if(!matched_uids_previous.get(i).equals(matched_uids_after.get(i))){
					logger.info("前"+matched_uids_previous.size()+"位排名发生了变化,推送");
					generatePushMatchedUsers(matched_uids_after,recommendPushDTO);
					break;
				}
			}
		}
		
		List<String> recommend_cps_previous = RecommendPushUtil.getInstance().getUserRecommendCps(uid);
		List<String> recommend_cps_after = getRecommendCPs(uid, CP_THRESHOLD);
		List<String> pushedCpIds = new ArrayList<String>();
		for(String cpid:recommend_cps_after){
			if(recommend_cps_previous.contains(cpid)){
				continue;
			}
			ConcernPointDO cp = concernPointDao.getConcernPoint(BigInteger.valueOf(Long.valueOf(cpid)));
			PushRecommendCpDTO pushRecommendCp = new PushRecommendCpDTO();
			pushRecommendCp.setCpId(cpid);
			pushRecommendCp.setCpText(cp.getText());
			pushRecommendCp.setSelectPepoleNum(c2uDao.getHowManyPeopleSelected(cpid));
			
			recommendPushDTO.addPushMatchedCPs(pushRecommendCp);
			logger.info("产生推送cp："+cp.getText());
			pushedCpIds.add(cpid);
		}
	
		return recommendPushDTO;
	}

	/**
	 * 记录下改变前匹配用户的排序，以便在改变后得到排名变化
	 * */
	private	List<String> getMatchedUsers(String uid, int num){
		final int FIRST_USER_RANK = 0;
		List<String> matched_uids = new ArrayList<String>();	
		Set<Tuple> userSet = u2uRelationDao.getRelatedUsersByRank(uid, FIRST_USER_RANK, num-1);
		for(Tuple userTuple:userSet){
			String matchedUserid = userTuple.getElement();
			matched_uids.add(matchedUserid);
		}
		return matched_uids;
	}
	
	private List<String> getRecommendCPs(String uid, int num){
		Set<Tuple> cps= u2cDao.getUserCpsByRank(uid.toString(), 0, num-1);
		List<String> cpIds=new ArrayList<String>();
		for(Tuple cp:cps){
			String cpid = cp.getElement();
			cpIds.add(cpid);
		}
		return cpIds;
	}
	
	private void generatePushMatchedUsers(List<String> matched_uids_after, RecommendPushDTO recommendPushDTO){
		int rank=1;
		for(String uid:matched_uids_after){
			User u = userDao.findUserByUserid(Long.valueOf(uid));
			PushMatchedUserDTO pushMatchedUser = new PushMatchedUserDTO();
			pushMatchedUser.setUserid(u.getUserId().toString());
			pushMatchedUser.setUsername(u.getName());
			pushMatchedUser.setImg_src(u.getImgUrl());
			pushMatchedUser.setNew_rank(rank);

			logger.info("推送用户: "+u.getName()+" rank:"+rank);
			recommendPushDTO.addPushMatchedUser(pushMatchedUser);
			rank++;
		}
	}
}

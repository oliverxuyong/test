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
import so.xunta.server.RecommendService;
import so.xunta.utils.RecommendPushUtil;

@Service
public class RecommendPushServiceImpl implements RecommendPushService {	
	private final int U_TOP_NUM = 5; //推荐阈值，前U_TOP_NUM名的匹配用户如果排位发生了变化，就推送
	private final int U_LISTEN_NUM = 20;  //比较的匹配列表长度
	private final int CP_THRESHOLD = 10; //推荐阈值，更新后CP所处的最低排名
	private final int CP_LISTEN_NUM = 10; //推荐阈值，更新前CP所处的最高排名
	
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
	public Boolean recordStatusBeforeUpdateTask(String uid,int updateType) {
		if(updateType==RecommendService.SELECT_CP){
			List<String> recommend_cps_previous = getRecommendCPs(uid, CP_LISTEN_NUM);
			Boolean ifRecordRecommendCpSuccess = RecommendPushUtil.getInstance().recordUserRecommendCps(uid, recommend_cps_previous);
			if(!ifRecordRecommendCpSuccess){
				return false;
			}
		}
		List<String> matched_uids_previous = getMatchedUsers(uid , U_LISTEN_NUM);
		Boolean ifRecordMatchedUserSuccess = RecommendPushUtil.getInstance().recordUserMatchedUids(uid, matched_uids_previous);
		if(ifRecordMatchedUserSuccess){
			return true;
		}else{
			return false;
		}
		
	}

	/**
	 * 比较更新前后的U2U和U2C排序，
	 	* 前U_TOP_NUM名的匹配用户如果排位发生了变化或者新增，就推送
	 	* 如果一个cp原先推荐值从CP_LISTEN_NUM名之外一下跳到前CP_THRESHOLD的位置，就推送
	 * */
	@Override
	public RecommendPushDTO generatePushDataAfterUpdateTask(String uid, int updateType) {
		RecommendPushDTO recommendPushDTO = new RecommendPushDTO();
		
		generatePushMatchedUsers(uid, recommendPushDTO);
		
		if(updateType == RecommendService.SELECT_CP){	
			generatePushRecommendCp(uid,recommendPushDTO);
		}

		return recommendPushDTO;
	}

	@Override
	public void clearUserStatus(String uid) {
		RecommendPushUtil.getInstance().removeUserData(uid);
	}
	
	private void generatePushMatchedUsers(String uid, RecommendPushDTO recommendPushDTO){
		List<String> matched_uids_previous = RecommendPushUtil.getInstance().getUserMatchedUids(uid);
		List<String> matched_uids_after = getMatchedUsers(uid , U_LISTEN_NUM);
		if(matched_uids_previous.size() != matched_uids_after.size()){
			logger.debug("匹配用户数量发生了变化，直接产生推送");
			appendPushUsers(matched_uids_after,recommendPushDTO);
		}else{
			for(int i=0;i < (matched_uids_previous.size()>U_TOP_NUM ? U_TOP_NUM : matched_uids_previous.size());i++){
				if(!matched_uids_previous.get(i).equals(matched_uids_after.get(i))){
					logger.debug("前"+matched_uids_previous.size()+"位排名发生了变化,产生推送");
					appendPushUsers(matched_uids_after,recommendPushDTO);
					break;
				}
			}
		}
	}
	
	private void generatePushRecommendCp(String uid, RecommendPushDTO recommendPushDTO){
		List<String> recommend_cps_previous = RecommendPushUtil.getInstance().getUserRecommendCps(uid);
		List<String> recommend_cps_after = getRecommendCPs(uid, CP_THRESHOLD);
		User u = userDao.findUserByUserid(Long.valueOf(uid));
		for(String cpid:recommend_cps_after){
			if(recommend_cps_previous.contains(cpid)){
				continue;
			}
			ConcernPointDO cp = concernPointDao.getConcernPointById(BigInteger.valueOf(Long.valueOf(cpid)));
			PushRecommendCpDTO pushRecommendCp = new PushRecommendCpDTO();
			pushRecommendCp.setCpId(cpid);
			pushRecommendCp.setCpText(cp.getText());
			pushRecommendCp.setSelectPepoleNum(c2uDao.getHowManyPeopleSelected(cpid,RecommendService.POSITIVE_SELECT,u.getEvent_scope()));
			
			recommendPushDTO.addPushMatchedCPs(pushRecommendCp);
			logger.debug("产生推送cp："+cp.getText());
		}
	}
	
	private void appendPushUsers(List<String> matched_uids_after, RecommendPushDTO recommendPushDTO){
		int rank=1;
		if(matched_uids_after.size()==0){
			logger.debug("没有匹配用户");
			PushMatchedUserDTO pushMatchedUser = new PushMatchedUserDTO();
			recommendPushDTO.addPushMatchedUser(pushMatchedUser);
		}else{
			for(String uid:matched_uids_after){
				User u = userDao.findUserByUserid(Long.valueOf(uid));
				PushMatchedUserDTO pushMatchedUser = new PushMatchedUserDTO();
				pushMatchedUser.setUserid(u.getUserId().toString());
				pushMatchedUser.setUsername(u.getName());
				pushMatchedUser.setImg_src(u.getImgUrl());
				pushMatchedUser.setNew_rank(rank);
	
				recommendPushDTO.addPushMatchedUser(pushMatchedUser);
				rank++;
			}
			logger.debug("产生匹配用户："+matched_uids_after.toString());
		}
	}	
	
	private	List<String> getMatchedUsers(String uid, int num){
		List<String> matched_uids = new ArrayList<String>();	
		Set<Tuple> userSet = u2uRelationDao.getRelatedUsersByRank(uid, 0, num-1);
		for(Tuple userTuple:userSet){
			if(userTuple.getScore()<0.0 || Math.abs(userTuple.getScore()-0.0)<1e-6){
				break;
			}
			String matchedUserid = userTuple.getElement();
			matched_uids.add(matchedUserid);
		}
		return matched_uids;
	}
	
	private List<String> getRecommendCPs(String uid, int num){
		Set<Tuple> cps= u2cDao.getUserCpsByRank(uid.toString(), 0, num-1);
		List<String> cpIds=new ArrayList<String>();
		for(Tuple cp:cps){
			if(cp.getScore() <= 1e-6){
				break;
			}
			String cpid = cp.getElement();
			cpIds.add(cpid);
		}
		return cpIds;
	}
	
}

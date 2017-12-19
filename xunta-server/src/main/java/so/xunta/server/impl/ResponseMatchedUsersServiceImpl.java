package so.xunta.server.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import redis.clients.jedis.Tuple;
import so.xunta.beans.User;
import so.xunta.persist.U2uCpDetailDao;
import so.xunta.persist.U2uRelationDao;
import so.xunta.persist.UserDao;
import so.xunta.server.RecommendService;
import so.xunta.server.ResponseMatchedUsersService;

@Service
public class ResponseMatchedUsersServiceImpl implements ResponseMatchedUsersService {
    
	@Autowired
	private U2uRelationDao u2uRelationDao;
	@Autowired
	private UserDao userDao;
	@Autowired
	private U2uCpDetailDao u2uCpDetailDao;
	
	Logger logger =Logger.getLogger(ResponseMatchedUsersServiceImpl.class);
	
	private final int FIRST_USER_RANK = 0;
	
	@Override
	public List<User> getMatchedUsers(Long userid,int topNum) {
		
		Set<Tuple> userSet= u2uRelationDao.getRelatedUsersByRank(userid.toString(), FIRST_USER_RANK, topNum-1);
		List<User> matchedUsers = new ArrayList<User>();
		for(Tuple userTuple:userSet){
			if(userTuple.getScore()<0.0 || Math.abs(userTuple.getScore()-0.0)<1e-6){
				break;
			}
			String matchedUserid = userTuple.getElement();
			matchedUsers.add(userDao.findUserByUserid((Long.valueOf(matchedUserid))));
		}

		return matchedUsers;
	}

	@Override
	public JSONArray getMatchedUsersWithCPJSONArr(String userId, int topNum) {
		JSONArray matchUsersJsonArr = new JSONArray();
		
		Set<Tuple> userSet = u2uRelationDao.getRelatedUsersByRank(userId.toString(), FIRST_USER_RANK, topNum-1);
		for(Tuple userTuple:userSet){
			if(userTuple.getScore()<0.0 || Math.abs(userTuple.getScore()-0.0)<1e-6){
				break;
			}
			String otherUid = userTuple.getElement();
			JSONArray positiveCommCpJsonArr = new JSONArray();
			JSONArray negativeCommCpJsonArr = new JSONArray();
			
			User user = userDao.findUserByUserid(Long.valueOf(otherUid));
			
			Map<String,String>  positiveCommCps = u2uCpDetailDao.getCps(userId, otherUid, RecommendService.POSITIVE_SELECT);
			for(Entry<String,String> pCommCp :positiveCommCps.entrySet()){
				JSONObject cpObj = new JSONObject();
				cpObj.put("cpid", pCommCp.getKey());
				cpObj.put("cptext", pCommCp.getValue());
				positiveCommCpJsonArr.put(cpObj);
			}
			
			Map<String,String>  negativeCommCps = u2uCpDetailDao.getCps(userId, otherUid, RecommendService.NEGATIVE_SELECT);
			for(Entry<String,String> nCommCp :negativeCommCps.entrySet()){
				JSONObject cpObj = new JSONObject();
				cpObj.put("cpid", nCommCp.getKey());
				cpObj.put("cptext", nCommCp.getValue());
				negativeCommCpJsonArr.put(cpObj);
			}
			
			JSONObject matchUserJson = new JSONObject();
			matchUserJson.put("userid", otherUid);
			matchUserJson.put("username", user.getName());
			matchUserJson.put("img_src", user.getImgUrl());
			matchUserJson.put("positive_common_cps", positiveCommCpJsonArr);
			matchUserJson.put("negative_common_cps", negativeCommCpJsonArr);
			matchUsersJsonArr.put(matchUserJson);
		}
		return matchUsersJsonArr;
	}

}

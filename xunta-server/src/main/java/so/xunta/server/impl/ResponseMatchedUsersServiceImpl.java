package so.xunta.server.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import redis.clients.jedis.Tuple;
import so.xunta.beans.User;
import so.xunta.persist.U2uRelationDao;
import so.xunta.persist.UserDao;
import so.xunta.server.ResponseMatchedUsersService;

@Service
public class ResponseMatchedUsersServiceImpl implements ResponseMatchedUsersService {
    
	@Autowired
	private U2uRelationDao u2uRelationDao;
	@Autowired
	private UserDao userDao;
	
	Logger logger =Logger.getLogger(ResponseMatchedUsersServiceImpl.class);
	
	private final int FIRST_USER_RANK = 0;
	
	@Override
	public List<User> getMatchedUsers(Long userid,int topNum) {
		
		Set<Tuple> userSet= u2uRelationDao.getRelatedUsersByRank(userid.toString(), FIRST_USER_RANK, topNum-1);
		List<Long> uids = new ArrayList<Long>();
		for(Tuple userTuple:userSet){
			if(userTuple.getScore()<=0){
				break;
			}
			String matchedUserid = userTuple.getElement();
			uids.add(Long.valueOf(matchedUserid));
		}
		List<User> matchedUsers= userDao.findUserInIds(uids);	
		return matchedUsers;
	}

}

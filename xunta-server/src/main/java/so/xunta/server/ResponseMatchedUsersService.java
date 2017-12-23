package so.xunta.server;

import java.util.List;

import org.json.JSONArray;

import so.xunta.beans.User;

public interface ResponseMatchedUsersService {
	public List<User> getMatchedUsers(Long userid, int topNum);
	public JSONArray getMatchedUsersWithCPJSONArr(String userId, int topNum);
	public JSONArray getMatchedUserWithCPJSONArr(String myUserId,String matchedUserId);
}

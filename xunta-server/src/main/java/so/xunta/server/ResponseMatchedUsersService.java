package so.xunta.server;

import java.util.List;

import so.xunta.beans.User;

public interface ResponseMatchedUsersService {
	public List<User> getMatchedUsers(Long userid, int topNum);
}

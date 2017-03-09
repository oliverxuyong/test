package so.xunta.server;

import java.util.List;

import so.xunta.beans.User;

public interface UserService {
	//添加用户
	public User addUser(User user);
	
	public User updateUser(User user);
	
	//查询用户
	public User findUser(Long userid);
	
	public User findUserByName(String username);
	
	public User findUserByThirdPartyIdAndType(String thirdPartyId,String type);
	public User findUserByThirdPartyId(String thirdPartyId);
	public User findUserByPhoneNumberAndPassword(String phonenumber, String password);
	public User findUserByPhoneNumber(String phonenumber);
	
	public List<User> findUserInIds(List<Long> user_ids);
	
	/**
	 * 查询数据库中所有的user
	 */
	public List<User> findAllUsers();
	
	//将用户删除
	//0删除成功 1删除失败
	public int delUser(Long userid);
	
	/*zheng 通过组找用户
	 **/ 
	public List<User> findUserByGroup(Long userid);

}

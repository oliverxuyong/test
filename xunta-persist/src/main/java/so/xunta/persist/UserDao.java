package so.xunta.persist;

import java.util.List;

import org.springframework.stereotype.Repository;

import so.xunta.beans.User;

@Repository
public interface UserDao {
	
	public User findUserByName(String username);
	
	public User findUserByThirdPartyId(String thirdPartyId);
	public User findUserByThirdPartyIdAndType(String thirdPartyId,String type);
	
	public User findUserByTwoThirdPartyIdAndType(String thirdPartyId1,String thirdPartyId2);
	
	public User findUserByPhoneNumberAndPassword(String phonenumber,String password);
	
	public User findUserByPhoneNumber(String phonenumber);//根据手机号判断用户是否存在
	
	public User addUser(User user);
	
	public User updateUser(User user);
	
	public List<User> findUserInIds(List<Long> user_ids);
	
	public User findUserByUserid(Long userid);
	
	/**
	 * 查询数据库中所有的user
	 */
	public List<User> findAllUsers();
	
	//删除用户
	public void deleteUser(Long userid);
	
	/*zheng 
	 **/ 
	public List<User> findUserSameGroup(Long userid);
	
	public List<User> findUserByGroup(String userGroup);
	
	public List<User> findUsersByScope(String eventScope);
	
	//2018.03.22   叶夷   通过openid来判断用户是否存在
	public User findUserByOpenId(String openid);
}

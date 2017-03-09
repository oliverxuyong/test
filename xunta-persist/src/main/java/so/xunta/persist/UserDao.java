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
	
	/*zheng 通过组找用户
	 **/ 
	public List<User> findUserByGroup(Long userid);
	
	//获得关联的用户数
	public int getLinkedUserCounts(Long userid);
	
	//获得所有排序好的关联的用户
	public List<Long> getLinkedUserIds(Long userid, int start, int amount);
	
}

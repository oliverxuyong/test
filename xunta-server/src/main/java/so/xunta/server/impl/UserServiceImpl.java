package so.xunta.server.impl;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.beans.User;
import so.xunta.persist.DicDao;
import so.xunta.persist.UserDao;
import so.xunta.server.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService{
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private DicDao dicDao;

	Logger logger = Logger.getLogger(UserServiceImpl.class);
	
	@Override
	public synchronized User addUser(User user) {
	
		if(user.getType()==null || "".equals(user.getType().trim())){
			throw new RuntimeException("用户类型未指定\n");
		}
		
		if(!user.getType().equals("QQ")&&!user.getType().equals("WX")&&!user.getType().equals("Phone")&&!user.getType().equals("sys"))
		{
			throw new RuntimeException("用户类型不在QQ WX Phone类别中");
		}
	
		User _user = null;
		if(user.getType().equals("Phone"))
		{
			_user = userDao.findUserByPhoneNumber(user.getPhonenumber());
		}else{
			_user = userDao.findUserByThirdPartyIdAndType(user.getThird_party_id(),user.getType());
		}
		
		//先检查用户是否存在，根据thirdpartyId 和 type
		//User _user = userDao.findUserByTwoThirdPartyIdAndType(user.getThird_party_id(),user.getUnion_id());
		if(_user==null){
			//查询用户名是否存在
			User user_temp  = findUserByName(user.getName());
			if(user_temp == null){
				_user = userDao.addUser(user);
			}else{
				//用户名重复,获取一个不重复的用户名
				String newUserName = getUnDumplicateUserName(user.getName());
				user.setName(newUserName);
				_user = userDao.addUser(user);
			}
		}else{
			logger.info(user.getName()+"   用户存在");
			//更新用户
			//_user.setName(user.getName());
			//_user.setImgUrl(user.getImgUrl());
			//userDao.updateUser(_user);
			//index_user(_user);
			return _user;
		}
		return _user;
	}

	private String getUnDumplicateUserName(String username) {
		String value = dicDao.getValue("ID");
		String newValue ="";
		if(value == null){
			dicDao.addValue("ID","1");
			newValue="1";
		}else{
			newValue = (Integer.valueOf(value)+1)+"";
			dicDao.updateValue("ID",newValue);
		}
		String newUsername = username+newValue;
		while(userDao.findUserByName(newUsername)!=null){
			value = dicDao.getValue("ID");
			if(value == null){
				dicDao.addValue("ID","1");
			}else{
				newValue = (Integer.valueOf(value)+1)+"";
				dicDao.updateValue("ID",newValue);
			}
			newUsername = username+newValue;
		}
		
		return newUsername;
	}

	/**
	 * 取出用户名下划线后的数字
	 * @param name
	 * @return
	 */
	private static int getNumEndOfName(String name) {
		String regex = ".+_(\\d+)$";
		Matcher matcher = Pattern.compile(regex).matcher(name);
		if(matcher.find()){
			String num_str = matcher.group(1);
			return Integer.valueOf(num_str);
		}
		return 0;
	}

	public static void main(String[] args) {
		String name = "上海哪_44好玩_";
		int num = getNumEndOfName(name);
		System.out.println(num);
	}
	
	/**
	 * 检查用户名是否是以下划线带数字结尾
	 * @param name
	 * @return
	 */
	public static boolean checkUserNameWithXiaHuaXian(String name) {
		String regex = ".+_\\d+$";
		Matcher matcher = Pattern.compile(regex).matcher(name);
		return matcher.matches();
	}

	@Override
	public User findUser(Long userid) {
		User user = userDao.findUserByUserid(userid);
		return user;
	}


	@Override
	public User findUserByName(String username) {
		return userDao.findUserByName(username);
	}


	@Override
	public User findUserByThirdPartyIdAndType(String thirdPartyId, String type) {
		return userDao.findUserByThirdPartyIdAndType(thirdPartyId, type);
	}


	@Override
	public List<User> findUserInIds(List<Long> user_ids) {
		return userDao.findUserInIds(user_ids);
	}


	@Override
	public List<User> findAllUsers() {
		return userDao.findAllUsers();
	}

	@Override
	public User updateUser(User user) {
		User _u =  userDao.updateUser(user);
		return _u;
	}

	@Override
	public int delUser(Long userid) {
		System.out.println("删除用户");
		userDao.deleteUser(userid);
		return 0;
	}

	@Override
	public User findUserByThirdPartyId(String thirdPartyId) {
		return userDao.findUserByThirdPartyId(thirdPartyId);
	}

	@Override
	public User findUserByPhoneNumberAndPassword(String phonenumber, String password) {
		return userDao.findUserByPhoneNumberAndPassword(phonenumber, password);
	}

	@Override
	public User findUserByPhoneNumber(String phonenumber) {

		return userDao.findUserByPhoneNumber(phonenumber);
	}

	@Override
	public List<User> findUserByGroup(Long userid) {
		// zheng
		return userDao.findUserByGroup(userid);
	}
}

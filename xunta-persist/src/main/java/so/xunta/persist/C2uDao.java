package so.xunta.persist;

import java.util.Set;

public interface C2uDao {
	/**
	 *获得所有选择某CP的用户列表
	 * */
	public Set<String> getUsersSelectedSameCp(String cpId,String property);
	
	/**
	 * 获得有多少人选择了此CP
	 * */
	public Long getHowManyPeopleSelected(String cpId,String property);
	/**
	 * 在某CP的用户列表中添加某用户
	 * */
	public void saveCpOneUser(String cpId, String uid,String property);
	/**
	 * 在某CP的用户列表中删除某用户
	 * */
	public void deleteUserInCp(String cpId, String uid,String property);
}

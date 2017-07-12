package so.xunta.persist;

import java.util.Map;

public interface U2uUpdateStatusDao {

	/**
	 * 更新关系值差值，如果dValue为0等同于标记状态发生改变
	 * @return 更新后的关系值
	 * */
	public Double updateDeltaRelationValue(String centerUid,String relateUid,double dValue);
	
	/**
	 * 获取用户的更新数据
	 * */
	public Map<String,String> getUserUpdateStatus(String centerUid);
	
	/**
	 * 删除
	 * */
	public void deleteU2uUpdateStatus(String centerUid);
}

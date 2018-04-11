package so.xunta.persist;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.List;

import so.xunta.beans.CpChoiceDetailDO;


public interface CpChoiceDetailDao {

	public static final String SELECTED = "Y";
	public static final String UNSELECTED = "N";
	public CpChoiceDetailDO saveCpChoiceDetail(CpChoiceDetailDO cpChoiceDetail);
	/**
	 * 获得在上次更新后标签的变化
	 * */
	public List<CpChoiceDetailDO> getOperatedCpAfterTime(Long userid, Timestamp lastUpdateTime);
	/**
	 * 获得在上次更新前已选择的标签
	 * */
	@Deprecated
	public List<BigInteger> getSelectedCpBeforeTime(Long userid, Timestamp lastUpdateTime);
	
	
	public CpChoiceDetailDO getCpChoiceDetailBeforeTime(Long userid, BigInteger cpId, Timestamp myLastUpdateTime);
}

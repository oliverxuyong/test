package so.xunta.persist;

import java.math.BigInteger;
import java.util.List;

import org.springframework.stereotype.Repository;

import so.xunta.beans.ConcernPointDO;

/**
 * @author bright_zheng
 * 
 */
@Repository
public interface ConcernPointDao {
	/**
	 * @author bright_zheng
	 * @param ConcernPointDO
	 * @return ConcernPointDO
	 * */
	public ConcernPointDO saveConcernPoint(ConcernPointDO cp);
	/**
	 * @author bright_zheng
	 * @param BigInteger
	 * @return ConcernPointDO
	 * */
	public ConcernPointDO getConcernPoint(BigInteger id);
	/**
	 * @author bright_zheng
	 * @param Long
	 * @return List<ConcernPointDO>
	 * */
	public List<ConcernPointDO> listConcernPointsByCreator(Long uid,int startPoint,int howMany);
	/**
	 * @author bright_zheng
	 * @param ConcernPointDO
	 * @return ConcernPointDO
	 * */
	public ConcernPointDO updateConcernPoint(ConcernPointDO cp);
}

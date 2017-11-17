package so.xunta.persist;

import java.math.BigInteger;
import java.sql.SQLException;
import java.util.List;

import org.springframework.dao.DuplicateKeyException;

import so.xunta.beans.ConcernPointDO;

/**
 * @author bright_zheng
 * 
 */

public interface ConcernPointDao {
	/**
	 * @author bright_zheng
	 * @param ConcernPointDO
	 * @return ConcernPointDO
	 * @throws SQLException 
	 * */
	public ConcernPointDO saveConcernPoint(ConcernPointDO cp) throws DuplicateKeyException;
	/**
	 * @author bright_zheng
	 * @param BigInteger
	 * @return ConcernPointDO
	 * */
	public ConcernPointDO getConcernPointById(BigInteger cpId);
	
	public ConcernPointDO getConcernPointByText(String cpText);
	/**
	 * @author bright_zheng
	 * @param Long
	 * @return List<ConcernPointDO>
	 * */
	public List<ConcernPointDO> listConcernPointsByCreator(Long uid,int startPoint,int howMany);
	
	public List<ConcernPointDO> listConcernPointsByCreator();
	/**
	 * @author bright_zheng
	 * @param ConcernPointDO
	 * @return ConcernPointDO
	 * */
	public ConcernPointDO updateConcernPoint(ConcernPointDO cp);
}

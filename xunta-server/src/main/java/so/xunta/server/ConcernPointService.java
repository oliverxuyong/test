package so.xunta.server;

import java.math.BigInteger;
import java.util.List;

import org.springframework.dao.DuplicateKeyException;

import so.xunta.beans.ConcernPointDO;


public interface ConcernPointService {
	public ConcernPointDO saveConcernPoint(ConcernPointDO cp) throws DuplicateKeyException;
	public ConcernPointDO getConcernPointById(BigInteger id);
	public ConcernPointDO getConcernPointByText(String cptext);
	public List<ConcernPointDO> listConcernPointsByCreator(Long uid,int startPoint,int howMany);
	public ConcernPointDO updateConcernPoint(ConcernPointDO cp);
}

package so.xunta.server;

import java.math.BigInteger;
import java.sql.SQLException;
import java.util.List;


import so.xunta.beans.ConcernPointDO;


public interface ConcernPointService {
	public ConcernPointDO saveConcernPoint(ConcernPointDO cp) throws SQLException;
	public ConcernPointDO getConcernPointById(BigInteger id);
	public ConcernPointDO getConcernPointByText(String cptext);
	public List<ConcernPointDO> listConcernPointsByCreator(Long uid,int startPoint,int howMany);
	public ConcernPointDO updateConcernPoint(ConcernPointDO cp);
}

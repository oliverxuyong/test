package so.xunta.server;

import java.math.BigInteger;
import java.util.List;


import so.xunta.beans.ConcernPointDO;


public interface ConcernPointService {
	public ConcernPointDO saveConcernPoint(ConcernPointDO cp);
	public ConcernPointDO getConcernPoint(BigInteger id);
	public List<ConcernPointDO> listConcernPointsByCreator(Long uid,int startPoint,int howMany);
	public ConcernPointDO updateConcernPoint(ConcernPointDO cp);
}

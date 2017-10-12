package so.xunta.server.impl;

import java.math.BigInteger;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.beans.ConcernPointDO;
import so.xunta.persist.ConcernPointDao;
import so.xunta.server.ConcernPointService;

@Service
@Transactional
public class ConcernPointServiceImpl implements ConcernPointService {

	@Autowired
	private ConcernPointDao concernPointDao;
	
	Logger logger = Logger.getLogger(ConcernPointServiceImpl.class);
	
	@Override
	public ConcernPointDO saveConcernPoint(ConcernPointDO cp) throws SQLException{
		
		return concernPointDao.saveConcernPoint(cp);
	}

	@Override
	public ConcernPointDO getConcernPointById(BigInteger id) {
		
		return concernPointDao.getConcernPointById(id);
	}

	@Override
	public ConcernPointDO getConcernPointByText(String cptext) {
		
		return concernPointDao.getConcernPointByText(cptext);
	}
	
	@Override
	public List<ConcernPointDO> listConcernPointsByCreator(Long uid,int startPoint,int howMany) {
		
		return concernPointDao.listConcernPointsByCreator(uid,startPoint,howMany);
	}

	@Override
	public ConcernPointDO updateConcernPoint(ConcernPointDO cp) {
		
		return concernPointDao.updateConcernPoint(cp);
	}
	
}

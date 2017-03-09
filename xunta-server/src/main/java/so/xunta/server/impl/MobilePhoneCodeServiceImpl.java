package so.xunta.server.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.xunta.beans.validate.MobilePhoneValidateCode;
import so.xunta.persist.MobilePhoneCodeDao;
import so.xunta.server.MobilePhoneCodeService;

@Service
public class MobilePhoneCodeServiceImpl implements MobilePhoneCodeService {

	@Autowired
	private MobilePhoneCodeDao mpcDao;
	@Override
	public void addMobilePhoneCode(MobilePhoneValidateCode mpvcode) {
		mpcDao.addMobilePhoneCode(mpvcode);
	}

	@Override
	public Long findShortmsgNumByIP(String ip) {
		return mpcDao.findShortmsgNumByIP(ip);
	}

	@Override
	public Long findShortmsgNumByPhonenumber(String phonenumber) {
		return mpcDao.findShortmsgNumByPhonenumber(phonenumber);
	}

	@Override
	public Long findTheLatestTimestampByPhonenumber(String phonenumber) {
		return mpcDao.findTheLatestTimestampByPhonenumber(phonenumber);
	}

}

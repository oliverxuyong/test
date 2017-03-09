package so.xunta.server;

import so.xunta.beans.validate.MobilePhoneValidateCode;

public interface MobilePhoneCodeService {
	//保存手机验证信息
	public void addMobilePhoneCode(MobilePhoneValidateCode mpvcode);
	
	//查询某一ip在当天的总的发送短信的条数
	public Long findShortmsgNumByIP(String ip);
	
	//查询某手机号在当天总的发送短信的条数
	public Long findShortmsgNumByPhonenumber(String phonenumber);

	//查询某手机号最近一次发送短信的时间戳
	public Long findTheLatestTimestampByPhonenumber(String phonenumber);
}


package so.xunta.server;


public interface LoggerService {
	public void log(String userId,String username,String clientIP, String info,String requestType, String addition_type, String whereUserFrom);
}

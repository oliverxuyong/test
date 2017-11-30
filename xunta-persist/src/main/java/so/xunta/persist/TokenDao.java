package so.xunta.persist;

import java.util.List;

import org.springframework.stereotype.Repository;

import so.xunta.beans.Token;

@Repository
public interface TokenDao {
	/**
	 *通过appid获得token和failureTime
	 * */
	public List<Token> getTokenForAppid(String appid);
	
	/**
	 * 保存Token
	 * */
	public Token saveToken(Token token);
	
	public Token updateToken(Token token);
}

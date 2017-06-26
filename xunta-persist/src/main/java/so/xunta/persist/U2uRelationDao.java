package so.xunta.persist;

import java.util.Set;

import redis.clients.jedis.Tuple;

public interface U2uRelationDao {
	/**
	 * 得到关系值范围内的用户集
	 * */
	public Set<Tuple> getRelatedUsersByRank(String uid, int start, int end);
	
	/**
	 * 将U2U UpdateStatus中的delta value累加到 U2U Relation中
	 * */
	public void updateUserRelationValue(String centerUid, String relateUid, double dRelationValue);
	
	/**
	 * 得到相关用户的关系值
	 * */
	public Double getRelatedUserScore(String myuid, String relateUid);
}

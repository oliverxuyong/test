package so.xunta.server;

import java.util.List;

import so.xunta.beans.RecommendCpBO;

public interface ResponseGroupCPsService {
	
	public List<RecommendCpBO> getRecommendCPs(Long uid, int startPoint, int howMany);
}

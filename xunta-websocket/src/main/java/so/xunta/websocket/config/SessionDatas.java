package so.xunta.websocket.config;

import java.util.HashMap;
import java.util.Map;

public class SessionDatas {

	public static SessionDatas instance = new SessionDatas();
	
	Map<Long,Map<String,Object>> map_uid_data = new HashMap<Long,Map<String,Object>>();
	
	private SessionDatas() {
		super();
	}
	
	public static SessionDatas getInstance(){
		return instance;
	}
	
	public Map<String,Object> getUsersSessionData(Long uid){
		if(map_uid_data.containsKey(uid)){
			return map_uid_data.get(uid);
		}else{
			Map<String,Object> map = new HashMap<String, Object>();
			map_uid_data.put(uid, map);
			return map;
		}
	}
	
	public void clearUsersSessionData(Long uid){
		map_uid_data.remove(uid);
	}
	
}

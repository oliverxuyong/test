package so.xunta.websocket.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.RecommendCpBO;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.server.CpShowingService;
import so.xunta.server.ResponseGroupCPsService;
import so.xunta.server.SocketService;

@WebSocketTypeAnnotation
@Component
public class RequestCpWSController {
	@Autowired
	private ResponseGroupCPsService responseGroupCPsService;
	@Autowired
	private SocketService socketService;
	@Autowired
	private CpShowingService cpShowingService;
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1101-1")
	public void responseGroupCPs(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		int startPoint = Integer.valueOf(params.getInt("startpoint"));
		int howMany = Integer.valueOf(params.getInt("howmany"));
		String timestamp = params.getString("timestamp"); //以后再处理
		
		List<RecommendCpBO> cps = responseGroupCPsService.getRecommendCPs(uid, startPoint, howMany);
		
		JSONArray cpWrap = new JSONArray();
		Set<String> cpids = new HashSet<String>();
		for(RecommendCpBO cp:cps){
			JSONObject cpjson = new JSONObject();
			String cpid = cp.getCpId();
			cpids.add(cpid);
			cpjson.put("cpid", cpid);
			cpjson.put("cptext", cp.getCpText());
			cpjson.put("ifselectedbyme", cp.getIfSelectedByMe());
			cpjson.put("howmanypeople_selected", cp.getHowManyPeopleSelected());
			cpWrap.put(cpjson);
		}
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1101-2");
		returnJson.put("uid", uid+"");
		returnJson.put("startpoint", startPoint);
		returnJson.put("howmany", howMany);
		returnJson.put("timestamp", timestamp);
		returnJson.put("cp_wrap", cpWrap);
		socketService.chat2one(session, returnJson);
		
		cpShowingService.addUserShowingCps(uid+"", cpids);
	}
}

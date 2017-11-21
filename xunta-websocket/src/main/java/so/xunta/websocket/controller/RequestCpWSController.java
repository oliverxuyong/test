package so.xunta.websocket.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.ConcernPointDO;
import so.xunta.beans.RecommendCpBO;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.persist.C2uDao;
import so.xunta.server.CpChoiceService;
import so.xunta.server.CpShowingService;
import so.xunta.server.ResponseGroupCPsService;
import so.xunta.server.SocketService;
import so.xunta.server.UserService;

@WebSocketTypeAnnotation
@Component
public class RequestCpWSController {
	@Autowired
	private ResponseGroupCPsService responseGroupCPsService;
	@Autowired
	private SocketService socketService;
	@Autowired
	private CpShowingService cpShowingService;
	@Autowired
	private CpChoiceService cpChoiceService;
	@Autowired
	private C2uDao c2uDao;
	@Autowired
	private UserService userService;
	
	Logger logger =Logger.getLogger(RequestCpWSController.class);

	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1101-1")
	public void responseGroupCPs(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		int startPoint = Integer.valueOf(params.getInt("startpoint"));
		int howMany = Integer.valueOf(params.getInt("howmany"));
		String timestamp = params.getString("timestamp"); //以后再处理
		
		logger.info("用户："+userService.findUser(uid).getName()+"请求一组CP");
		
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
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1109-1")
	public void responseUserSelectedCPs(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		String userId = params.getString("userid");
		String property = params.getString("property");
		String timestamp = params.getString("timestamp"); 
		
		List<ConcernPointDO> userSelectedCps=cpChoiceService.getUserSelectedCps(Long.valueOf(userId),property);
		
		JSONArray cpArr = new JSONArray();
		for(ConcernPointDO userSelectedCp:userSelectedCps){
			String cpId = userSelectedCp.getId().toString();
			JSONObject cpJson = new JSONObject();
			cpJson.put("cpid", cpId);
			cpJson.put("cptext", userSelectedCp.getText());
			cpJson.put("selected_user_num",c2uDao.getHowManyPeopleSelected(cpId, property).toString());
			cpArr.put(cpJson);
		}
		
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1109-2");
		returnJson.put("cp_arr", cpArr);
		returnJson.put("timestamp", timestamp);
		socketService.chat2one(session, returnJson);
	}
}

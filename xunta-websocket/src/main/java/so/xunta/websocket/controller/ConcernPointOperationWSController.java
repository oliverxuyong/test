package so.xunta.websocket.controller;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.CpChoiceDetailDO;
import so.xunta.beans.RecommendCpBO;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.persist.CpChoiceDetailDao;
import so.xunta.server.CancelOneSelectedCP;
import so.xunta.server.ResponseGroupCPsService;
import so.xunta.server.SelectOneNewCPService;
import so.xunta.server.SocketService;

/**
 * @author Bright_zheng
 * */
@WebSocketTypeAnnotation
@Component
public class ConcernPointOperationWSController {
	
	@Autowired
	private SocketService socketService;
	@Autowired
	private ResponseGroupCPsService responseGroupCPsService;
	@Autowired
	private SelectOneNewCPService selectOneNewCPService;
	@Autowired
	private CancelOneSelectedCP cancelOneSelectedCP;
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1101-1")
	public void responseGroupCPs(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		int startPoint = Integer.valueOf(params.getInt("startpoint"));
		int howMany = Integer.valueOf(params.getInt("howmany"));
		String timestamp = params.getString("timestamp"); //以后再处理
		
		List<RecommendCpBO> cps = responseGroupCPsService.getRecommendCPs(uid, startPoint, howMany);
		
		JSONArray cpWrap = new JSONArray();
		for(RecommendCpBO cp:cps){
			JSONObject cpjson = new JSONObject();
			cpjson.put("cpid", cp.getCpId());
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
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1102-1")
	public void selectOneNewCP(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		BigInteger cpid = BigInteger.valueOf(Long.valueOf(params.getString("cpid")));
		String timestamp = params.getString("timestamp");
		CpChoiceDetailDO cpChoiceDetailDO = new CpChoiceDetailDO();
		cpChoiceDetailDO.setUser_id(uid);
		cpChoiceDetailDO.setCp_id(cpid);
		cpChoiceDetailDO.setIs_selected(CpChoiceDetailDao.SELECTED);
		cpChoiceDetailDO.setCreate_time(new Timestamp(System.currentTimeMillis()));

		cpChoiceDetailDO = selectOneNewCPService.addNewCP(cpChoiceDetailDO);
		
		if(cpChoiceDetailDO !=null){
			JSONObject returnJson = new JSONObject();
			returnJson.put("_interface", "1102-2");
			returnJson.put("is_success", "true");
			returnJson.put("timestamp", timestamp);
			socketService.chat2one(session, returnJson);
		}	
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1103-1")
	public void cancelOneSelectedCP(WebSocketSession session, TextMessage message){
		JSONObject params=new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		BigInteger cpid = BigInteger.valueOf(Long.valueOf(params.getString("cpid")));
		String timestamp = params.getString("timestamp");
		CpChoiceDetailDO cpChoiceDetailDO = new CpChoiceDetailDO();
		cpChoiceDetailDO.setUser_id(uid);
		cpChoiceDetailDO.setCp_id(cpid);
		cpChoiceDetailDO.setIs_selected(CpChoiceDetailDao.UNSELECTED);
		cpChoiceDetailDO.setCreate_time(new Timestamp(System.currentTimeMillis()));
		
		cpChoiceDetailDO = cancelOneSelectedCP.deleteSelectedCP(cpChoiceDetailDO);
		
		if(cpChoiceDetailDO !=null){
			JSONObject returnJson = new JSONObject();
			returnJson.put("_interface", "1103-2");
			returnJson.put("is_success", "true");
			returnJson.put("timestamp", timestamp);
			socketService.chat2one(session, returnJson);
		}	
	}
	
}

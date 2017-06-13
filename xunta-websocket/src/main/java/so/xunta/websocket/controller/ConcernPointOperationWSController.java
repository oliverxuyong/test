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

import so.xunta.beans.ConcernPointDO;
import so.xunta.beans.CpChoiceDetailDO;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.server.ConcernPointService;
import so.xunta.server.CpChoiceDetailService;
import so.xunta.server.SocketService;

/**
 * @author Bright_zheng
 * */
@WebSocketTypeAnnotation
@Component
public class ConcernPointOperationWSController {
	@Autowired
	private ConcernPointService concernPointService;
	@Autowired
	private CpChoiceDetailService cpChoiceDetailService;
	@Autowired
	private SocketService socketService;
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1101-1")
	public void responseGroupCPs(WebSocketSession session, TextMessage message){
		JSONObject params=new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		int startPoint = Integer.valueOf(params.getInt("startpoint"));
		int howMany = Integer.valueOf(params.getInt("howmany"));
		String timestamp=params.getString("timestamp");
		List<ConcernPointDO> cps = concernPointService.listConcernPointsByCreator(1L, startPoint, howMany);
		JSONArray cpWrap=new JSONArray();
		for(ConcernPointDO cp:cps){
			JSONObject cpjson=new JSONObject();
			cpjson.put("cpid", cp.getId()+"");
			cpjson.put("cptext", cp.getText());
			cpjson.put("ifselectedbyme", "no");
			cpjson.put("howmanypeople_selected", 0+"");
			cpWrap.put(cpjson);
		}
		JSONObject returnJson=new JSONObject();
		returnJson.put("_interface", "1101-2");
		returnJson.put("uid", uid);
		returnJson.put("startpoint", startPoint);
		returnJson.put("howmany", howMany);
		returnJson.put("timestamp", timestamp);
		returnJson.put("cp_wrap", cpWrap);
		socketService.chat2one(session, returnJson);
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1102-1")
	public void selectedCPHandle(WebSocketSession session, TextMessage message){
		JSONObject params=new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		BigInteger cpid = BigInteger.valueOf(Long.valueOf(params.getString("cpid")));
		String timestamp=params.getString("timestamp");
		CpChoiceDetailDO cpChoiceDetailDO=new CpChoiceDetailDO();
		cpChoiceDetailDO.setUser_id(uid);
		cpChoiceDetailDO.setCp_id(cpid);
		cpChoiceDetailDO.setIs_selected("Y");
		cpChoiceDetailDO.setCreate_time(new Timestamp(System.currentTimeMillis()));
		cpChoiceDetailDO = cpChoiceDetailService.saveCpChoiceDetail(cpChoiceDetailDO);
		if(cpChoiceDetailDO !=null){
			JSONObject returnJson=new JSONObject();
			returnJson.put("_interface", "1102-2");
			returnJson.put("is_success", "true");
			returnJson.put("timestamp", timestamp);
			socketService.chat2one(session, returnJson);
		}	
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1103-1")
	public void unSelectedCPHandle(WebSocketSession session, TextMessage message){
		JSONObject params=new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		BigInteger cpid = BigInteger.valueOf(Long.valueOf(params.getString("cpid")));
		String timestamp=params.getString("timestamp");
		CpChoiceDetailDO cpChoiceDetailDO=new CpChoiceDetailDO();
		cpChoiceDetailDO.setUser_id(uid);
		cpChoiceDetailDO.setCp_id(cpid);
		cpChoiceDetailDO.setIs_selected("N");
		cpChoiceDetailDO.setCreate_time(new Timestamp(System.currentTimeMillis()));
		cpChoiceDetailDO = cpChoiceDetailService.saveCpChoiceDetail(cpChoiceDetailDO);
		if(cpChoiceDetailDO !=null){
			JSONObject returnJson=new JSONObject();
			returnJson.put("_interface", "1103-2");
			returnJson.put("is_success", "true");
			returnJson.put("timestamp", timestamp);
			socketService.chat2one(session, returnJson);
		}	
	}
	
}

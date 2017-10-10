package so.xunta.websocket.controller;

import java.math.BigInteger;
import java.sql.Timestamp;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.CpChoiceDO;
import so.xunta.beans.CpChoiceDetailDO;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.persist.CpChoiceDetailDao;
import so.xunta.server.CpChoiceDetailService;
import so.xunta.server.CpChoiceService;
import so.xunta.server.CpShowingService;
import so.xunta.server.RecommendPushService;
import so.xunta.server.RecommendService;
import so.xunta.server.SocketService;
import so.xunta.websocket.task.CpOperationPushTask;
import so.xunta.websocket.utils.RecommendTaskPool;

/**
 * @author Bright_zheng
 * */
@WebSocketTypeAnnotation
@Component
public class CpOperationWSController {
	@Autowired
	private SocketService socketService;
	@Autowired
	private CpChoiceService cpChoiceService;
	@Autowired
	private CpChoiceDetailService cpChoiceDetailService;
	@Autowired
	private RecommendTaskPool recommendTaskPool;
	@Autowired
	private RecommendService recommendService;
	@Autowired
	private RecommendPushService recommendPushService;
	@Autowired
	private CpShowingService cpShowingService;
	
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1102-1")
	public void selectOneCP(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		BigInteger cpid = BigInteger.valueOf(Long.valueOf(params.getString("cpid")));
		String timestamp = params.getString("timestamp");
		//2017.08.08 叶夷  前端请求的接口加上标签文字,为了返回数据里面需要text
		String text=params.getString("cptext");
		String property = params.getString("property");
		if(!(property.equals(RecommendService.POSITIVE_SELECT) || property.equals(RecommendService.NEGATIVE_SELECT))){
			property = RecommendService.POSITIVE_SELECT;
		}
		
		CpChoiceDetailDO cpChoiceDetailDO = cpOperateAction(uid, cpid, CpChoiceDetailDao.SELECTED,property);
		
		if(cpChoiceDetailDO !=null){
			JSONObject returnJson = new JSONObject();
			returnJson.put("_interface", "1102-2");
			returnJson.put("is_success", "true");
			//2017.08.08 叶夷  在选中标签时返回的数据中加上cpid
			returnJson.put("cpid", cpid+"");
			returnJson.put("cptext", text);
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
		String property = params.getString("property");
		if(!(property.equals(RecommendService.POSITIVE_SELECT) || property.equals(RecommendService.NEGATIVE_SELECT))){
			property = RecommendService.POSITIVE_SELECT;
		}
		
		CpChoiceDetailDO cpChoiceDetailDO = cpOperateAction(uid, cpid, CpChoiceDetailDao.UNSELECTED,property);
		
		if(cpChoiceDetailDO !=null){
			JSONObject returnJson = new JSONObject();
			returnJson.put("_interface", "1103-2");
			returnJson.put("is_success", "true");
			//2017.08.08 叶夷  在选中标签时返回的数据中加上cpid
			returnJson.put("cpid", cpid+"");
			returnJson.put("timestamp", timestamp);
			socketService.chat2one(session, returnJson);
		}	
	}
	
/**2017.08.11 叶夷  通过uid和cpid判断cp是否已经被选择*/
	@WebSocketMethodAnnotation(ws_interface_mapping = "1107-1")
	public void ifCPSelected(WebSocketSession session, TextMessage message){
		JSONObject params=new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		BigInteger cpid = BigInteger.valueOf(Long.valueOf(params.getString("cpid")));
		String timestamp = params.getString("timestamp");
		
		CpChoiceDO cpChoiceDO = cpChoiceService.getCpChoice(uid, cpid);
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1107-2");
		if(cpChoiceDO==null){//这是没有被选择的cp
			returnJson.put("is_select", "false");
		}else{
			returnJson.put("is_select", "true");
		}
		returnJson.put("cpid", cpid+"");
		returnJson.put("uid", uid+"");
		returnJson.put("timestamp", timestamp);
		socketService.chat2one(session, returnJson);
	}
	
	private CpChoiceDetailDO cpOperateAction(Long uid, BigInteger cpid, String selectType, String property){
		CpChoiceDetailDO cpChoiceDetailDO = new CpChoiceDetailDO();
		cpChoiceDetailDO.setUser_id(uid);
		cpChoiceDetailDO.setCp_id(cpid);
		cpChoiceDetailDO.setIs_selected(selectType);
		cpChoiceDetailDO.setProperty(property);
		cpChoiceDetailDO.setCreate_time(new Timestamp(System.currentTimeMillis()));

		cpChoiceDetailDO = cpChoiceDetailService.saveCpChoiceDetail(cpChoiceDetailDO);
		
		int selectTypeRec;
		if(selectType.equals(CpChoiceDetailDao.SELECTED)){
			selectTypeRec = RecommendService.SELECT_CP;
		}else{
			selectTypeRec = RecommendService.UNSELECT_CP;
		}
		CpOperationPushTask cpOperationPushTask = new CpOperationPushTask(recommendService,recommendPushService,cpShowingService,uid+"",cpid+"",selectTypeRec,property,socketService);
		recommendTaskPool.execute(cpOperationPushTask);
		return cpChoiceDetailDO;
	}
}
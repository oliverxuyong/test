package so.xunta.websocket.controller;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import so.xunta.beans.ConcernPointDO;
import so.xunta.beans.CpChoiceDO;
import so.xunta.beans.CpChoiceDetailDO;
import so.xunta.beans.User;
import so.xunta.beans.annotation.WebSocketMethodAnnotation;
import so.xunta.beans.annotation.WebSocketTypeAnnotation;
import so.xunta.persist.CpChoiceDetailDao;
import so.xunta.server.ConcernPointService;
import so.xunta.server.CpChoiceDetailService;
import so.xunta.server.CpChoiceService;
import so.xunta.server.CpShowingService;
import so.xunta.server.EventScopeCpTypeMappingService;
import so.xunta.server.LoggerService;
import so.xunta.server.RecommendPushService;
import so.xunta.server.RecommendService;
import so.xunta.server.SocketService;
import so.xunta.server.UserService;
import so.xunta.websocket.config.Constants;
import so.xunta.websocket.task.CpOperationPushTask;
import so.xunta.websocket.task.SelfAddCpRecommendTask;
import so.xunta.websocket.utils.RecommendTaskPool;

/**
 * @author Bright_zheng
 * */
@WebSocketTypeAnnotation
@Component
public class CpOperationWSController {
	
	private final BigDecimal USER_ADD_CP_WEIGHT=new BigDecimal(5.0);
	
	@Autowired
	private SocketService socketService;
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
	@Autowired
	private ConcernPointService concernPointService;
	@Autowired
	private CpChoiceService cpChoiceService;
	@Autowired
	private LoggerService loggerService;
	@Autowired
	private UserService userService;
	@Autowired
	private EventScopeCpTypeMappingService eventScopeCpTypeMappingService;
	
	Logger logger =Logger.getLogger(CpOperationWSController.class);
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1102-1")
	public void selectOneCP(WebSocketSession session, TextMessage message){
		JSONObject params = new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		BigInteger cpid = BigInteger.valueOf(Long.valueOf(params.getString("cpid")));
		String timestamp = params.getString("timestamp");
		//2017.08.08 叶夷  前端请求的接口加上标签文字,为了返回数据里面需要text
		String text=params.getString("cptext");
		String property = params.getString("property");
		
		logger.info("用户："+userService.findUser(uid).getName()+"添加了CP："+text);
		
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1102-2");
		
		if(!(property.equals(RecommendService.POSITIVE_SELECT) || property.equals(RecommendService.NEGATIVE_SELECT))){
			property = RecommendService.POSITIVE_SELECT;
		}
		
		CpChoiceDetailDO cpChoiceDetailDO = cpOperateAction(uid, cpid, CpChoiceDetailDao.SELECTED,property);

		
		if(cpChoiceDetailDO !=null){
			returnJson.put("is_success", "true");
		}else{
			returnJson.put("is_success", "false");
			returnJson.put("error_msg", "您已添加过啦");
		}
		//2017.08.08 叶夷  在选中标签时返回的数据中加上cpid
		returnJson.put("cpid", cpid+"");
		returnJson.put("cptext", text);
		returnJson.put("timestamp", timestamp);
		socketService.chat2one(session, returnJson);
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1103-1")
	public void cancelOneSelectedCP(WebSocketSession session, TextMessage message){

		
		JSONObject params=new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		BigInteger cpid = BigInteger.valueOf(Long.valueOf(params.getString("cpid")));
		String timestamp = params.getString("timestamp");
		String property = params.getString("property");
		
		logger.info("用户"+userService.findUser(uid).getName()+"取消了CP："+concernPointService.getConcernPointById(cpid).getText());
		
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1103-2");
		
		if(!(property.equals(RecommendService.POSITIVE_SELECT) || property.equals(RecommendService.NEGATIVE_SELECT))){
			property = RecommendService.POSITIVE_SELECT;
		}
		
		CpChoiceDetailDO cpChoiceDetailDO = cpOperateAction(uid, cpid, CpChoiceDetailDao.UNSELECTED,property);
		
		if(cpChoiceDetailDO !=null){		
			returnJson.put("is_success", "true");
		}else{
			returnJson.put("is_success", "false");
			returnJson.put("error_msg", "您还没有选择过呢");
		}
		//2017.08.08 叶夷  在选中标签时返回的数据中加上cpid
		returnJson.put("cpid", cpid+"");
		returnJson.put("timestamp", timestamp);
		socketService.chat2one(session, returnJson);
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "1108-1")
	public void addSelfCp(WebSocketSession session, TextMessage message){	
		JSONObject params=new JSONObject(message.getPayload());
		Long uid = Long.valueOf(params.getString("uid"));
		String cpText = params.getString("cptext");
		String timestamp = params.getString("timestamp");
		BigInteger cpId = null;
		/*if(!params.isNull("cpid")){
			cpId = new BigInteger(params.getString("cpid"));
		}*/
		
		User u = userService.findUser(uid);
		String userEventScope = u.getEvent_scope();
		//String basicType= userEventScope.split("_")[0];
		
		logger.info("用户"+u.getName()+"添加了自己的CP:"+cpText);
		
		JSONObject returnJson = new JSONObject();
		returnJson.put("_interface", "1108-2");
		String returnMsg;
		
		ConcernPointDO concernPointDO = new ConcernPointDO();
		concernPointDO.setCreator_uid(uid);
		concernPointDO.setText(cpText);
		concernPointDO.setWeight(USER_ADD_CP_WEIGHT);
		concernPointDO.setType(userEventScope);
		Timestamp time = new Timestamp(System.currentTimeMillis());
		concernPointDO.setCreate_time(time);
		concernPointDO.setModified_time(time);
		
		Boolean ifSelfAddCp=true; 
		
		try {
			concernPointDO = concernPointService.saveConcernPoint(concernPointDO);
			cpId = concernPointDO.getId();
			returnMsg="新增标签并选中";
		} catch (DuplicateKeyException e) {
			returnMsg="标签已存在，直接选中";
			ifSelfAddCp=false;
			concernPointDO = concernPointService.getConcernPointByText(cpText);
			cpId = concernPointDO.getId();
			String oldType = concernPointDO.getType();
			
			/*
			 * 如果一个用户添加了一个非本scope对应type的CP，
			 * 1.将该cp的type更新
			 * 2.查看更新后的type是否存在于本scope的mapping中
			 * 		如果存在，则不做修改
			 *  	不存在，则为本scope添加，并为原先包含旧type的scope也添加
			 * */
			List<String> userCpTypes = eventScopeCpTypeMappingService.getCpType(userEventScope);
			
			List<String> otherImpactScopes = eventScopeCpTypeMappingService.getEventScope(oldType);
			otherImpactScopes.remove(userEventScope);
			
			if(!userCpTypes.contains(oldType)){
				String newType = oldType+"_"+userEventScope ;
				concernPointDO.setType(newType);
				concernPointService.updateConcernPoint(concernPointDO);
				if(!userCpTypes.contains(newType)){
					eventScopeCpTypeMappingService.setEventScopeCpTypeMapping(userEventScope, newType);
					for(String otherImpactScope:otherImpactScopes){
						eventScopeCpTypeMappingService.setEventScopeCpTypeMapping(otherImpactScope, newType);
					}
				}
			}
			/*if(cpId==null){
				
			}*/
		} finally{
			CpChoiceDetailDO cpChoiceDetailDO = cpOperateAction(uid,cpId,CpChoiceDetailDao.SELECTED,RecommendService.POSITIVE_SELECT);
		
			if(ifSelfAddCp){
				SelfAddCpRecommendTask selfAddCpRecommendTask = new SelfAddCpRecommendTask(cpId.toString(),userEventScope,recommendService);
				recommendTaskPool.execute(selfAddCpRecommendTask);
			}
			
			if(cpChoiceDetailDO !=null){		
				returnJson.put("is_success", "true");
			}else{
				returnJson.put("is_success", "false");
				returnJson.put("error_msg", "您已添加过啦");
			}
		}

		returnJson.put("cpid",cpId.toString());
		returnJson.put("cptext",cpText);
		returnJson.put("message",returnMsg);
		returnJson.put("timestamp", timestamp);
		socketService.chat2one(session, returnJson);
	}
	
	@WebSocketMethodAnnotation(ws_interface_mapping = "9108-1")
	public void wantAddSelfCp(WebSocketSession session, TextMessage message){
		Long userId = Long.valueOf(session.getAttributes().get(Constants.WEBSOCKET_USERNAME).toString());
		logger.info("用户"+userService.findUser(userId).getName()+"点击了添加自己CP按钮");
	}
	
	private CpChoiceDetailDO cpOperateAction(Long uid, BigInteger cpid, String selectType, String property){
		CpChoiceDetailDO cpChoiceDetailDO = new CpChoiceDetailDO();
		cpChoiceDetailDO.setUser_id(uid);
		cpChoiceDetailDO.setCp_id(cpid);
		cpChoiceDetailDO.setIs_selected(selectType);
		cpChoiceDetailDO.setProperty(property);
		cpChoiceDetailDO.setCreate_time(new Timestamp(System.currentTimeMillis()));

		CpChoiceDO cpChoiceDO = cpChoiceService.getCpChoice(uid,cpid);
		/*如果是选择，数据库里应该无记录，如果是取消，数据库里应该有记录
		 * */
		if(selectType.equals(CpChoiceDetailDao.SELECTED)){
			if(cpChoiceDO==null){
				//System.out.println("添加前为空"+cpChoiceDO);
				cpChoiceDetailDO = cpChoiceDetailService.saveCpChoiceDetail(cpChoiceDetailDO);
				List<String> cpIds = new ArrayList<String>();
				cpIds.add(cpid+"");
				recommendService.signCpsPresented(uid+"", cpIds);
				if(property.equals(RecommendService.NEGATIVE_SELECT)){
					cpShowingService.deleteUserShowingCp(uid+"", cpid+"");
				}
			}else{
				return null;
			}	
		}else{
			if(cpChoiceDO!=null){
				cpChoiceDetailDO = cpChoiceDetailService.saveCpChoiceDetail(cpChoiceDetailDO);
			}else{
				return null;
			}	
		}
		
		int selectTypeRec;
		if(selectType.equals(CpChoiceDetailDao.SELECTED)){
			selectTypeRec = RecommendService.SELECT_CP;
		}else{
			selectTypeRec = RecommendService.UNSELECT_CP;
		}
		CpOperationPushTask cpOperationPushTask = new CpOperationPushTask(recommendService,recommendPushService,cpShowingService,uid+"",cpid+"",selectTypeRec,property,socketService,loggerService,userService);
		recommendTaskPool.execute(cpOperationPushTask);
		return cpChoiceDetailDO;
	}
	
	/*2017.08.11 叶夷  通过uid和cpid判断cp是否已经被选择
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
	}*/
}

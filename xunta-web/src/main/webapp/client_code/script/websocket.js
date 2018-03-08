var ws_obj = 'init';
//var ws_status = "null";
var firstMsgId;
//用来记录话题分页消息的界点，
var sort;
//用来记录获取消息分页的排序方式，第一次是升序，第二次是降序，这与显示消息有关
var currentMsgIdArray = new Array();

var requestMsgCounts;//它的值是从dialog.html里传过来的,然后供其它方法使用.
//记录客户端接受到的消息ID，用来查重，只记录即时会话消息，不记录获取历史消息
//json格式的用户信息
//function set_userId(userid) {
//	userId = userid;
//	console.log("12345");
//}

window.requestTopicNum = '20';//话题列表分页记录变量-一次获取的数量
var lastTopicTime = '-1';//话题列表分页记录变量-一次获取的时间节点

function set_lastTopicTime(lasttopictime) {
	lastTopicTime = lasttopictime;
}

var doRequestCP = false;
var requestCPNum; //每次请求话题数//这两个变量由mainpage在请求cp时传过来,在这里保存,供执行任务筐的任务时使用.xu
var currentRequestedCPPage; //这两个变量由mainpage在请求cp时传过来,在这里保存,供执行任务筐的任务时使用.xu


//请求话题列表的任务筐. xu9.9
var doRequestPostHist = new Array();
//请求历史滔滔息的任务筐.
var doSendPoster = new Array();
//发送消息的任务筐.角标用"话题id-临时pid"来识别. 内容存为json数据,里面存放请求相关数据.
var doRequestCreateNewTopic = new Array();
//请求创建新话题的任务筐;
var doRequestMoveToNewTopic = new Array();
//请求移动创建新话题的任务筐.json数据,存放请求相关数据.

/*
 var topicIndex = 0;//定义话题关系数据的角标  9.16 FANG 指定排到第几了.
 var topicIdArray = new Array();//创建话题和临时话题ID的对应关系  9.16 FANG
 var tempTopicIdArray = new Array();//创建话题和临时话题ID的对应关系  9.16 FANG
 */
var topicId2tmpTopicId = new Array();
//用于替代上面三个变量,效率会更高.角标为topicid,值为tmptopicid. xu 10.25

var tmptid2inputvalue = new Array();
//临时存放原始数据,供执行任务筐时使用.
var tmptid2tmppid = new Array();
//临时存放原始数据,供执行任务筐时使用.

var currentPageId = null;
//2017.09.11  叶夷   判断在一定时限内后端是否返回选择成功,id为cpid,判断是选择了哪个cp,value为true/false,判断这个cp是否选择成功
var checksendSelectedCPSuccessArray=new Array();


function initToGetCP(userId,requestNum,currentPage) {
	requestCPNum = requestNum;
	currentRequestedCPPage = currentPage;
	//$("#loadinganimation").css("display", "block");
	//$(".login_container").css("display", "none");
	doRequestCP = true;	//任务筐中登记.
	//先添加响应任务,同时作为请求进行中的状态标志.
	console.log("initToGetCP...userId=" + userId);
	//$("#loadinganimation").click(initToGetTopicList(userId));//有时该方法会在请求失败时点击拖拉机来调用,所以这里先取消点击事件.
	if (checkIfWSOnline4topiclist()) {//如果ws处于连接状态,直接发出请求. 如果没有连接,该方法会发出创建请求.
		requestCP();
	}
	/*
	if (lastTopicTime == '-1') {//如果是第一次请求,需要返回到index.html里执行一次打开页面的操作.
		initOpenMainPage();//该方法在index.html里.xu
	} else {//如果话题列表页已经打开,则直接将数据显示出来:
		//exec('showTopicList','topics_page',evnt.data);
		exec("main_page","showCP()");
		//document.getElementById("topics_page").contentWindow.showTopicList(evnt.data);
	}
	*/
}

function task_RequestCP() {//检查并执行话题列表请求任务.
	if (doRequestCP) {//检查并执行 请求话题列表的任务.xu9.9
		console.log("CP请求任务为true,现在执行请求...");
		requestCP();
	}
}

function requestCP(){//请一组CP.首次请求页号设为1.
	console.log("真正请求一组CP:,userId="+userId+" 请求数量="+requestCPNum+" 请求的页面="+currentRequestedCPPage+" 时间="+new Date());
	var json_obj = {
			 _interface:"1101-1",
			 interface_name: "requestCP",
			 uid:userId,
			 startpoint: currentRequestedCPPage,
			 howmany:requestCPNum,//每次请求多少个标签
			 timestamp:	"",//暂时无用.
		};
	WS_Send(json_obj);
}

//叶夷   2017.06.16 发送"标签选中"
function sendSelectedCP(userId,cpid,text, property,isPushCP){
	var json_obj;
	if(isPushCP=="true"){
		json_obj = {
				 _interface:"1102-1",
				 interface_name: "sendSelectedCP",
				 uid:userId.toString(),
				 cpid:cpid.toString(),
				 cptext:text,
				 property:  property,
				 isPushCP:isPushCP.toString(),
				 timestamp:"",
			};
	}else{
		json_obj = {
				 _interface:"1102-1",
				 interface_name: "sendSelectedCP",
				 uid:userId.toString(),
				 cpid:cpid.toString(),
				 cptext:text,
				 property:  property,
				 timestamp:"",
			};
	}
	
	//console.log("测试 3： "+typeof(userId));
	if (checkIfWSOnline4topiclist()) {//如果ws处于连接状态,直接发出请求. 如果没有连接,该方法会发出创建请求.
		console.log("标签选中:userId="+userId+" 选中的cpid="+cpid+" 时间="+new Date());
		WS_Send(json_obj);
	}
	checksendSelectedCPSuccessArray[cpid]=false;
	//2017.09.11  叶夷   判断在一定时限内后端是否返回选择成功
	setTimeout("checksendSelectedCPSuccess('"+cpid+"','"+text+"')", 3000);
}
/**
 * 2017.09.11  叶夷   判断在一定时限内后端是否返回选择成功
 */
function checksendSelectedCPSuccess(cpid,text){
	var checksendSelectedCPSuccess=checksendSelectedCPSuccessArray[cpid];
	if (checksendSelectedCPSuccess) {
		console.log("checksendSelectedCPSuccess 成功了,不作为");
	} else {//加上感叹号,并绑定点击再请求的事件:
		console.log("checksendSelectedCPSuccess 失败, "+text+"加上感叹号.");
		var script="sendSelectedCPFail('"+cpid+"','"+text+"')";
		exec("main_page",script);
	}
}

//叶夷   2017.06.16  发送"标签选中取消"
function sendUnselectedCP(userId,cpid){
	if (checkIfWSOnline4topiclist()) {//如果ws处于连接状态,直接发出请求. 如果没有连接,该方法会发出创建请求.
		console.log("标签选中取消:userId="+userId+" 选中取消的cpid="+cpid+" 时间="+new Date());
		var json_obj = {
			 _interface:"1103-1",
			 interface_name: "sendUnselectedCP",
			 uid:userId.toString(),
			 cpid:cpid.toString(),
			 property: "P",
			 timestamp:"",
		};
		WS_Send(json_obj);
	}
}

//叶夷   2017.07.07  请求用户匹配缩略表
function requestMatchedUsers(userId,requestTopMUNum){
	if (checkIfWSOnline4topiclist()) {//如果ws处于连接状态,直接发出请求. 如果没有连接,该方法会发出创建请求.
		console.log("请求用户匹配:userId="+userId+" 请求的数量requestTopMUNum="+requestTopMUNum+" 时间="+new Date());
		var json_obj = {
			 _interface:"1104-1",
			 interface_name: "requestTopMatchedUsers",
			 uid:userId.toString(),
			 top_num:requestTopMUNum.toString(),
			 timestamp:"",
		};
		WS_Send(json_obj);
	}
}

//2017.10.13 叶夷  添加标签
function add_self_cp(uid,cpid,cptext){
	var json_obj;
	if(cpid=="null" || cpid=="undefined"){
		json_obj = {
				 _interface:"1108-1",
				 interface_name: "add_self_cp",
				 uid:uid.toString(),
				 cptext:cptext.toString(),
				 timestamp:"",
			};
	}else{
		json_obj = {
				 _interface:"1108-1",
				 interface_name: "add_self_cp",
				 uid:uid.toString(),
				 cpid:cpid,
				 cptext:cptext.toString(),
				 timestamp:"",
			};
	}
	if (checkIfWSOnline4topiclist()) {//如果ws处于连接状态,直接发出请求. 如果没有连接,该方法会发出创建请求.
		console.log("添加标签:userId="+userId+" 添加的标签="+cptext+" 时间="+new Date());
		WS_Send(json_obj);
	}
}
/*//2017.08.11 叶夷    判断这个标签是否被选中过
function sendIfSelectedCP(userId,cpid){
	if (checkIfWSOnline4topiclist()) {//如果ws处于连接状态,直接发出请求. 如果没有连接,该方法会发出创建请求.
		//console.log("请求用户匹配:userId="+userId+" 请求的数量requestTopMUNum="+requestTopMUNum);
		var json_obj = {
			 _interface:"1107-1",
			 interface_name: "sendIfSelectedCP",
			 uid:userId.toString(),
			 cpid:cpid.toString(),
			 timestamp:""
		};
		WS_Send(json_obj);
	}
}*/

//2017.10.20 叶夷 用户请求自己选择的CP
function request_user_selected_cp(userId){
	if (checkIfWSOnline4topiclist()) {//如果ws处于连接状态,直接发出请求. 如果没有连接,该方法会发出创建请求.
		console.log("用户请求自己选择的CP:userId="+userId);
		var json_obj = {
			 _interface:"1109-1",
			 interface_name: "request_user_selected_cp",
			 userid:userId.toString(),
			 property: "P",
			 timestamp:""
		};
		WS_Send(json_obj);
	}
}

//为了测试websocket并发,请求一批userid
function requestUserIds(){
	if (checkIfWSOnline4topiclist()) {//如果ws处于连接状态,直接发出请求. 如果没有连接,该方法会发出创建请求.
		console.log("请求用户id");
		var json_obj = {
			 _interface:"9101-1",
		};
		WS_Send(json_obj);
	}
}
//2017.11.07 叶夷  用户打开聊天页则发一个接口给后台
function request_openDialogPage(userId , toUserId){
	if (checkIfWSOnline4topiclist()) {//如果ws处于连接状态,直接发出请求. 如果没有连接,该方法会发出创建请求.
		console.log("用户打开聊天页则发一个接口给后台:userId="+userId);
		var json_obj = {
			 _interface:"1110-1",
			 interface_name: "request_openDialogPage",
			 userid:userId.toString(),
			 toUserId: toUserId.toString(),
			 timestamp:""
		};
		WS_Send(json_obj);
	}
}
//2017.11.09 叶夷  只要点击一次添加标签按钮则发送一个接口给后台
function sendClickAddTagMsg(){
	if (checkIfWSOnline4topiclist()) {//如果ws处于连接状态,直接发出请求. 如果没有连接,该方法会发出创建请求.
		console.log("只要点击一次添加标签按钮则发送一个接口给后台");
		var json_obj = {
			 _interface:"9108-1"
		};
		WS_Send(json_obj);
	}
}
//2017.11.23 叶夷 请求服务器更改昵称
function requestAlterNickname(userinfo) {
    var userinfoJSON = userinfo;
	var json_obj = {
		_interface : "update_nickname",
		uid : userinfoJSON.uid,
		new_name : userinfoJSON.newNickname
	};
	WS_Send(json_obj);
}

//2017.12.13 请求详细匹配人列表
function requestDetailMatchedUsers(userId , requestCounts) {
	var json_obj = {
		_interface : "1111-1",
		interface_name : "request_detail_matched_users",
		uid : userId.toString(),
		request_counts : requestCounts.toString(),
		timestamp:""
	};
	WS_Send(json_obj);
}

//2017.12.27 叶夷  用户请求指定cp匹配的用户
function requestUserCpMatchUsers(userId,myTagIds,requestCounts){
	var a=myTagIds.split('-');//将字符串转化为数组
	var json_obj = {
			_interface : "1113-1",
			interface_name : "request_user_cp_match_users",
			uid : userId.toString(),
			cp_ids:a,
			request_counts : requestCounts.toString(),
			timestamp:""
		};
		WS_Send(json_obj);
}

//2017.12.23 请求聊天页双方标签的数据
function requestMutualCP(userId , toUserid) {
	var json_obj = {
		_interface : "1112-1",
		interface_name : "request_detail_matched_users",
		my_user_id : userId.toString(),
		matched_user_id : toUserid.toString(),
		timestamp:""
	};
	WS_Send(json_obj);
}

//2018.03.08  叶夷    通过请求请求服务器判断是否出现引导页
function ifUserInited(userId) {
	var json_obj = {
		_interface : "1114-1",
		interface_name : "if_user_inited",
		my_user_id : userId.toString(),
		timestamp:""
	};
	WS_Send(json_obj);
}

function tasksOnWired() {//ws连接事件的响应执行方法:
	console.log("网络通了,现在执行任务筐.");
	task_RequestCP();
	//检查并执行话题列表请求任务.

}

function showSetupInfo(eventdata) {
	var jsonObj = JSON.parse(eventdata);
	var pagename = getTmpTopicIdIfExisted(jsonObj.topicid);
	if (pagename == jsonObj.topicid) {
		logging("出错消息,用于发现潜在的代码错误. 一般用户不必理会.(新话题成功后的后续通知消息没有找到临时页面的tmptopicid.可能有网络不稳定使成功创建消息晚于该后续消息.也可能是断网期间用户关闭了创建页.)");
	}
	console.log("showSetupInfo() - pagename=" + pagename);
	console.log(jsonObj.private + "|||" + jsonObj.suspend);
	exec(pagename, "showSetupBox(" + eventdata + ")");
}


function getSetupInfo(topicId) {
	console.log("getSetupInfo 发了. topicId=" + topicId);
	var json_obj = {
		_interface : "get_topicsetup",
		topicid : topicId
	};
	WS_Send(json_obj);
}

function setSetupInfo(topicId, boolean_private, suspend) {
	console.log("setSetupInfo 发了. private=" + boolean_private + "|suspend=" + suspend);
	//alert("本话题的新设置已经提交. 成功后应该收到一条通知消息.");
	var json_obj = {
		_interface : "set_topicsetup",
		topicid : topicId,
		private : boolean_private,
		suspend : suspend
	};
	WS_Send(json_obj);
}



function setCurrentPageId(value) {
	currentPageId = value;
	console.log("set currentPageId=" + currentPageId);
}

function clearCurrentPageId() { //由于null无法通过参数传递,专设一个clear方法:
	currentPageId = null;
	console.log("clear currentPageId=" + currentPageId);
}

/**
 *	关闭指定的聊天框页面Name
 *  */
function closeTmpWin(tmpPageName) {
	setTimeout(function() {
		api.closeWin({
			name : tmpPageName
		});
	}, 1500);
}


function WS_Send(json_obj) {//抽出这个通用发送方法,发送前都检查ws对象的有效性,防止报错.xu11.18
	if (checkIfWSOnline()) {
		ws_obj.send(JSON.stringify(json_obj));
		logging("执行WS发送.接口:" + json_obj._interface);
		console.log("执行WS发送.接口:" + json_obj._interface);
	}
}

function checkMessageInterface(evnt) {
	var jsonObj = JSON.parse(evnt.data);
	//把字符串转换成json对象.
	console.log("收到消息,类型=" + jsonObj._interface);
	console.log("消息内容:" + JSON.stringify(jsonObj).substring(0,150)+"...(只显示150个字符)");
	logging("收到消息,类型=" + jsonObj._interface);
	console.log("返回时间="+new Date());
	if(jsonObj._interface == '1101-2'){
		console.log(JSON.stringify(jsonObj.cp_wrap));
		
		//叶夷 2017.06.15  获得数据之后将数据显示在页面上
		exec("main_page","responseToCPRequest("+evnt.data+")");
	}
	
	//叶夷 2017.06.16    发送"标签选中"
	if(jsonObj._interface == '1102-2'){
		console.log("发送'标签选中' :"+JSON.stringify(jsonObj.is_success));
		if(JSON.stringify(jsonObj.is_success)=='"true"'){
			//标签选中之后将结果返回判断是否成功
			var cpid=jsonObj.cpid;
			checksendSelectedCPSuccessArray[cpid]=true;
			exec("main_page","myTagAgainBindingClick('"+cpid+"')");
		}
	}
	
	//叶夷 2017.06.16    发送"标签选中取消"
	if(jsonObj._interface == '1103-2'){
		console.log("发送'标签选中取消' :"+JSON.stringify(jsonObj.is_success));
		if(JSON.stringify(jsonObj.is_success)=='"true"'){
			//标签选中之后将结果返回判断是否成功
			exec("main_page","showUnSelectCP("+evnt.data+")");
		}else{
			toast_popup("取消选中标签失败",2500);
		}
	}
	
	//叶夷 2017.07.07   获得请求的用户匹配缩略表
	if(jsonObj._interface == '1104-2'){
		console.log("获得请求的用户匹配缩略表 :"+JSON.stringify(jsonObj.matched_user_arr));
		exec("main_page","responseTopMatchedUsers("+evnt.data+")");
	}
	
	//叶夷 2017.07.07   匹配用户改变
	if(jsonObj._interface == '2106-1'){
		console.log("匹配用户改变时后台发送的用户匹配列表:"+JSON.stringify(jsonObj.new_user_arr));
		exec("main_page","push_matched_user("+evnt.data+")");
	}
	
	/*//2017.08.11 叶夷    判断这个标签是否被选中过
	if(jsonObj._interface == '1107-2'){
		console.log("判断这个标签是否被选中过:"+JSON.stringify(jsonObj.is_select));
		exec("main_page","return_sendIfSelectedCP("+evnt.data+")");
	}*/
	
	//2017.10.13  叶夷  返回用户选择自己新增的cp
	if(jsonObj._interface == '1108-2'){
		console.log("新增cp:"+JSON.stringify(jsonObj.is_success));
		exec("main_page","return_add_self_cp("+evnt.data+")");
	}
	
	//2017.09.04 叶夷    CP推荐
	if(jsonObj._interface == '2105-1'){
		console.log("CP推荐:"+JSON.stringify(jsonObj.cp_wrap));
		exec("main_page","pushCP("+evnt.data+")");
	}
	
	//2017.10.11 叶夷   当前展示的cp中有用户新选中某个cp
	if(jsonObj._interface == '2107-1'){
		console.log("新选中的cp:"+JSON.stringify(jsonObj,cpid));
		exec("main_page","pushSelectCpPresent("+evnt.data+")");
	}
	
	//为了测试websocket并发,获得一批userids
	if(jsonObj._interface == '9101-2'){
		console.log("获得一批userids:"+JSON.stringify(jsonObj.uid_arr));
		exec("main_page","testWebSocket("+evnt.data+")");
	}
	
	//返回用户请求自己选择的CP
	if(jsonObj._interface == '1109-2'){
		console.log("返回自己选择的标签:"+JSON.stringify(jsonObj.cp_arr));
		exec("main_page","response_user_selected_cp("+evnt.data+")");
	}
	
	//2017.11.23 叶夷 更改昵称
	if (jsonObj._interface == 'update_nickname') {
		modifyNickname(jsonObj);
	}
	
	//2017.12.13 叶夷  返回用户请求的详细匹配列表
	if (jsonObj._interface == '1111-2') {
		console.log("返回用户请求的详细匹配列表:"+JSON.stringify(jsonObj.matched_user_arr));
		exec("matchUsers_page","response_detail_matched_users("+evnt.data+")");
	}
	//2017.12.23 叶夷  返回用户请求的聊天页的标签数据
	if (jsonObj._interface == '1112-2') {
		console.log("返回用户请求的聊天页的标签数据:"+JSON.stringify(jsonObj.msg));
		exec(jsonObj.matched_user_id,"responseMutualCP("+evnt.data+")");
	}
	//2017.12.27 叶夷  返回用户请求指定cp匹配的用户
	if (jsonObj._interface == '1113-2') {
		console.log("返回用户请求指定cp匹配的用户:"+JSON.stringify(jsonObj.cp_matched_user_arr));
		exec("matchUsers_page","responseUserCpMatchUsers("+evnt.data+")");
	}
	//2018.03.08  叶夷    通过请求请求服务器回复判断是否出现引导页
	if (jsonObj._interface == '1114-2') {
		console.log("返回是否出现引导页:"+JSON.stringify(jsonObj));
		exec("main_page","responseIfUserInited("+evnt.data+")");
	}
}


function browserOnlineOfflineEvent(){
	window.ononline = function(){
		console.log("响应window.ononline事件,执行createWebSocket(no).");
		toast("网络连接中断.");
		createWebSocket("no");//create时会豪饮查是否早已on了.
	}
	window.onoffline = function(){
		console.log("响应window.onoffline事件,执行closeWebSocket().");
		closeWebSocket();//close时会检查是否早已closed.
		toast("网络连接中断.");
	}
}

function websocketEvent() {
	ws_obj.onopen = function(evnt) {
		console.log("ws连接事件, 显示在线图标. |ws_obj=" + ws_obj + " |readyState=" + ws_obj.readyState);
		logging("ws连接事件, 显示在线图标. |ws_obj=" + ws_obj + " |readyState=" + ws_obj.readyState);
		if (topicsPageOpenMark == "yes") {//没有这个判断,启动时会报错.xu1113.
			exec("main_page", "showWebsocketStatus('ws_on')");
		}else{
			console.log("ws建立,要显示在线图标,却发现列表页没有打开.topicsPageOpenMark == yes不成立.");
		}
		
		console.log("WS成功建立连接,向前台页面发送toast通知.currentPageId:" + currentPageId);
		exec(currentPageId, "toast('服务器连接已恢复.')");

		tasksOnWired();
	};
	ws_obj.onmessage = function(evnt) {
		checkMessageInterface(evnt);
	};
	ws_obj.onerror = function(evnt) {
		logging("WS出错事件. ws_obj=" + ws_obj + "|readyState=" + ws_obj.readyState + " |然后显示为离线图标");
		console.log("WS出错事件. ws_obj=" + ws_obj + "|readyState=" + ws_obj.readyState + "|然后显示为离线图标");
		if (topicsPageOpenMark == "yes") {//没有这个判断,启动时会报错.xu1113.
			exec("main_page", "showWebsocketStatus('ws_closed')");
		}else{
			console.log("ws出错,要显示离线图标,却发现列表页没有打开.topicsPageOpenMark == yes不成立.");
		}
		
		console.log("WS因出错发生关闭,向前台页面发送toast通知.currentPageId:" + currentPageId);
		exec(currentPageId, "toast('服务器连接异常中断,请在恢复网络连接后再操作.')");
	};

	ws_obj.onclose = function(evnt) {
		logging('WS关闭事件.显示离线图标. ws_obj=' + ws_obj + "|readyState=" + ws_obj.readyState);
		console.log("WS关闭事件.显示离线图标. ws_obj=" + ws_obj + "|readyState=" + ws_obj.readyState);
		if (topicsPageOpenMark == "yes") {//没有这个判断,启动时会报错.xu1113.
			exec("main_page", "showWebsocketStatus('ws_closed')");
		}else{
			console.log("ws关闭,要显示离线图标,却发现列表页没有打开.topicsPageOpenMark == yes不成立.");
		}

		console.log("WS关闭事件,向前台页面发送toast通知.currentPageId:" + currentPageId);
		exec(currentPageId, "toast('服务器连接已中断,请在恢复网络连接后再操作.')");
	}
}


function closeWebSocket() {
	console.log("进入closeWebSocket(). ws_obj=" + ws_obj + "|readyState=" + ws_obj.readyState);
	logging("进入closeWebSocket(). ws_obj=" + ws_obj + "|readyState=" + ws_obj.readyState);
	if (ws_obj.readyState == 2 || ws_obj.readyState == 3) {
		//ws_obj = null;
		console.log("关闭ws的时候却发现ws_obj.readyState == 2/3,不关闭了.");
		logging("关闭ws的时候却发现ws_obj.readyState == 2/3,不关闭了.");
		return;
	}
	if (ws_obj != null & ws_obj != 'init') {//关闭时间较长后,这个对象可能会成为null.
		ws_obj.close();
	}

	//console.log("已执行wsclose操作, 让ws_stauts=off, ws_obj=null");
	//logging("已执行wsclose操作,让 ws-status=off, ws_obj=null");
	console.log("已执行wsclose操作");
	logging("已执行wsclose操作");
	//ws_status = 'off';
	//ws_obj = null;
}

function checkIfWSOnline4topiclist() {
	if (ws_obj.readyState == 1) {
		console.log("checkIfWSOnline: 在线状态,返回true. ws_obj=" + ws_obj + " |readyState=" + ws_obj.readyState);
		return true;
	} else {
		console.log("checkIfWSOnline: 非在线状态,重建ws连接,返回false. ws_obj=" + ws_obj + " |readyState=" + ws_obj.readyState);
		createWebSocket("no");
        return false;
	}
}


/**
 * @param timerArr[0], timer标记
 * @param timerArr[1], 初始的title文本内容
 */
function stopFlashTitle(timerArr) {//去除闪烁提示，恢复初始title文本
	if (timerArr) {
		clearInterval(timerArr[0]);
		document.title = timerArr[1];
	}
}

function sendPoster(toUserId,inputValue,tmpPid) {
	var json_posterinfo = {
			toUserId : toUserId,
			inputValue : inputValue,
			temp_msg_id : tmpPid
	};
	var taskId_SendPoster = toUserId + "-" + tmpPid;
	doSendPoster[taskId_SendPoster] = json_posterinfo;
	//登记入任务筐.查询的时候,也用toUserId+"-"+tmpPid来查询.
	console.log("SendPoster tmpPid:" + tmpPid);
	//这里有在线检查及再次创建方法.
	setTimeout("checkSendPosterSuccess('" + taskId_SendPoster + "')", 7000);
}

function checkSendPosterSuccess(taskId_SendPoster) {
	console.log("checkSendPosterSuccess 延时已到...");
	var json_posterinfo = doSendPoster[taskId_SendPoster];
	var toUserId = json_posterinfo.toUserId;
	if (json_posterinfo == "none") {
		console.log("checkSendPosterSuccess 成功了,不作为!  toUserId:" + toUserId);
		return
	}//none表示已成功,不作为.
	console.log("checkSendPosterSuccess 不成功!  toUserId:" + toUserId);
	var tmpPid = json_posterinfo.temp_msg_id;
	var pageName = getTmpTopicIdIfExisted(toUserId);//如果有临时topicid,就用临时的id.
	var script = "afterCheckedSendPosterSuccess('" + tmpPid + "',false)";
	exec(pageName, script);
}

function getTmpTopicIdIfExisted(toUserId) {
	//console.log("要判断这个元素不存在时, 值是多少 下面的if判断是 != undefined topicId2tmpTopicId[topicid]="+topicId2tmpTopicId[topicid]);
	if (topicId2tmpTopicId[toUserId] == undefined) {
		return toUserId;
	} else {
		//console.log("topicId2tmpTopicId[topicid]已被判断为不是undefined");
		return topicId2tmpTopicId[toUserId];
	}
}

//下面四个方法为新消息通知功能.执行notifyNewMessage(),则发出一个短音,同时标题闪烁"新消息"20秒.
function notifyNewMessage(originalPageTitle) {
	//console.log("originalPageTitle:"+originalPageTitle); 
	var audioE = loadSoundFile();
	var timerArr = startFlashTitle(audioE,originalPageTitle, "【　　　】", "【新消息】");//【新消息】
	setTimeout(function() {//此处是过一定时间后自动消失
		stopFlashTitle(timerArr);
	}, 20000);
}

function loadSoundFile() {//如果声音文件已存在,则直接返回它所在的elemment.如果不存在,则创建一个后返回.
	var audioE = $('#audioFileE');
	if (audioE[0] == undefined) {
		audioE = $('<audio id="audioFileE"><source src="http://www.xunta.so/xunta-web/client_code/sound/youhaveamessage.wav" type="audio/wav"></audio>');
		//audioE = $('<audio id="audioFileE"><source src="/client_code/sound/youhaveamessage.wav" type="audio/wav"></audio>');//服务器对client_code这个路径有时会加上,有时不加上.暂用上面的绝对路径.
		audioE.appendTo('body');//载入声音文件
		console.log("播放新消息所用的audio元素不存在,已新建了一个.");
		
	} else {
		console.log("播放新消息所用的audio元素已存在,不再创建.");
	}
	return audioE;
}

function startFlashTitle(audioE,originalPageTitle, string1, string2) {//有新消息时在title处闪烁提示
	console.log("正在播放新消息的短音..."); 
	audioE[0].play();//播放声音
	var step = 0, originalPageTitle;
	var timer = setInterval(function() {
		step++;
		if (step == 3) {
			step = 1
		};
		if (step == 1) {
			document.title = string1 + originalPageTitle
		};
		if (step == 2) {
			document.title = string2 + originalPageTitle
		};
	}, 600);
	return [timer, originalPageTitle];
	//通过数组返回两个变量.
}

function judgeSelfPosterReturnOrOthers(window_id,tmpPid,postTimeLong,postTimeStr) {//判断自己的发言是否成功
	var script="markSendPosterSuccess('" + tmpPid + "','"+ postTimeLong + "','" + postTimeStr + "')";
	exec(window_id, script);
    //只是准备一些调用前的参数变量.
	var taskid_sendposter =window_id + "-" + tmpPid;
	//返回的消息是个数组,但目前只会有一个.
	doSendPoster[taskid_sendposter] = "none";
}


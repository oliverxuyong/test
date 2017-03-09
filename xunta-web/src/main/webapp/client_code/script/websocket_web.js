
function checkNewTopicSuccess(tmpTopicId, tmpPid) {
	//如果任务筐为空,则不作为.
	//如果任务筐不为空,则设置感叹号:
	if (doRequestCreateNewTopic[tmpTopicId]) {//如果仍为true,说明没成功.
		console.log("延时检查  新创话题请求没成功: checkCreateNewTopicSuccess doRequestCreateNewTopic[tmpTopicId]" + doRequestCreateNewTopic[tmpTopicId]);
		// 1.12 F
        exec(tmpTopicId,"afterCheckedNewTopicSuccess("+tmpPid+", false)");
	}
}

function modifyNickname(jsonObj) {
	if (jsonObj.status == '0') {//昵称修改成功
		changeAllNickNames(jsonObj.new_name);//在index_page.js里.
		exec("topics_page","toast('昵称在服务器上修改成功.')");
	} else if (jsonObj.status == '1') {//昵称出现重复
		exec("topics_page","toast('该昵称已存在,请修改后再提交.')");
	} else if (jsonObj.status == '2') {//服务器保存时出错
		exec("topics_page","toast('昵称在服务器上的修改过程出现异常，请重试或向开发者求助.')");
	}
}

function initLastTopicTime() {
	//注销时要结束ws连接并且重新初始化 话题列表分页参数的初始值
	lastTopicTime = '-1';
	ws_obj.close();
	//xu注释掉的 11.18 因为在close里已有这句了. ws_obj = null;
	//F 0118 注销下面的代码
	//api.removeEventListener({//应用程序进入后台事件
	//	name : 'pause'
	//}, function(ret, err) {
	//})
	//api.removeEventListener({//应用程序进入前台事件
	//	name : 'resume'
	//}, function(ret, err) {
	//});
}

function byValueToDialogBoxHistory(content) {
	var jsonObj = JSON.parse(content);
    var topicid = jsonObj.topicid;
    doRequestPostHist[topicid] = false;
	//成功获得聊天历史,将任务标志清除.
    exec(topicid,"showDialogHistory("+content+")")
    //document.getElementById(topicid).contentWindow.showDialogHistory(content);
}

function checkPostHistSuccess(topicId) {
	//console.log("历史消息请求 延时检查时间到了 doRequestPostHist[topicId]:" + doRequestPostHist[topicId] + " topicid:" + topicId);
	//1.11 F 修改
	var booleanStr;

	if (doRequestPostHist[topicId]) {//如果为true,表示没成功.
		//doRequestPostHist[topicId] = false;//清除任务标记.
		//console.log("延时检查 历史消息请求没成功");
		booleanStr = false;

	} else {
		//console.log("延时检查 历史消息请求成功了.");
		booleanStr = true;

	}
	exec(topicId, "stopLoadingIcon_getPostHist(" + booleanStr + ")");
	//document.getElementById(topicId).contentWindow.stopLoadingIcon_getPostHist(booleanStr);

}

function checkIfWSOnline4Signal(){//用户点击列表页右上角的信息图标时,会执行到这里.信号为桔黄色时点击,会提示"网络连接正常".
	if(checkIfWSOnline()){
		exec("topics_page", "showWebsocketStatus('ws_on')");
		toast("当前网络连接正常.");
	}
}

function checkIfWSOnline() {
	//if (ws_status == 'on' && ws_obj != null){
	if (ws_obj.readyState == 1) {
		console.log("checkIfWSOnline: 在线状态,返回true. ws_obj=" + ws_obj + " |readyState=" + ws_obj.readyState);
		logging("checkIfWSOnline: 在线状态,返回true. ws_obj=" + ws_obj + " |readyState=" + ws_obj.readyState);
		return true;
	} else {
		console.log("checkIfWSOnline: 非在线状态,重建ws连接,返回false. ws_obj=" + ws_obj + " |readyState=" + ws_obj.readyState);
		logging("checkIfWSOnline: 非在线状态,重建ws连接,返回false. ws_obj=" + ws_obj + " |readyState=" + ws_obj.readyState);
		createWebSocket("no");
		console.log("checkIfWSOnline()发现离线,向页面传递通知 - currentPageId:" + currentPageId);
		exec(currentPageId, "toast('网络中断,正在重新建立连接...')");
		return false;
	}
}

function createWebSocket(yesorno) {//刚启动时,为yes.平时断线重连,为no.
	logging("进入createWebSocket(). ws_obj=" + ws_obj + "|readyState=" + ws_obj.readyState);
	console.log("进入createWebSocket(). ws_obj=" + ws_obj + "|readyState=" + ws_obj.readyState);
	if (ws_obj.readyState == 1) {
		console.log("创建ws联接的时候却发现ws_obj.readyState==1,不创建了.");
		logging("创建ws联接的时候却发现ws_obj.readyState==1,不创建了.");
		return;
	}
	//alert("发出创建请求...");
	if ('WebSocket' in window) {
		ws_obj = new WebSocket("ws://" + domain + "/xunta-web/websocket?userid=" + userId + "&boot=" + yesorno);
		console.log("已发WS连接请求 userId=" + userId);
		logging('WS连接请求已发出...');

	} else {
		console.log("该浏览器不支持websocket协议.");
		logging("该浏览器不支持websocket协议.");
		toast("该浏览器不支持WebSocket通信协议.请更换更高版本的浏览器.");	
	}
	
	/* if ('MozWebSocket' in window) {
		ws_obj = new MozWebSocket("ws://" + domain + "/xunta-web/websocket?userid=" + userId + "&boot=" + yesorno);
		console.log("已发MozWebSocket连接请求 userId=" + userId);
	} else {
		//强制使用报这个错:Uncaught Error: Only basic urls are supported in SockJS
		ws_obj = new SockJS("http://" + domain + "/xunta-web/websocket?userid=" + userId + "&boot=" + yesorno);
		console.log("已发SockJS连接请求 userId=" + userId+"|"+ws_obj);
	}*/
	//console.log("已发WS连接请求 userId=" + userId);
	websocketEvent();
}
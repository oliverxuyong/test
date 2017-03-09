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

var doRequestTopicList = false;
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

function removeTmpTopicId(tmptopicid) {
	//console.log("应该正在关闭临时页面,要清除临时topicid, 现在执行 removeTmpTopicId(). 如果下面没出现发现和删除的log,则为出错.");
	for (topicid in topicId2tmpTopicId) {
		if (topicId2tmpTopicId[topicid] == tmptopicid) {
			//console.log("removeTmpTopicId() - 发现与带入参数tmptopicid相同的topicId2tmpTopicId[topicid],下面用delete删除.");
			delete topicId2tmpTopicId[topicid];
		}
	}
}

function initToGetTopicList() {
	//$("#loadinganimation").css("display", "block");
	//$(".login_container").css("display", "none");
	doRequestTopicList = true;
	//任务筐中登记.
	//先添加响应任务,同时作为请求进行中的状态标志.
	//console.log("initToGetTopicList...userId=" + userId);
	//$("#loadinganimation").click(initToGetTopicList(userId));//有时该方法会在请求失败时点击拖拉机来调用,所以这里先取消点击事件.
	if (checkIfWSOnline4topiclist()) {//如果ws处于连接状态,直接发出请求. 如果没有连接,该方法会发出创建请求.
		requestTopicList();
	}
}

//这个方法有点混乱, 前面检查过是否在线了, 在这里不应该再出现. 待解决. xu 10.24
function requestTopicList() {//当ws创建成功后请求话题列表
    //alert(userId);
	console.log("真正发出 requestTopicList userId=" + userId);
	var json_obj = {
		_interface : "topiclist_sortby_newest_response",
		uid : userId,
		time : lastTopicTime,
		num : requestTopicNum
	};
	//console.log("lastTopicTime="+lastTopicTime);
	WS_Send(json_obj);
}

/*因为拖拉机的移动, 这个方法需要修改.
 function checkTopicListSuccess() {
 var script = "checkTopicListSuccess('" + doRequestTopicList + "')";
 exec("topics_page", script);
 }*/

function initSendPoster(userId, content, topicId, tmpTopicId, tmpPid) {
	content = specialLettersDecoding(content);
	console.log("content:"+content);
	var json_posterinfo = {
		_interface : "chatmsg",
		sender_id : userId,
		content : content,
		topicid : topicId,
		temp_topicid : tmpTopicId,
		msg_id : '-1',
		temp_msg_id : tmpPid
	};
	sendPoster(topicId, tmpPid, json_posterinfo);
}

function sendPoster(topicId, tmpPid, json_posterinfo) {
	var taskId_SendPoster = topicId + "-" + tmpPid;
	doSendPoster[taskId_SendPoster] = json_posterinfo;
	//登记入任务筐.查询的时候,也用topicId+"-"+tmpPid来查询.
	console.log("SendPoster tmpPid:" + tmpPid);
	WS_Send(json_posterinfo);
	//这里有在线检查及再次创建方法.
	setTimeout("checkSendPosterSuccess('" + taskId_SendPoster + "')", 7000);
}

/*
 发送信息到指定接收人  FANG 10.12
 * */
function initSendPoster_Reply2thistopic(topicid_reply2, content, tmpPid, topicId) {
	content = specialLettersDecoding(content);
	var json_posterinfo = {
		_interface : "reply2thistopic",
		topicid : topicId,
		topicid_reply2 : topicid_reply2,
		content : content,
		temp_msg_id : tmpPid
	};
	sendPoster(topicId, tmpPid, json_posterinfo);
	/* 下面这段代码转移到sendPoster中了. xu
	 var taskId_SendPoster = topicId + "-" + tmpPid;
	 doSendPoster[taskId_SendPoster] = json_posterinfo;
	 console.log("initSendPoster tmpPid:" + tmpPid);
	 if (ws_status == 'on') {//如果ws处于连接状态,直接发出请求.
	 console.log("initSendPoster ws已连接,直接调用请求.");
	 //sendPoster(json_posterinfo);
	 WS_Send(json_posterinfo);
	 } else {//否则先创建连接.连接成功后,会在连接响应方法中自动执行请求方法.
	 console.log("initSendPoster ws未连接,现在创建连接...");
	 createWebSocket("no");
	 //创建ws连接. websocket方法.
	 }
	 setTimeout("checkSendPosterSuccess('" + taskId_SendPoster + "')", 7000);*/
}

function checkSendPosterSuccess(taskId_SendPoster) {
	console.log("checkSendPosterSuccess 延时已到...");
	var json_posterinfo = doSendPoster[taskId_SendPoster];
	var topicid = json_posterinfo.topicid;
	if (json_posterinfo == "none") {
		console.log("checkSendPosterSuccess 成功了,不作为!  topicid:" + topicid);
		return
	}//none表示已成功,不作为.
	console.log("checkSendPosterSuccess 不成功!  topicid:" + topicid);
	//console.log("json_posterinfo1:"+ json_posterinfo);
	//console.log("json_posterinfo2:"+ JSON.stringify(json_posterinfo));
	//console.log("json_posterinfo3:"+ json_posterinfo.topicid);
	//console.log("checkSendPosterSuccess topicid:" + topicid);
	var tmpPid = json_posterinfo.temp_msg_id;
	//var SendPosterSuccess = true;
	//if (json_posterinfo != "none"){ SendPosterSuccess = false;}
	//var script = "afterCheckedSendPosterSuccess('" + tmpPid + "','" + SendPosterSuccess + "')";
	var pageName = getTmpTopicIdIfExisted(topicid);//如果有临时topicid,就用临时的id.
	var script = "afterCheckedSendPosterSuccess('" + tmpPid + "',false)";
	exec(pageName, script);
}

/*
 function sendPoster(json_obj) {
 ws_obj.send(JSON.stringify(json_obj));
 }*/

function tasks_sendPosters() {//检查并执行消息发送的任务筐.
	for (var i in doSendPoster) {
		console.log("循环检查到 doSendPoster[topicid-tmppid]:" + doSendPoster[i] + " i:" + i);
		if (doSendPoster[i] != "none") {
			console.log("这个不是none,再次发送消息.");
			WS_Send(doSendPoster[i]);
		} else {//如果等于none,则珊除该元素,以免不断积累: 一边循环,一边删除,不知是否有问题? xu10.12015
			console.log("这个是none,用delete来删除.");
			delete doSendPoster[i];
		}
	}
}

function getTmpTopicIdIfExisted(topicid) {
	//console.log("要判断这个元素不存在时, 值是多少 下面的if判断是 != undefined topicId2tmpTopicId[topicid]="+topicId2tmpTopicId[topicid]);
	if (topicId2tmpTopicId[topicid] == undefined) {
		return topicid;
	} else {
		//console.log("topicId2tmpTopicId[topicid]已被判断为不是undefined");
		return topicId2tmpTopicId[topicid];
	}
}

/** 下面这个方法完成取消了. xu 2015.11.11 光棍节
 *	客户端接受服务器推送消息   9.16 FANG
 */
//function afterReceivedChatMsg(eventdata) {//判断有没有 临时topic页面xu://可能是用户自己的发言,也可能是通知或他人发言.
//	var jsonObj = JSON.parse(eventdata);
//	var topicid = jsonObj.topicid;
//var temp_topicid = jsonObj.tmp_topicid;
//console.log(' afterReceivedChatMsg 服务器返回来的话题ID，指定将消息发送哪个聊天框的ID  temp_topicid:' + temp_topicid)

/*
for (var i = 0; i < topicIdArray.length; i++) {
//每次收到服务器发来的消息，先判断topicId在数组中是否有临时话题ID，如果有临时话题ID，则把消息发送到临时话题ID里面
if (topicIdArray[i] == topicid) {
pagename = tempTopicIdArray[i];
console.log('找到了有对应临时tid的正式tid.temp_topicid为:' + pagename+"  topicid:"+topicid);
}
}换为以下代码. xu10.25*/
//	var pagename = getTmpTopicIdIfExisted(topicid);

//如果数组有对应话题，但是该条消息没有匹配对临时话题，则按照正常的话题ID处理
//	judgeSelfPosterReturnOrOthers(jsonObj, pagename, eventdata);
//}

//接受来自服务器的消息要进行处理  9.14 FANG
//对于用户A的发言,服务器端的回复(确认收到)不是通过一个专门接口,而是利用了标准chatmsg接口,同样的向用户A发一个与他人相同的消息. 用户A收到后,判断为自己的消息时,当作确认来处理.
function judgeSelfPosterReturnOrOthers(eventdata) {//判断是自己发言的返回, 还是别人的发言. //这块在消息接口上需要分开.xu9.20
	var jsonObj = JSON.parse(eventdata);
	var topicid = jsonObj.topicid;
	var pagename = getTmpTopicIdIfExisted(topicid);
	//console.log("judgeSelfPosterReturnOrOthers pagename:" + pagename);
	var script;
	if (jsonObj.msg_arr[0].sender_userinfo.userid == userId) {//如果是用户自己的发言，则修改聊天页面的消息状态，不在是直接将消息显示在聊天页面
        prepareToCall_markSendPosterSuccess(jsonObj, pagename);
		//只是准备一些调用前的参数变量.
		var taskid_sendposter = jsonObj.topicid + "-" + jsonObj.msg_arr[0].temp_msg_id;
		//返回的消息是个数组,但目前只会有一个.
		doSendPoster[taskid_sendposter] = "none";
		//取消任务筐里的任务.
	} else {//如果是别人发言,或者是消息推送或系统通知, 则利用话题历史的代码显示出来:
		notifyNewMessage(pageTitle);//只在收到他人发言时,才发提示音.
	
        if (document.getElementById(pagename) != null) {
			script = "showAllPosters(" + eventdata + ")";
			exec(pagename, script);
			//单条消息或多条消息都可以.
		}
		//document.getElementById(topicid).contentWindow.showAllPosters(eventdata);
	}
}

function prepareToCall_markSendPosterSuccess(jsonObj, pageName) {//只是准备一些参数变量:
	var msgArr0 = jsonObj.msg_arr[0];
	var pid = msgArr0.msg_id;
	var tmpPid = msgArr0.temp_msg_id;
	var msgTye = msgArr0.msg_type;
	var postTimeStr = msgArr0.msg_create_datetime_str;
	var postTimeLong = msgArr0.msg_create_datetime_long;
	console.log("tmpPid=" + tmpPid);
	script = "markSendPosterSuccess('" + tmpPid + "','" + pid + "','" + msgTye +"','" + postTimeLong + "','" + postTimeStr + "')";
	exec(pageName, script);
	//exec(pageName, "markSendPosterSuccess", "'"+tmpPid + "','" + pid + "','" + postTimeLong + "','" + postTimeStr+"'");
}

function tasksOnWired() {//ws连接事件的响应执行方法:
	console.log("网络通了,现在执行任务筐.");
	task_RequestTopicList();
	//检查并执行话题列表请求任务.
	tasks_RequestPostHist();
	//检查并执行历史消息请求的任务:
	tasks_sendPosters();
	//是否执行 发送某个发言的任务. //这个方法在哪? xu9.9

	tasks_RequestCreateNewTopic();
	//检查并执行创建新话题的请求任务:

	tasks_RequestMoveToNewTopic();
	//检查并执行移动到新话题的请求任务.

}

//批量创建新话题
function batch_initMoveToNewTopic(tmpPid, inputvalue, original_topicid, tmptopicid, tobeMovedTopics, userId){
	inputvalue = specialLettersDecoding(inputvalue);
	var _objArr = new Array();
	var _objSize = tobeMovedTopics.split("-join-");
	for(var i=0;i<_objSize.length;i++){
		var item = {};
		item.topicid_tobemoved = _objSize[i];
		_objArr.push(item);
	}
	var LaunchInfo_Json = {
		_interface : "batch_moveto_newtopic",
		userid : userId,
		first_poster : inputvalue,
		tmp_pid : tmpPid,
		tmp_topicid : tmptopicid,
		currenttopicid : original_topicid,
		tobeMovedTopics : _objArr
	};
	doRequestMoveToNewTopic[tmptopicid] = LaunchInfo_Json;
	WS_Send(LaunchInfo_Json);
	setTimeout("checkMoveToNewTopicSuccess('" + tmptopicid + "','" + tmpPid + "')", 6000);
}

function initMoveToNewTopic(tmpPid, inputvalue, original_topicid, tmptopicid, from_msg_topicid, from_senderId, userId) {
	inputvalue = specialLettersDecoding(inputvalue);
	var LaunchInfo_Json = {
		_interface : 'moveto_newtopic',
		userid : userId,
		first_poster : inputvalue,
		tmp_pid : tmpPid,
		tmp_topicid : tmptopicid,
		currenttopicid : original_topicid,
		userid_tobemoved : from_senderId,
		topicid_tobemoved : from_msg_topicid
	};

	doRequestMoveToNewTopic[tmptopicid] = LaunchInfo_Json;
	//console.log("先放入任务筐 doRequestMoveToNewTopic  ---  tmptopicid=" + tmptopicid);
	//先添加响应任务,同时作为请求进行中的状态标志.
	//console.log("initMoveToNewTopic...userId=" + userId);
	//console.log("initMoveToNewTopic: ws已连接,直接调用请求.");
	moveToNewTopicRequest(LaunchInfo_Json);
	setTimeout("checkMoveToNewTopicSuccess('" + tmptopicid + "','" + tmpPid + "')", 6000);
}

function moveToNewTopicRequest(LaunchInfo_Json) {//将聊天框内容移出当作新话题所执行的方法
	console.log("下面发出 移动到新话题的请求...");
	WS_Send(LaunchInfo_Json);
}

function checkMoveToNewTopicSuccess(tmpTopicId, tmpPid) {
	//如果任务筐为空,则不作为.
	//如果任务筐不为空,则设置感叹号:
	if (doRequestMoveToNewTopic[tmpTopicId] != false) {//如果仍为true,说明没成功.
		console.log("延时检查  移动到新话题请求没成功: checkMoveToNewTopicSuccess doRequestMoveToNewTopic[tmpTopicId]" + doRequestMoveToNewTopic[tmpTopicId]);
		console.log("tmptopicid是:" + tmpTopicId);
		script = "afterCheckedSendPosterSuccess('" + tmpPid + "',false" + ")";
		exec(tmpTopicId, script);
	}
}

function tasks_RequestMoveToNewTopic() {
	for (var tmptopicid in doRequestMoveToNewTopic) {
		console.log("循环检查 doRequestMoveToNewTopic[tmptopicid]:" + doRequestMoveToNewTopic[tmptopicid] + " tmptopicid:" + tmptopicid);
		if (doRequestMoveToNewTopic[tmptopicid] != false) {
			console.log("这个不是false,仍有任务,再次请求移动到新话题:" + doRequestMoveToNewTopic[tmptopicid] + " tmptopicid:" + tmptopicid);
			moveToNewTopicRequest(doRequestMoveToNewTopic[tmptopicid]);
		} else {
			console.log("这个是false,任务已完成,用delete删除.");
			delete doRequestMoveToNewTopic[tmptopicid];
		}
	}
}

//收到服务器确认,移动到新话题 创建成功  9.16 FANG
function afterMoveToNewTopicCreated(eventdata) {
	var jsonObj = JSON.parse(eventdata);
	console.log('移动话题成功的后续处理: 存储的新话题ID:' + jsonObj.topicid + '|存储临时话题ID:' + jsonObj.tmp_topicid);

	doRequestMoveToNewTopic[jsonObj.tmp_topicid] = false;
	//清除任务筐
	console.log('清除了任务筐:doRequestMoveToNewTopic[' + jsonObj.tmp_topicid + ']=' + doRequestMoveToNewTopic[jsonObj.tmp_topicid]);

	//话题创建成功后，将话题ID和临时话题ID存在数据里面 9.16 FANG
	/*
	 topicIdArray[topicIndex] = jsonObj.topicid;
	 tempTopicIdArray[topicIndex] = jsonObj.tmp_topicid;
	 topicIndex++; 这段替换为下面一句. xu10.25 */
	topicId2tmpTopicId[jsonObj.topicid] = jsonObj.tmp_topicid;

	//话题创建成功后，将创建成功的状态传给创建话题页面，告知话题创建成功，可以在话题内进行交流  9.14 FANG
	exec(jsonObj.tmp_topicid, "markMoveToNewTopicSuccess(" + eventdata + ")");
}

function batch_afterMoveToNewTopicCreated(eventdata){
	var jsonObj = JSON.parse(eventdata);
	console.log('批量移动话题成功的后续处理: 存储的新话题ID:' + jsonObj.topicid + '|存储临时话题ID:' + jsonObj.tmp_topicid);

	doRequestMoveToNewTopic[jsonObj.tmp_topicid] = false;
	//清除任务筐
	console.log('清除了任务筐:doRequestMoveToNewTopic[' + jsonObj.tmp_topicid + ']=' + doRequestMoveToNewTopic[jsonObj.tmp_topicid]);

	topicId2tmpTopicId[jsonObj.topicid] = jsonObj.tmp_topicid;

	//话题创建成功后，将创建成功的状态传给创建话题页面，告知话题创建成功，可以在话题内进行交流  9.14 FANG
	exec(jsonObj.tmp_topicid, "markMoveToNewTopicSuccess(" + eventdata + ")");
}



//先放入任务筐,然后执行发送.发送时会检查是否在线.如果不在线,则请求连接.连接事件后会执行任务筐:xu15.11.20
function initCreateNewTopic(inputValue, tmpTopicId, tmpPid) {
	doRequestCreateNewTopic[tmpTopicId] = true;	//先添加响应任务,同时作为请求进行中的状态标志.
	
	//console.log("initCreateNewTopic...inputvalue解码前=" + inputValue);
	inputValue = specialLettersDecoding(inputValue);
	//console.log("initCreateNewTopic...inputvalue解码后=" + inputValue);
	
	tmptid2inputvalue[tmpTopicId] = inputValue;	//临时存放原始数据,供执行任务筐时使用.//没有删除语句.
	tmptid2tmppid[tmpTopicId] = tmpPid;	//临时存放原始数据,供执行任务筐时使用.//没有删除语句.
	
	newTopicRequest(inputValue, tmpTopicId, tmpPid);
	setTimeout("checkNewTopicSuccess('" + tmpTopicId + "','" + tmpPid + "')", 8000);
}

function newTopicRequest(inputvalue, tmpTopicId, tmpPid) {
	var json_obj = {//下面的接口参数项于15.9.19前后台一并修改.
		_interface : "newtopic",
		userid : userId,
		first_poster : inputvalue,
		tmp_topicid : tmpTopicId,
		tmp_pid : tmpPid
	};
	WS_Send(json_obj);
}

///客户端接受服务器创建话题成功消息  9.16 FANG
function markNewTopicSuccess(eventdata) {
	var jsonObj = JSON.parse(eventdata);
	doRequestCreateNewTopic[jsonObj.tmp_topicid] = false;
	//清除任务筐

	//话题创建成功后，将话题ID和临时话题ID存在数据里面 9.16 FANG
	/*topicIdArray[topicIndex] = jsonObj.topicid;
	 tempTopicIdArray[topicIndex] = jsonObj.tmp_topicid;
	 topicIndex++;这段替换为下面一句. xu10.25 */
	topicId2tmpTopicId[jsonObj.topicid] = jsonObj.tmp_topicid;

	console.log('存储的新话题ID  ' + jsonObj.topicid + '    存储的临时话题ID   ' + jsonObj.tmp_topicid)
	//话题创建成功后，将创建成功的状态传给创建话题页面，告知话题创建成功，可以在话题内进行交流  9.14 FANG
	exec(jsonObj.tmp_topicid, "markNewTopicSuccess(" + eventdata + ")");
}

function tasks_RequestCreateNewTopic() {
	for (var tmptopicid in doRequestCreateNewTopic) {
		console.log("循环检查 doRequestCreateNewTopic[tmptopicid]:" + doRequestCreateNewTopic[tmptopicid] + " tmptopicid:" + tmptopicid);
		if (doRequestCreateNewTopic[tmptopicid] == true) {
			console.log("这个为true,再次请求创建新话题:" + doRequestCreateNewTopic[tmptopicid] + " tmptopicid:" + tmptopicid);
			newTopicRequest(tmptid2inputvalue[tmptopicid], tmptopicid, tmptid2tmppid[tmptopicid]);
		} else {
			delete doRequestCreateNewTopic[tmptopicid];
		}
	}
}

function tasks_RequestPostHist() {
	for (var topicid in doRequestPostHist) {
		console.log("循环检查到 doRequestPostHist[topicid]:" + doRequestPostHist[topicid] + " topicid:" + topicid);
		if (doRequestPostHist[topicid] == true) {
			console.log("这个为true,再次请求历史消息 doRequestPostHist[topicid]:" + doRequestPostHist[topicid] + " topicid:" + topicid);
			getPostHistory(topicid);
		} else {
			console.log("这个不为true,看看能不能用delete删掉? 不过要再连线一下才能看到删除结果.");
			delete doRequestPostHist[topicid];
		}
	}
}

function task_RequestTopicList() {//检查并执行话题列表请求任务.
	if (doRequestTopicList) {//检查并执行 请求话题列表的任务.xu9.9
		console.log("话题列表请求任务为true,现在执行请求...");
		requestTopicList();
	}
}

function reply2ConfirmReception(newMsgId, topicid) {
	var json_obj = {
		_interface : "msg_received_confirm",
		msg_id : newMsgId,
		target_topicid : topicid
	};
	//console.log( "reply2ConfirmReception() - newMsgId="+newMsgId+"|topicid="+topicid);
	WS_Send(json_obj);
}

function link2mytopic(topicid_belinked, mytopicid) {
	//alert("link2mytopic: 为on,现在发请求.");
	console.log("link2mytopic 请求发了. 新加的方法 10.27");
	var json_obj = {
		_interface : "link2mytopic",
		topicid_belinked : topicid_belinked,
		mytopicid : mytopicid
	};
	WS_Send(json_obj);
}

function link2mytopic_byrecommend(topicid_belinked, mytopicid, recommended_pid) {
	//alert("link2mytopic: 为on,现在发请求.");
	console.log("link2mytopic_byrecommend 请求发了. 新加的方法 11.12");
	var json_obj = {
		_interface : "link2mytopic_byrecommend",
		topicid_belinked : topicid_belinked,
		mytopicid : mytopicid,
		recommended_pid : recommended_pid
	};
	WS_Send(json_obj);
}

function request_mytopiclist_4moveto(page, original_topicid, current_tmptopicid) {//新窗页的话题直接接入操作.
	var json_obj = {
		_interface : "request_mytopiclist_4moveto",
		topicid_bemoved : original_topicid,
		tmp_topicid : current_tmptopicid,
		page : page,
		pagenum : 10,//num_eachpage
	};
	WS_Send(json_obj);
	console.log("发出 request_mytopiclist_4moveto, current_tmptopicid:" + current_tmptopicid);
}

function request_mytopiclist(page, current_topicid) {//用于对话页的话题并入操作.
	var json_obj = {
		_interface : "request_mytopiclist",
		page : page,
		pagenum : 10, //num_eachpage
		current_topicid : current_topicid
	};
	WS_Send(json_obj);
	console.log("发出 request_mytopiclist, current_topicid:" + current_topicid);
}

function requestMove2ExistedTopic(tmp_topicid, original_topicid, from_topicid, mytopicid_moveto) {//当ws创建成功后请求话题列表
	console.log("真正发出 requestMove2ExistedTopic userId=" + userId + "|" + tmp_topicid + "|" + original_topicid + "|" + mytopicid_moveto);
	var json_obj = {
		_interface : "moveto_existedtopic",
		tmp_topicid : tmp_topicid,
		topicid_bemoved : from_topicid,
		topicid_movefrom : original_topicid,
		topicid_moveto : mytopicid_moveto
	};

	var _tid = from_topicid;
	if(_tid.indexOf("-join-")>0){
		var _objArr = new Array();
		var _objSize = from_topicid.split("-join-");
		for(var i=0;i<_objSize.length;i++){
			var item = {};
			item.topicid_bemoved = _objSize[i];
			_objArr.push(item);
		}
		json_obj = {
			_interface : "batch_moveto_existedtopic",
			tmp_topicid : tmp_topicid,
			topicid_movefrom : original_topicid,
			topicid_moveto : mytopicid_moveto,
			tobeMovedTopics:_objArr
		};
	}
	WS_Send(json_obj);
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

function afterNewtopicCreated(eventdata) {
	var jsonObj = JSON.parse(eventdata);
	var pagename = getTmpTopicIdIfExisted(jsonObj.new_topicid);
	if (pagename == jsonObj.new_topicid) {
		logging("出错消息,用于发现潜在的代码错误. 一般用户不必理会.(新话题成功后的后续通知消息没有找到临时页面的tmptopicid.可能有网络不稳定使成功创建消息晚于该后续消息.也可能是断网期间用户关闭了创建页.)");
	}
	//alert("afterNewtopicCreated(jsonobj):这里向新建页面直接传递jsonobj数据.");
	exec(pagename, "showHitsRecommends(" + eventdata + ")");
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

function requestMerge(topicid_bemerged, topicid_mergeto) {
	console.log("requestMerge请求发了.");
	var json_obj = {
		_interface : "merge2anothertopic",
		topicid_bemerged : topicid_bemerged,
		topicid_mergeto : topicid_mergeto
	};
	WS_Send(json_obj);
}

function requestAlterNickname(userinfo) {//请求服务器更改昵称
    var userinfoJSON = userinfo;
	var json_obj = {
		_interface : "update_nickname",
		uid : userinfoJSON.uid,
		new_name : userinfoJSON.newNickname
	};
	WS_Send(json_obj);
}

function removeUserByTopic(master_topicid, block_userid, block_topicid) {
	var json_obj = {
		_interface : "block_user",
		master_topicid : master_topicid,
		block_userid : block_userid,
		block_topicid : block_topicid
	};
	WS_Send(json_obj);
}

function initToLoadPostHist(userId, topicId, msgId,num, _sort) {
	console.log("initToLoadPostHist-topicId:" + topicId);
	console.log("每次请求的历史消息条数-num="+num+"_sort"+_sort);
	firstMsgId = msgId;
	//先将获取聊天框历史消息的消息ID保存起来，因为有任务框导致这个ID不能传到获取话题历史方法里面，这个ID是用来传给服务器判断从哪开始获取其他消息
	sort = _sort;
	requestMsgCounts = num;
	//console.log("历史消息请求 initToLoadPostHist() - userId:" + userId + " topicId:" + topicId + "msgId:" + msgId);
	doRequestPostHist[topicId] = true;
	//console.log("刚刚为它赋了值 doRequestPostHist[topicId]:" + doRequestPostHist[topicId]);
	getPostHistory(topicId);
	setTimeout("checkPostHistSuccess('" + topicId + "')", 10000);
}

function getPostHistory(topicId) {
	console.log(" topicId:" + topicId + "firstMsgId:" + firstMsgId + "sort:" + sort+ "requestMsgCounts:" + requestMsgCounts);
	var json_obj = {
		_interface : "history",
		topicid : topicId,
		num : requestMsgCounts,//将每次获取历史消息的条数降为10,使接续点可见.xu.2016.4.29
		msg_id : firstMsgId,
		sort : sort

	};
	WS_Send(json_obj);
}


function searchTopics(topicid, searchword, page, pagenum, topicMsgNum) {
	console.log("requestSearchMode请求发了.");
	var json_obj = {
		_interface : "search_topics",
		current_topicid : topicid,
		search_word : searchword,
		page : page,
		pagenum : pagenum,
		default_topics_num : "5",
		default_posters_num : topicMsgNum
	};
	WS_Send(json_obj);
}

function getMoreMsges(topicId,searchword,topicid,topicMsgPage,pagenum){
    //alert(topicId+'   '+searchword+'  '+topicid+'   '+topicMsgPage+'   '+pagenum);
    console.log("getTopicsBelowMoreMsgs请求发了.");
    var json_obj = {
        _interface : "getTopicsBelowMoreMsgs",
        current_topicid : topicId,
        search_word : searchword,
        topicid : topicid,
        page : topicMsgPage,
        pagenum : pagenum,
    };
    WS_Send(json_obj);
}

//F 10015 添加请求个人话题分页
function getPeopleMoreTopics(topicid, searchword, page, pagenum, uid) {
	console.log("getPeopleMoreTopics请求发了.");
	var json_obj = {
		_interface : "getPeopleMoreTopics",
		current_topicid : topicid,
		search_word : searchword,
		userid : uid,
		page : page,
		pagenum : pagenum,
		default_posters_num : "3"
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
	if (jsonObj._interface == 'chatmsg') {//interface: 消息类型. 对自己发言的返回,他人发言,或系统通知,都是在这里收到的.xu9.20
		logging("收到chatmsg消息. content=" + jsonObj.msg_arr[0].content);
		reply2ConfirmReception(jsonObj.msg_arr[0].msg_id, jsonObj.topicid);
		var msgid = jsonObj.msg_arr[0].msg_id + jsonObj.topicid;
		if (currentMsgIdArray[msgid] == undefined) {//当前页面没有该消息，将该消息ID存在数组中，用来避免出现相同的消息ID
			currentMsgIdArray[msgid] = ' ';
			//$("#notification").text('WS收到了 聊天框 消息');
			judgeSelfPosterReturnOrOthers(evnt.data);
			//afterReceivedChatMsg(evnt.data);
			//如果当前聊天页面消息没有
			var script = "moveToTop_NewestRepliedTopic(" + evnt.data + ")";
			//将最新话题排到最上面.
			exec("topics_page", script);
		}

		//@wsy 如果是私聊的消息将在私聊窗口显示 
		var personal_chatmsg = jsonObj.msg_arr[0].msg_type ==3 ?true:false;
		if(personal_chatmsg){
			var pageName = getTmpTopicIdIfExisted(jsonObj.topicid);
				exec(pageName,"updatePersonalDialog("+evnt.data+")");
		}

	}
	if (jsonObj._interface == 'history') {
		byValueToDialogBoxHistory(evnt.data)
	}

	if (jsonObj._interface == 'moveto_newtopic') {
		afterMoveToNewTopicCreated(evnt.data)
	}

	if (jsonObj._interface == 'batch_moveto_newtopic') {
		batch_afterMoveToNewTopicCreated(evnt.data)
	}

	if (jsonObj._interface == 'topiclist_sortby_newest_response') {
        doRequestTopicList = false;//任务已成功,取消任务标记.//xu
        //console.log(JSON.stringify(evnt.data));
      	if (lastTopicTime == '-1') {//如果是第一次请求,需要返回到index.html里执行一次打开页面的操作.
			initOpenTopicsPage(evnt.data);//该方法在index.html里.xu
		} else {//如果话题列表页已经打开,则直接将数据显示出来:
			//exec('showTopicList','topics_page',evnt.data);
			exec("topics_page","showTopicList("+evnt.data+")");
			//document.getElementById("topics_page").contentWindow.showTopicList(evnt.data);
		}
	}

	if (jsonObj._interface == 'merge2anothertopic') {//进入合并及搜索页面初始化第一句话，由后台使用管理员帐号发出
		exec(jsonObj.target_topicid, "showAllPosters(" + evnt.data + ")");
	}

	if (jsonObj._interface == 'search_topics') {//进入合并及搜索页面初始化第一句话，由后台使用管理员帐号发出
		//exec("search_page", "showSearchResult(" + evnt.data + ")");
		exec(currentPageId, "showSearchResult(" + evnt.data + ")");
	}
    if(jsonObj._interface == 'getTopicsBelowMoreMsgs'){
        //exec("search_page", "appendMoreMsg(" + evnt.data + ")");
		exec(currentPageId, "appendMoreMsg(" + evnt.data + ")");
    }
	if (jsonObj._interface == 'getPeopleMoreTopics') {
		//exec("search_page", "appendSearchPeopleMoreTopics(" + evnt.data + ")");
		exec(currentPageId, "appendSearchPeopleMoreTopics(" + evnt.data + ")");
	}
	if (jsonObj._interface == 'newtopic') {//对创建新话题请求的回复确认.
		markNewTopicSuccess(evnt.data);
	}

	if (jsonObj._interface == 'after_newtopic_created') {//用于对话页中的话题并入操作.
		afterNewtopicCreated(evnt.data);
	}

	if (jsonObj._interface == 'moveto_existedtopic') {//进入合并及搜索页面初始化第一句话，由后台使用管理员帐号发出
		//alert("已经成功接入话题[" + jsonObj.topictitle_moveto + "].本页面将关闭.");
		var script = "enterDialogPage('" + jsonObj.topicid_moveto +"')";
		//console.log("requestMove2ExistedTopic()-script:"+script);
		exec("topics_page", script);
		//利用列表页上的打开代码打开新的对话页.
		removeTmpTopicId(jsonObj.tmp_topicid);
		//closeTmpWin();//APP项目使用该方法
        closeWin(jsonObj.tmp_topicid);// WEB项目使用该方法
		//最好延时关闭,关闭临时新窗页,删除数据中的临时tmptopicid.
	}

	if(jsonObj._interface == "batch_moveto_existedtopic"){
		var script = "enterDialogPage('" + jsonObj.topicid_moveto +"')";
		exec("topics_page", script);
		removeTmpTopicId(jsonObj.tmp_topicid);
		closeWin(jsonObj.tmp_topicid);// WEB项目使用该方法
	}

	if (jsonObj._interface == 'request_mytopiclist') {//用于对话页中的话题并入操作.
		//exec(jsonObj.current_topicid, "showMyTopicList('" + evnt.data + "','mergeto')");//有第二个参数,会破坏eventdata的传递.
		var pagename = getTmpTopicIdIfExisted(jsonObj.current_topicid);
		//有可能是在新创页面中就发生了并入操作.
		exec(pagename, "showMyTopicList(" + evnt.data + ")");
		//有第二个参数,会破坏eventdata的传递.
	}

	if (jsonObj._interface == 'request_mytopiclist_4moveto') {//用于新窗页中将对方话题直接接入我的另一个现有话题.
		//exec(jsonObj.tmp_topicid, "showMyTopicList('" + evnt.data + "','moveto')");//有第二个参数,会破坏eventdata的传递.
		exec(jsonObj.tmp_topicid, "showMyTopicList(" + evnt.data + ")");
	}

	if (jsonObj._interface == 'link2mytopic') {//搜索并点击后的连接操作.
		/*ret:{
		 "_interface":"link2mytopic",
		 success: yes/no,
		 "topicid_belinked":"---",//搜索并点击的话题id
		 "mytopicid":"---"//我的当前话题id
		 }*/
		var script = "markLink2MytopicSuccess_SearchPage('" + jsonObj.topictitle_belinked + "','" + jsonObj.topicid_belinked + "')";
		//exec("search_page", script);
		exec(currentPageId, script);
	}

	if (jsonObj._interface == 'link2mytopic_byrecommend') {//推荐并点击后的接入操作.
		/*
		 ret:{
		 "_interface":"link2mytopic_byrecommend",
		 success: yes/no,
		 "topictitle_belinked":"---",//推荐话题的title.
		 "recommended_pid":recommended_pid,
		 "mytopicid":"---"//我的当前话题id
		 }*/
		var pagename = getTmpTopicIdIfExisted(jsonObj.mytopicid);
		var script = "markLink2MytopicSuccess('" + jsonObj.topictitle_belinked + "','" + jsonObj.recommended_pid + "')";
		exec(pagename, script);
	}

	if (jsonObj._interface == 'block_user') {//移除成功的消息.
		//这个回复暂时不做处理. xu11.13 byValueToRemoveUser(evnt.data)
	}

	if (jsonObj._interface == 'get_topicsetup') {//对创建新话题请求的回复确认.
		showSetupInfo(evnt.data);
	}

	if (jsonObj._interface == 'update_nickname') {
		modifyNickname(jsonObj);
	}

	if (jsonObj._interface == 'whoistalkingwithyou') {//?0129 web版中增加,需同步到app版中.xu
		whoistalkingwithyou(evnt.data);
	}

	if (jsonObj._interface == 'connected_topic_list') {//邀请2016.8.25 zhang
		showConnectTopicList(evnt.data);
	}
	if (jsonObj._interface == 'createNewTopic2AppointedTopics') {//邀请 2016.8.26 zhang
		descendantNewtopic(evnt.data);
	}
	if (jsonObj._interface == 'get_personal_dialog_messages'){//获得私聊列表
		var topicId = jsonObj.mytid;
		exec(topicId,"showPersonalDialogHistory("+evnt.data+")");  //@wsy

	}

	if(jsonObj._interface == 'get_sorted_user_topics'){//@wsy
		console.log("websocket返回个人主页的话题记录")
		var _userId =jsonObj.userid;
		exec(_userId,"showSortedUserTopics("+evnt.data+")");
		//exec("user_others_page","showSortedUserTopics("+evnt.data+")");    2016/12/24 注 deng
	}

	if (jsonObj._interface == 'getUserStatisticData'){   //获取主页统计数据   deng
		//exec("topics_page","showHomePage("+evnt.data+")");
		var _userId =jsonObj.userid;
		exec(_userId,"loadHomePage("+evnt.data+")");
	}
	if (jsonObj._interface == 'getLinkedUsersTopicsCollection'){   //相连的人   deng
		exec("userTopics_page","displayLinkedUsersTopicsColl("+evnt.data+")");
	}
	if (jsonObj._interface == 'getUserLinkedTopics'){    //更多相连的人的话题   deng
		exec("userTopics_page","showUserLinkedTopics("+evnt.data+")");
	}
	if (jsonObj._interface == 'getMySuspendTopics'){    //暂停的话题   deng
		exec("userTopics_page","displayMySuspendTopics("+evnt.data+")");
	}
	if (jsonObj._interface == 'setTopicOpen'){    //恢复暂停的话题   deng
		exec("userTopics_page","promptMessage("+evnt.data+")")
	}

	if(jsonObj._interface == 'searchSelfTopicContent'){
		exec("topics_page", "displaySearchSelfTopicContent("+evnt.data+")");
	}

	if(jsonObj._interface == 'getMoreSelfHitMsgs'){
		exec("topics_page", "displayMoreSelfHitMsg("+evnt.data+")");
	}

	if(jsonObj._interface == 'getUserReqTopicMsgs'){
		var _topicId = jsonObj.topicid;
		exec(_topicId,"showUserReqTopicMessages("+evnt.data+")");
	}

}

function whoistalkingwithyou(eventdata) {//?0129 web版中增加,需同步到app版中.xu
	var jsonObj = JSON.parse(eventdata);
	var topicid = jsonObj.my_tid;
	var pagename = getTmpTopicIdIfExisted(topicid);
	console.log("whoistalking接口的目标topicid,也是pagename:" + topicid);
	var script;
	script = "showWhoistalking(" + eventdata + ")";
	exec(pagename, script);
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
			exec("topics_page", "showWebsocketStatus('ws_on')");
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
			exec("topics_page", "showWebsocketStatus('ws_closed')");
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
			exec("topics_page", "showWebsocketStatus('ws_closed')");
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


//请求当前话题窗口连接的话题列表,按最新交互过的时间排序.  ————张
function getConnectedTopicList(topicId,start,amount){
	console.log("connectedTopicList请求发了.");
	var json_obj = {
		_interface : "connected_topic_list",
		mytopicid : topicId,
		start : start,
		amount : amount
	};
	WS_Send(json_obj);
}

//解析返回数据  ————张
function showConnectTopicList(eventdata){
	console.log("connectedTopicList收到消息.");
	var jsonObj = JSON.parse(eventdata);
	exec(jsonObj.mytopicid,"processConnectData("+eventdata+")");
}

//在当前窗口中创建一个新话题,并通知到选中的相连接话题或全部选中的话题  ————张
function createNewTopic2AppointedTopics(topicId,userId,title,ifall,checktopicids) {
	var v_topicid = new Array();
	$("#" + topicId).contents().find("input[name='c_topicid']:checked").each(function (i) {
		v_topicid[i] = $(this).val();
	});
	console.log("createNewTopic2AppointedTopics请求发了.");
	var json_obj = {
		_interface: "createNewTopic2AppointedTopics",
		mytopicid: topicId,
		userid: userId,
		newtopictitle: title,
		tmp_topicid: new Date().getTime().toString(),
		tmp_pid: new Date().getTime().toString(),
		ifallconnectedtopics: ifall,
		appointedtopicids: v_topicid
	};
	WS_Send(json_obj);
	//exec(topicId,"processDescendantData()");
}

//解析返回数据  ————张
function descendantNewtopic(eventdata){
	console.log("createNewTopic2AppointedTopics收到消息.");
	var jsonObj = JSON.parse(eventdata);
	if(jsonObj.success=="yes"){
		exec(jsonObj.mytopicid,"processDescendantData("+eventdata+")");
	}
}
/*
@wsy
*/
//获得私聊聊天记录
function getPersonalDialog(mytid,myuid,oppuid,opptid){
	console.log("websocket.js中的getPersonalDialog()请求发送了..");
	var json_obj = {
		_interface : "get_personal_dialog_messages",
		mytid:mytid,
		myuid:myuid,
		oppuid:oppuid,
		opptid:opptid,
		firstMsgId : "-1",
		requestMsgCounts : 20,
		sort:"desc"
	};
	WS_Send(json_obj);
}

//获得他人话题
function getSortedUserTopics(userTopicsParam){
	console.log("websocket.getSortedUserTopics()请求发送了..");
	var json_obj = {
		"_interface":userTopicsParam._interface,
		"userid":userTopicsParam.userid,
		"myuid":userTopicsParam.myuid,
		"start":userTopicsParam.start,
		"requestTopicCounts":userTopicsParam.requestTopicCounts,
		"ifLinkedTopics":userTopicsParam.ifLinkedTopics
	};
	console.log(json_obj);
	WS_Send(json_obj);

}

//------------------------------
//获取用户主页统计数据   deng
function getUserStaticsticData(userId) {
	console.log("getUserStatisticData请求发了.");
	var json_obj = {
		_interface : "getUserStatisticData",
		userid : userId
	};
	WS_Send(json_obj);
}
//获取与当前用户相连的人  deng
function getLinkedUsersTopicsColl(myUserid,start,_userCount,_topicCount) {
	console.log("getLinkedUsersTopicsCollection请求发了.");
	var json_obj = {
		"_interface": "getLinkedUsersTopicsCollection",
		"myUserid": myUserid, "start": start, "requestUserCount": _userCount, "defaultTopicCount": _topicCount
	};
	WS_Send(json_obj);
}
//获取暂停的话题  deng
function getMySuspendTopics(myUserid) {
	console.log("getMySuspendTopics请求发了.");
	var json_obj = {
		"_interface": "getMySuspendTopics",
		"myUserId": myUserid
	};
	WS_Send(json_obj);
}
//获取更多指定用户与我相连的话题  deng
function getUserLinkedTopics(myUserid,userid,start,_topicCount) {
	console.log("getUserLinkedTopics请求发了.");
	var json_obj = {
		"_interface": "getUserLinkedTopics",
		"myUserId": myUserid, "userId":userid,"start": start, "requestTopicCounts": _topicCount};
	WS_Send(json_obj);
}
//恢复话题   deng
function setTopicOpen(topicId) {
	console.log("setTopicOpen请求发了.");
	var json_obj = {
		"_interface": "setTopicOpen","topicId": topicId.toString()
	};
	WS_Send(json_obj);
}

//搜索自己命中的话题内容  deng
function searchSelfTopicContent(_userid,_search_word,_page){
	console.log("searchSelfTopicContent 请求发了"+"userid"+ _userid+"search_word"+_search_word+"page"+ _page);
	var json_obj = {
		"_interface": "searchSelfTopicContent",
		"userid": _userid, "search_word":_search_word,"page": _page, "default_topics_num": 10, "default_posters_num": 3};
	WS_Send(json_obj);
}

//获取话题下的更多发言  deng
function getMoreSelfHitMsgs(_search_keyword,_topicid,_poster_page){
	console.log("getMoreSelfHitMsgs 请求发了");
	var json_obj = {
		"_interface": "getMoreSelfHitMsgs",
		"search_keyword": _search_keyword, "topicid":_topicid,"poster_page": _poster_page, "default_posters_num": 3};
	WS_Send(json_obj);
}

function getUserReqTopicMessages(_userId,_topicId){
	console.log("getUserReqTopicMsgs 请求发了");
	var json_obj = {
		"_interface": "getUserReqTopicMsgs",
		"userid": _userId, "topicid":_topicId};
	WS_Send(json_obj);
}

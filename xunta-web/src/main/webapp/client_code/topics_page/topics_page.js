function showWebsocketStatus(OnOrClosed) {
	var onlineofflineimgE = $("#showonlineoffline img");
	if (OnOrClosed == "ws_on") {
		onlineofflineimgE.attr("src", "../image/signal-orange.png");
	} else {
		onlineofflineimgE.attr("src", "../image/signal-gray.png");
	}
}

function checkTopicListSuccess(doRequestTopicList) {//这个方法已经没有用了，取消拖拉机效果的事件响应方法改变了
	//console.log("延时已到...");
	//$("#loadinganimation img").attr('src', 'image/tractor.jpg');
	//将动态等待图片换成静态图片.
	if (!doRequestTopicList) {//这是websocket.js中的全局变量.
		//console.log("话题列表 成功了呀!");
		//$("#loadingtext").text("话题列表已返回.");//成功的话,这个将被覆盖,看不到了.
	} else {
		//console.log("没成功,要打出网络不给力.并绑定点击事件.");
		//doRequestTopicList = false;
		//				$("#loadingtext").text("网络不给力呀! 稍后戳一下拖拉机再试试.");
		//				//
		//				$("#loadinganimation").click(function(evt) {
		//					//alert("点击了");
		//					$("#loadinganimation img").attr('src', 'image/tractor-short.gif');
		//					//恢复动态图片.
		//					$("#loadingtext").text("再次请求中...");
		//					//
		//					execRoot("initToGetTopicList()");
		//					$("#loadinganimation").unbind('click');
		//					//点击后马上取消这个事件绑定.
		//				});
	}
}

/**
 *	封装修改最新回复信息的dom元素
 *  */
function returnRecentMsg(name, content) {
	if (name == "寻Ta管理员"){//暂时先这么写，除了用topic_title==-1来判断之外应该也可以这么判断
		name = adminName;
	}
/*
	if (name.length > 10) {
		name = name.substring(0, 10) + "…";
	}
*/	
	name = cutStringIfTooLong(name,10);
/*	
	if (content.length > 20) {
		content = content.substring(0, 20) + "…";
	}
*/	
	content = cutStringIfTooLong(content,20);
	
	var recentMsg = $("<div></div>").attr("class", "recentmsg");
	var newReplyNickname = $("<div></div>").attr("class", "nickname").attr("id", "replyInfo").text(name);
	var newReplyContent = $("<div></div>").attr("class", "content").attr("id", "replyInfo").text(": " + content);
	recentMsg.append(newReplyNickname);
	recentMsg.append(newReplyContent);
	return recentMsg;
}


function showAccount() { 
	$("#account").show();
	setTimeout(function() {
		$("#account").hide()
	}, 3000);
}

/**
 *	话题创建成功后由dialog_page页面调用，将第一句话显示在话题列表页面里的最新回复
 *  */
function showNewReplyMsg(topicid, username, first_content) {
	var topicElement = $("#" + topicid);
	var recentMsg = $("<div></div>").attr("class", "recentmsg").text(username + ": " + first_content);
	topicElement.append(recentMsg);
}

/*
 修改话题列表页面的话题名字
 * */
function updateTopicName(topicid, newTopicName) {
	var targetTopicidElement = $("#" + topicid).find(".topictitle");
	targetTopicidElement.attr("title",newTopicName);//在title属性上留一个完整的标题.
	//var newTopicName = reduceTopicTitleLength(newTopicName);
	var newTopicName = cutStringIfTooLong(newTopicName,100);
	targetTopicidElement.text(newTopicName);
}
/*
function reduceTopicTitleLength(t){
	var tmpT = t;
	if (t.length > 15) {
		tmpT = t.substring(0, 15) + "…";
	}
	return tmpT
}
*/
/**
 *	当话题有新消息时，将最新消息显示在话题列表页面上指定话题的最新回复处  9.14 FANG
 * */
function moveToTop_NewestRepliedTopic(evtdata) {
	//判断有新消息的话题是否在话题列表中存在，如果存在则直接添加最新回复内容，如果不存在则需要先添加话题 10.7 FANG
	var topicId = evtdata.topicid;
	var tmp_topicid = evtdata.tmp_topicid;
	//console.log("moveToTop_NewestRepliedTopic topicId" + topicId);
	var selector = "#" + topicId;
	var targetTopicidElement = $(selector);
	var topic_title = evtdata.topic_title;
	var newReplyContent = evtdata.msg_arr[0].content;
	var newReplyTime = evtdata.msg_arr[0].msg_create_datetime_str;
	var senderId = evtdata.msg_arr[0].sender_id;
	var msg_type = evtdata.msg_arr[0].msg_type;
	var senderName = evtdata.msg_arr[0].sender_userinfo.name;
	newReplyTime = newReplyTime.substring(5, 16);
	var suspend = 10;
	if (msg_type == '4') {//如果是管理员推送消息并且是推送新窗的，要延迟2秒，目的是防止被新窗的话题因推送消息的顺序导致排在新窗话题漆面
		suspend = 5000;
	}
	setTimeout(function() {
		if (targetTopicidElement.length == 0) {//列表中不存在该话题
			appendElement(topic_title, topicId, 'new', newReplyTime, evtdata.msg_arr, senderName, newReplyContent, '1');
		} else {//列表中存在该话题
			//console.log("selector:"+selector);
			//console.log("targetTopicidElement:"+targetTopicidElement.text());
			var emptyDiv = $("<div></div>");
			targetTopicidElement.append(emptyDiv);//加这个空元素,只是为了让后面的另起一行. (为了自适应文字长度, 加了inline属性.)
			targetTopicidElement.append(returnRecentMsg(senderName, newReplyContent));
			if (targetTopicidElement.find(".recentmsg").length >= 4) {
				var tmpE = targetTopicidElement.find(".recentmsg").eq(0)
				tmpE.remove();
			}
			//console.log('topic_title     :'+topic_title);
			//clonedElement=targetTopicidElement.clone(true);
			//targetTopicidElement.remove();
			//$("#topic_list").prepend(clonedElement);
			if (senderId != userId & topicId != currentOpenDialogPageId & (tmp_topicid == 'null' || tmp_topicid != currentOpenDialogPageId)) {
				if (tmp_topicid != 'none') {
					//这是临时页面，如新建话题 或新窗
					if (senderId == '1') {
						//管理员回复的话不显示未读数，因为是新窗状态
						return;
					}
				}
				if (targetTopicidElement.find('.unread').length == 0) {//如果没有未读消息,则加上一个1;
					var unreadNum = $("<div class='unread'></div>").text(1);
					targetTopicidElement.find(".topictitle").append(unreadNum);
					//targetTopicidElement.find(".topictitle").append(unreadNum);
				} else {//如果已有未读消息,则加上1:
					var num = targetTopicidElement.find(".unread").text();
					num++;
					targetTopicidElement.find(".unread").text(num);
				}
			}
			targetTopicidElement.find(".latesttime").text(newReplyTime);
			//修改最新回复事件更新在话题列表页上
			$("#topic_list").prepend(targetTopicidElement);
			//据说,这样直接prepend就是移动了.
		}
	}, suspend);
}



function prependToTopicList(content) {//从dialog(在websocket.js 100行执行)中跨页执行. //没有失败处理.
	appendElement(content.content, content.topicid, 'new', content.create_datetime_str, 'post_topic');
	console.log('创建的话题   ' + content.content + '       ' + content.topicid);
}

function enterDialogPage_NewTopic() {
	tmptopicid = new Date().getTime();
	//生成时间戳记录临时唯一ID
	var userInfo = {
		"tmptopicid" : tmptopicid,
		"userid" : userId,
		"userName" : userName,
		"userImage" : userImg,
		"server_domain" : domain,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent
	};
	openWin(tmptopicid, 'dialog_page/dialog_page_newtopic.html', JSON.stringify(userInfo));
}

//	function initCurrentOpenDialogPageId(topicid) {
//		$('#' + topicid).find('.unread').remove()
//		currentOpenDialogPageId = 'null';
//	}
function removeUnreadNum(topicid) {
	$('#' + topicid).find('.unread').remove()
}


//改为直接调用common-xunta.js中的toast方法
//function toastStatus(msg) {
//	toast(msg);
//}
//将userinfo封装JSON:
function userInfoToJson(userType, userUid, userName, userImage, userOriginalUid, userLogOff) {
	var userInfo = {
		"type" : userType,
		"uid" : userUid,
		"name" : userName,
		"image" : userImage,
		"originalUid" : userOriginalUid,
		"logOff" : userLogOff
	};
	return userInfo;
}

/*移到common-xunta.js中了.
function toast(msg) {
api.toast({
msg : msg,
duration : 1000,
location : 'middle'
});
}
*/
/**
 *	加载获取更多话题  FANG 9.24
 *  */
function getMoreTopicList() {
    execRoot("requestTopicList()");
}

function updateNickname(newNickname){
	$("#account #username").text(newNickname);
	userName = newNickname;
}



var replySenderName = 'null'//记录点击内容回复消息时被点击用户昵称，解决用户自行删掉昵称后发言仍然会发送给指定的人
//客户端发出的消息先显示在屏幕上   9.15 FANG
var replyOpptid = 'null';
function afterInput(inputValue, tmpPid) {//输入框提交到inputSubmit,然后到这里(此时tmpPid="none");感叹号直接提交都到这里(此时tmpPid!=none).
	if(inputValue == "660419"){//这句密码是为了打开index.html中的log记录.
		openWin('root','index.html','');
		return;
	}

	if (tmpPid == 'none') {//如果tmpPid为none,则表示从输入框提交.如果不是none,则是发送失败后,点击感叹号再次提交的.
		tmpPid = new Date().getTime();				//生成临时发言id.
		showSelfPoster(inputValue, topicId, tmpPid);//消息直接上屏，并添加跳豆.
	}
	inputValue = specialLettersCoding(inputValue); 
	console.log("afterinput - inputValue:"+inputValue);
	//没有必要定义这个变量,暂时注释掉. xu11.01 var tmpTopicId="none";//已有话题页面,没有这个tmptopicid.
	if(replyTopic != 'null' & inputValue.indexOf(replySenderName) > -1){
        var str = "initSendPoster_Reply2thistopic('" + replyTopic + "','" + inputValue + "','" + tmpPid + "','" + topicId + "')";
        execRoot(str);
        if(!replyOpptid){
        	replyTopic = 'null';
        }
		
		sender_name = 'null';
	}else{
        var str = "initSendPoster('" + userId + "','" + inputValue + "','" + topicId + "','" + tmpTopicId + "','" + tmpPid + "')";//tmpTopicId这个时候的tmpTopicId应该是没用的了.
        execRoot(str);
        //var oppuid=$("#inputbox1").data("oppuid");
        //var oppuid="785470992830042112";
		// var opptid=$("#inputbox1").data("opptid");
		// console.log("oppuid ============="+oppuid)
		// console.log("opptid ============="+opptid)
		// execRoot("getPersonalDialog('"+userId+"','"+topicId+"','"+oppuid+"','"+opptid+"')");//@wsy 更新私聊对话框历史记录
		
	}
	//$("#notification").text('刚刚的发言已发往服务器:' + inputValue);
	console.log(' ExistedTopic 刚刚的发言已发往服务器:' + inputValue);
}



function showSelfPoster(content, senderTopicId, msgId) {//用户发言后先直接上屏并添加发送状态，然后等待服务器返回确认后修改其消息状态
	console.log(" showSelfPoster 发言上屏了.");
	var content, senderId, senderName, dialog_box, senderName_P, content_P, senderImg, senderImg_Div, senderDiv;
	var sender_topicid;
	senderId = userId;
	content = content;
	senderName = userName;
	
	/*if (senderName.length > 10) {//检查昵称长度是否大于7个字符，如果大于就阶段 //在显示聊天历史中也有这个判断.
		senderName = senderName.substring(0, 10) + '…';
	}*/
	senderName = cutStringIfTooLong(senderName,10);
	senderName = senderName + " [" + shortTitle + "]";//发言上屏也加上标题.	

	senderImage = userImage;
	sender_topicid = senderTopicId;
	dialog_box = $("#dialog_box");
	senderName_P = $("<div class='nc'></div>").text(senderName);
	//content_P = $("<p class='detail'></p>").attr("sender_topicid", sender_topicid).attr("senderId", senderId).attr("senderName", senderName).text(content);
	content_P = $("<div class='detail'></div>").text(content);
	//上面一句简化为这一句.那些属性目前没有用处.
	var postsending = $("<img class='postsending' src='../image/jumpingbean.gif'/>");
	content_P.append(postsending);
	//zheng:自己的私聊先取消
	//var personDialogImg = $("<img class='personal-dialog-self' src='../image/personal_dialog1.png' style='display:none;' onclick='openPersonalDialog()'/> ");
	//content_P.append(personDialogImg);
    if(typeof(replyOpptid) != "undefined" || replyOpptid != ''||replyOpptid != 'null'){
        content_P.click(function() {
			openPersonalDialog(this);
		});
    }
	//console.log("showSelfPoster userImage:"+userImage);
	//senderImg = $("<img />").attr("src", userImage).attr("id", senderId).attr("sender_topicid", sender_topicid).attr("senderId", senderId);
	senderImg = $("<img />").attr("src", userImage);
	////上面一句简化为这一句.那些属性目前没有用处.
	senderImg_Div = $("<div class='user-pic'></div>").append(senderImg);
	senderDiv = $("<div class='user my'></div>").attr("id", msgId);
	senderDiv.append(senderName_P).append(content_P).append(senderImg_Div);
	$("#msg_list").append(senderDiv);
	setTimeout(function() {//将聊天框里的消息落底 - 8.12
		document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
	}, 200);
}

/*

*/
function afterInput1(inputValue, tmpPid) {//@wsy私聊窗口: 输入框提交到inputSubmit,然后到这里(此时tmpPid="none");感叹号直接提交都到这里(此时tmpPid!=none).

	if (tmpPid == 'none') {//如果tmpPid为none,则表示从输入框提交.如果不是none,则是发送失败后,点击感叹号再次提交的.
		tmpPid = new Date().getTime();				//生成临时发言id.
		showSelfPoster1(inputValue, topicId, tmpPid);//消息直接上屏，并添加跳豆.
	}
	inputValue = specialLettersCoding(inputValue); 
	console.log("afterinput - inputValue:"+inputValue);
	// var str = "sendPersonalMessage('" + replyTopic + "','" + inputValue + "','" + tmpPid + "','" + topicId + "')";
 //        execRoot(str);
	console.log('私聊发言已发往服务器:' + inputValue);
	$(".p-detail .p-postsending").remove();
}



function showSelfPoster1(content, senderTopicId, msgId) {//@wsy私聊窗口: 用户发言后先直接上屏并添加发送状态，然后等待服务器返回确认后修改其消息状态
	console.log(" 私聊窗口 showSelfPoster 发言上屏了.");
	var content, senderId, senderName, dialog_box, senderName_P, content_P, senderImg, senderImg_Div, senderDiv;
	var sender_topicid;
	senderId = userId;
	content = "@"+replySenderName+": "+content;
	senderName = userName;
	
	senderName = cutStringIfTooLong(senderName,10);
	senderName = senderName + " [" + shortTitle + "]";//发言上屏也加上标题.	
	senderImage = userImage;
	sender_topicid = senderTopicId;
	dialog_box = $("#personalDialogHistory");
	senderName_P = $("<div class='p-nc'></div>").text(senderName);
	content_P = $("<div class='p-detail'></div>").text(content);

	var postsending = $("<img class='p-postsending' src='../image/jumpingbean.gif'/>");
	content_P.append(postsending);
	
	// var personDialogImg = $("<img class='personal-dialog-self' src='../image/personal_dialog1.png' style='display:none;' onclick='openPersonalDialog()'/> ");
	// content_P.append(personDialogImg);
	senderImg = $("<img />").attr("src", userImage);
	senderImg_Div = $("<div class='p-user-pic'></div>").append(senderImg);
	senderDiv = $("<div class='p-user p-my'></div>").attr("id", msgId);
	senderDiv.append(senderName_P).append(content_P).append(senderImg_Div);
	$("#personal_dialog_list").append(senderDiv);
	setTimeout(function() {//将聊天框里的消息落底 
		document.getElementById('personal_dialog_list').scrollTop = document.getElementById('personal_dialog_list').scrollHeight;
	}, 200);
}

function afterCheckedSendPosterSuccess(tmpPid, SendPosterSuccess) {//一般发言,新创话题,移动新建的延时检查处理都用这个方法.
	if (SendPosterSuccess) {
		alert(SendPosterSuccess);
		console.log("afterCheckedSendPosterSuccess 成功了,不作为");
	} else {//取消跳豆,加上感叹号,并绑定点击再请求的事件:
		console.log("afterCheckedSendPosterSuccess 失败, 取消跳豆,加上感叹号.");
		var thePosterElement = $("#dialog_box").find("#" + tmpPid);
		thePosterElement.find(".postsending").attr('src', "../image/acclaim-50x173.png");
		thePosterElement.click(function() {
			var thePosterElementObj = $("#dialog_box").find("#" + tmpPid);
			thePosterElementObj.find(".postsending").attr('src', '../image/jumpingbean.gif');
			afterInput(thePosterElement.find(".detail").text(), tmpPid);
			//发言再次发送后, 后台要判断一下tmpPid是否已经发过了,如果有,,则返回原来的topicid和内容.否则会重复.
			thePosterElement.unbind('click');
		});
	}
}

/*
function againSend(thePosterElementObj){
//alert("点击了!");
var thePosterElement = $("#dialog_box").find("#" + tmpPid);
thePosterElement.find(".postsending").attr('src', 'image/jumpingbean.gif');

//			thePosterElementObj.find(".postsending").attr('src', 'image/jumpingbean.gif');
//			afterInput(thePosterElement.find(".detail").text(), tmpPid, 'after');
//			//发言再次发送后, 后台要判断一下tmpPid是否已经发过了,如果有,,则返回原来的topicid和内容.否则会重复.
//			thePosterElement.unbind('click');
//点击后马上取消这个事件绑定.
}*/

/**
 *	服务器返回来的消息发送请求成功，替换掉临时的消息ID，并添加时间（并判断是否显示时间），由于是自己的消息则不需要添加事件 //修改发言时间,取消跳豆.
 *  */
function markSendPosterSuccess(tmpPid, pid, msgTye, postTimelong, postTimeStr) {//接受服务器收到消息的确认的方法 //msg是作为服务器返回的字符串传过来的,但是js好象是自动识别为json了.
	console.log("afterSendPosterSuccess 消息成功了, 取消跳豆, 修改发言时间,第一条发言开关取消.tmpPid=" + tmpPid);
	var element = $("#" + tmpPid);
	//服务端发送消息请求成功状态后，客户端接下来要做的事情  9.15 FANG
	//取消黑色跳豆
	//console.log("这里有时候是undefined, 要查一下. element:"+element.html());
	element.find(".detail .postsending").remove();
	//if(msgTye == '3'){//显示私聊图标 ——zheng 暂时先取消
	//	$(".personal-dialog-self").show();
	//}
	//			element.find(".detail .postsendingfailed").remove();
	//将服务器返回的消息ID替换掉临时生成的消息ID
	element.attr("id", pid);
	//添加时间字段
	//			dialog_box = $("#dialog_box");
	var postTimeLongMinute = postTimelong / 1000 / 60;
	var intervalEnough = ((postTimeLongMinute - 2) > (lastPostTimeLongMinute)) || ((postTimeLongMinute + 2) < (lastPostTimeLongMinute))
	if ((lastPostTimeLongMinute == 0) || intervalEnough) {//彬彬: 时间码是否显示的判断. //不论是滞后2分钟还是超前2分钟,都显示出.针对消息晚到的情况.xu
		postTimeHtml = $("<time class='send-time'></time>").text(postTimeStr);
		element.before(postTimeHtml);
	}
	lastPostTimeLongMinute = postTimeLongMinute;
}

function showWhoistalking(eventdata) {//?0129 web版中新增的方法,需同步到App中. xu
	console.log("已进入showWhoistalking方法:");
	//console.log(eventdata.my_tid);//my_tid:接收消息用户的话题id. 用于寻找话题页面. 到这里就用不到了.
	//console.log(eventdata.your_tid);//your_tid:关注对象的tid,用于寻找该tid下的最新发言.然后将his的头像显示在这个发言的右边.
	//console.log(eventdata.his_tid);//his_tid:未接接人的话题id,存为头像元素的属性值.用户点击并连接时要用到.
	//console.log(eventdata.his_nickname);//his_nickname:未连接人的昵称.用于用户点击头像时，在对话框中显示这个头像的昵称，提示用户要不要和他对接。
	//console.log(eventdata.his_image);//his_image:未连接人的头像url
	//console.log(eventdata.his_uid);//his_uid:未连接人的头像id.这个参数备用，可用于访问他的个人主页.
	//console.log("histopictitle:"+eventdata.his_topictitle);
	//console.log("histopictitle:"+eventdata.his_postcontent);//这个字段暂时没加.
	
	//2017年3月17日
//	var yourNewestPost_ThisTID = $(".other>[sender_topicid='" + eventdata.your_tid + "']:last");
//	//var yourNewestPost_ThisTID = $(".detail:last");
//	console.log("yourNewestPost_ThisTID: " + yourNewestPost_ThisTID.text());
//	var image = $("<div class='whoistalking' style='float:right;margin-top:5px;'><img src=" + eventdata.his_image + " /></div>");
//	yourNewestPost_ThisTID.after(image);
//	image.css({
//		"-webkit-animation" : "twinkling 2s infinite ease-in-out"
//	});
//	setTimeout(function() {
//		image.remove();
//		//alert("未连接人的头像应该删除了.");
//		//yourNewestPost_ThisTID.parent.remove(".whoistalking");这个删除方法备选.
//	}, 4000);
	

	/*start:叶夷  2017年3月17日
	 * 解决聊天页面中同一人小头像重复出现问题
	 * 首先在小头像div中加上id="whoistalking"+eventdata.his_tid，
	 * 然后通过id查找div
	 * 之后如果存在则小头像不显示
	 * 不存在则显示
	 */
	/*end:叶夷*/
	
	/*start:叶夷 2017年3月17日
	 * 然后通过id查找div进行判断
	 */
//	//var element=document.getElementById("whoistalking"+eventdata.his_tid);
//	if ($("#whoistalking"+eventdata.his_tid).length==0){//不存在
//		var yourNewestPost_ThisTID = $(".other>[sender_topicid='" + eventdata.your_tid + "']:last");
//		//var yourNewestPost_ThisTID = $(".detail:last");
//		console.log("yourNewestPost_ThisTID: " + yourNewestPost_ThisTID.text());
//		/*start:叶夷
//		 * 	添加id属性
//		 */
//		var image = $("<div class='whoistalking' id='whoidtalking"+eventdata.his_tid+"' style='float:right;margin-top:5px;'><img src=" + eventdata.his_image + " /></div>");
//		/*end:叶夷*/
//		yourNewestPost_ThisTID.after(image);
//		image.css({
//			"-webkit-animation" : "twinkling 2s infinite ease-in-out"
//		});
//		setTimeout(function() {
//			image.remove();
//			//alert("未连接人的头像应该删除了.");
//			//yourNewestPost_ThisTID.parent.remove(".whoistalking");这个删除方法备选.
//		}, 4000);
//	}
//	/*end:叶夷*/
	//var element=document.getElementById("whoistalking"+eventdata.his_tid);
	/*start:叶夷  2017年3月20日
	 * 小头像版本修正，如果是$("#whoistalking"+eventdata.his_tid).length==0，定位失败，所以将“whoistalking”去除，定位成功
	 */
	//console.log("测试："+$("#"+eventdata.his_tid).length);
	if ($("#"+eventdata.his_tid).length==0){//不存在
		var yourNewestPost_ThisTID = $(".other>[sender_topicid='" + eventdata.your_tid + "']:last");
		//var yourNewestPost_ThisTID = $(".detail:last");
		console.log("yourNewestPost_ThisTID: " + yourNewestPost_ThisTID.text());
		/*start:叶夷
		 * 	添加id属性
		 */
		var image = $("<div class='whoistalking' id='"+eventdata.his_tid+"' style='float:right;margin-top:5px;'><img src=" + eventdata.his_image + " /></div>");
		/*end:叶夷*/
		yourNewestPost_ThisTID.after(image);
		image.css({
			"-webkit-animation" : "twinkling 2s infinite ease-in-out"
		});
		setTimeout(function() {
			image.remove();
			//alert("未连接人的头像应该删除了.");
			//yourNewestPost_ThisTID.parent.remove(".whoistalking");这个删除方法备选.
		}, 4000);
	}
	/*end:叶夷*/
	
	//寻找your_tid的最新发言, 找不到就放弃.
	//在它的最新发言的元素区里放入his的头像,并以属性值存放nickname和uid. 同时用onclick绑上一个响应方法link2mytopic(,,),附在下面了.
	//如果已经有三个头像了,就不再放入.只需在后面加上... .
	//用户点击某个头像后,出一个对话框,显示: his_nickname正在和"your的昵称"对话. 是否接入his_nickname的话题[his_topictitle].
	//用户点击确认,则用link2mytopic接口发出请求.
}

function link2mytopic(topicid_belinked, topictitle_belinked) {
	//用户点击某个whoistalking头像后,出一个对话框,显示: his_nickname正在和"your的昵称"对话. 是否接入his_nickname的话题[his_topictitle].
	//用户点击确认,则用link2mytopic接口发出请求.

	//alert("进入了link2mytopic()方法.");//这块改成确认.可以取消.
	api.confirm({
		msg : "将当前话题连接Ta的" + topictitle_belinked + " ?", //his_nickname正在和"your的昵称"对话. 是否接入his_nickname的话题[his_topictitle].
		buttons : ['确定', '取消'],
	}, function(ret, err) {
		if (ret.buttonIndex == 1) {
			var script = "link2mytopic('" + topicid_belinked + "','" + topicId + "')";
			execRoot(script);
		}
	});
	console.log("要连接的topicid:=" + topicid_belinked);
}

function askIfLink2CurrentTopic(currentE) {
	var topicid_belinked = currentE.attr("sender_topicid");
	var topictitle_belinked = currentE.parent().find(".nc").text();
	var recommended_pid = currentE.attr("senderMsgId");
	api.confirm({
		msg : '将 ' + topictitle_belinked + ' 接入当前话题?',
		buttons : ['确定', '取消'],
	}, function(ret, err) {
		if (ret.buttonIndex == 1) {
			var script = "link2mytopic_byrecommend('" + topicid_belinked + "','" + topicId + "','" + recommended_pid + "')";
			execRoot(script);
		}
	});
}

function replyCurrentContent(obj) {//点击内容进行针对性回复 FANG 10.12
	//			var s_id = $(obj).attr("id");
	//	if(s_id == '1' || s_id == '2' || s_id == '4' || s_id == userId){//这些1/2/4值是指什么? xu 11.11//在showallposter中,调用前已加了判断,这里可以去掉了. xu 11.11
	//		return;
	//	}
	var sender_topicid = $(obj).attr("sender_topicid");
	//获取回复指定人的话题ID
	var sender_name = $(obj).attr("senderName");
	//获取回复指定人的名字
	//			var sender_uid = $(obj).attr("senderId");//获取回复指定人的用户ID，目前没有用，因为话题ID就能指向指定人接受的话题
	//因发送人名字和来自话题是通过字符串拼接的，但回复的时候只显示发送人名字，所以要拆分
	var targetIndex = sender_name.indexOf("[");
	var senderName;
	if (targetIndex == -1) {
		return;
	} else {
		senderName = sender_name.substring(0, targetIndex);
	}
	//获取输入框对象
	var elementInputBox = document.getElementById("inputbox");
	elementInputBox.focus();
	//保持焦点,防止键盘收起.
	elementInputBox.value = '@' + senderName + ': ';
	replySenderName = '@' + senderName + ': ';
	replyTopic = sender_topicid;
}

/*
 function insertRemoveUserInfo(msg) {//显示一条成功移除本群的对话消息.
 //			alert(JSON.stringify(msg));
 //			var removeUserInfo = msg.data;
 var removeUserName = msg.block_user_info.name;
 //$("#notification").text('踢出某人的请求,服务器已返回确认消息:' + removeUserName);
 var dialog_node = $("#dialog_box");
 var removeUserInfoElement = $("<div></div>").text('已将 ' + removeUserName + ' 移除本群');
 dialog_node.append(removeUserInfoElement);
 }
 */
function removeUserOrCreatTopic(obj) {
	//			var s_id = $(obj).attr("senderId");
	//		if(s_id == '1' || s_id == '2' || s_id == '4' || s_id == userId){//在showallposter中,调用前已加了判断,这里可以去掉了. xu 11.11
	//			return;
	//		}
	var currentTopicId;
	if (topicId == 'null') {
		//表示该话题不是创建话题页
		currentTopicId = tmpTopicId;
	} else {
		currentTopicId = topicId;
	}
	api.confirm({
		msg : '将 ' + $(obj).attr('sendername') + ' 屏蔽? 或新窗对话?',
		buttons : ['屏蔽', '新窗', '取消']
	}, function(ret, err) {
		if (ret.buttonIndex == 1) {//用户选择了屏蔽:
			execRoot("removeUserByTopic('" + currentTopicId + "'," + "'" + $(obj).attr("id") + "'," + "'" + $(obj).attr('sender_topicid') + "')");
			//在websocket.js中. 该方法可以移到本页中?
		} else if (ret.buttonIndex == 2) {//用户选择了新窗:
			console.log('确认为打开新窗...');
			if (topicId == 'null') {//打开新页面后,该页面如果是临时的,则不会再进来了.所以要把临时id删除. 原来是不等号,此处还要测试!
				//这句的参数应该是tmptopicid. xu10.25 execRoot("removeTmpTopicId('" + topicId + "')");
				var script = "removeTmpTopicId('" + tmpTopicId + "')";
				execRoot(script);
			}
			//console.log("$(obj).attr(senderId) = "+$(obj).attr("senderId"));
			//还要把from的topicid的名称带过来.
			var from_topictitle = "被移动的话题";
			enterDialogPage_MoveToNewTopic(userName, userImage, currentTopicId, $(obj).attr("sender_topicid"), $(obj).attr("senderId"), userId, from_topictitle, $(obj).attr("senderName"), $(obj).attr("senderImg"), $(obj).attr("senderContent"));
			//execRoot(scriptString);
			//从列表页打开新页面? 可以从本地打开吧? 为了降低本页代码量,这样也可以.
			console.log('从列表页执行代码, 打开新窗.');
		}
	});
}

//点击他人内容创建新话题 供聊天页跨页执行,是为了实现reload的目的.
//不限制在一个页面上创建新窗后, reload不需要了, 这个方法可以移动对话页上. xu9.17
function enterDialogPage_MoveToNewTopic(userName, userImg, current_topic_id, from_topicid, senderId, userId, from_topictitle, from_senderName, from_senderImg, from_senderContent) {
	var tmpTopicId = new Date().getTime();
	//用于生成一个新话题的临时唯一ID  9.16 FANG
	console.log('打开新页面 enterDialogPage_MoveToNewTopic from_topicid=' + from_topicid + "|tmpTopicId=" + tmpTopicId + "|senderid=" + senderId);

	var userInfo = {
		"topicid" : 'none',
		"tmptopicid" : tmpTopicId,
		"userid" : userId,
		"title" : '输入第一句,开始新窗对话...',
		"userName" : userName,
		"userImage" : userImg,
		"current_topic_id" : current_topic_id,
		"from_topicid" : from_topicid,
		"from_senderId" : senderId,
		"from_topictitle" : from_topictitle,
		"from_senderName" : specialLettersCoding(from_senderName),
		"from_senderImg" : from_senderImg,
		"from_senderContent" : specialLettersCoding(from_senderContent),
		"server_domain" : domain,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent
	};
	openWin(tmpTopicId, 'dialog_page/dialog_page_movetonewtopic.html', JSON.stringify(userInfo));
	//xu加上的.11.27//返回页面时要初始化话题列表页面的currentOpenDialogPageId变量,如果不初始化在回退到话题列表页时在没进入下一个聊天页面时，这时的消息如果发送到这里都会被认为已读，但实质上用户已经到了话题列表页 FANG 10.12

}

function justClick(which) {//制造一个空事件,以便在苹果上收起键盘.
	$("#notification").text(which);
}

function showMoreToDo() {
	$("#moretodobox").show();
	setTimeout(function() {
		$("#moretodobox").hide()
	}, 4000);
}

function getSetupInfo() {
	console.log("getSetupInfo() - topicId=" + topicId);
	execRoot("getSetupInfo('" + topicId + "')");
	//var script = "getSetupInfo('"+topicId+"')";
	//execRoot(script);
}

function showSetupBox(evntdata) {

	//alert("显示设置框.");
	//先获得服务器数据,然后显示是否check.
	//$("#moretodobox").hide();
	console.log(evntdata.private + "|" + evntdata.suspend);

	$("#private_topic")[0].checked = false;
	if (evntdata.private == "true") {
		$("#private_topic")[0].checked = true
	}
	$("#topic_suspended")[0].checked = false;
	if (evntdata.suspend == "true") {
		$("#topic_suspended")[0].checked = true
	}

	console.log("showSetupBox:" + $("#private_topic")[0].checked + "|" + $("#topic_suspended")[0].checked);

	$("#setupbox").show();

	/*
	 var arrayTitle = new Array();
	 arrayTitle[0]='免受打扰';
	 arrayTitle[1]='暂停使用';
	 var obj = api.require('multiSelector');
	 console.log("obj:"+obj);
	 obj.open({
	 content:arrayTitle
	 },function(ret,err){
	 var selectObj=":";
	 for (var index in ret.selectAry)
	 {
	 selectObj = selectObj + ret.selectAry[index];
	 }
	 api.alert({msg:'选择器选取的数据是'+ selectObj});
	 });*/

}

function submitSetup() {
	var boolean_private = false
	var suspend = false;

	if ($("#private_topic")[0].checked) {
		boolean_private = true;
		//alert("选择了屏蔽.");
	}
	if ($("#topic_suspended")[0].checked) {
		suspend = true;
		/*start:叶夷   2017.4.14
		 * topic_page中暂停话题不需要显示，在确定了暂停话题之后就调用topics_page_web.js中的suspendTopicDisplayNone方法使暂停的话题消失
		 * */
		exec("topics_page","suspendTopicDisplayNone('"+topicId+"')");
		/*end:叶夷*/
	}

	//console.log("私有:"+$("#private_topic").attr("checked"));
	//console.log("暂停:"+$("#topic_suspended").attr("checked"))
	var script = "setSetupInfo('" + topicId + "','" + boolean_private + "','" + suspend + "')";
	execRoot(script);
	
	$("#setupbox").hide();
}

function cancelSetup() {
	$("#setupbox").hide();
	/* 这个用于解决按取消时,滑动失效的问题.
	 setTimeout(
	 function(){
	 $("#setupbox").hide();
	 },300
	 )*/
}

function request_mytopiclist(page) {
	//alert("请求将该话题并入您的另一个话题? 第"+page+"页|每页:"+num_eachpage+"条|currenttopicid:"+current_topicid);
	var currentTopicId = topicId;
	if (topicId == "none") {
		currentTopicId = tmpTopicId
	}//针对在新窗页中未成功创建时点击直接接入按钮.
	console.log("request_mytopiclist()-" + topicId + "|" + tmpTopicId);
	var script = "request_mytopiclist('" + page + "','" + currentTopicId + "')";
	execRoot(script);
}

function showMyTopicList(evntdata) {
	var topics = evntdata.topics;
	var topic, mytopicE, clickfunction;
	var elib = $("#e-lib").clone();
	var mytopiclistframe = elib.find("#frame");
	mytopiclistframe.find(".user-pic img").attr("src", "../image/"+adminImageurl);
	mytopiclistframe.find(".nc").html(adminName);
	console.log(adminName+adminImageurl);
	//mytopiclistframe.find(".detail").text("请点击选择接入...");
	var mytopiclistE = elib.find(".mytopiclist");
	var page = mytopiclistE.attr("page");
	console.log("页:" + page);
	//page = 1;
	//mytopiclistE.attr("page",page);
	mytopicE = $("#e-lib .mytopic").clone();
	var rankNo;
	for (var i in topics) {
		topic = topics[i];
		console.log(topic.topicid + "|" + topic.topic_title);
		mytopicE = $("#e-lib .mytopic").clone();
		//mytopicE.attr("topicid",topic.topicid);
		rankNo = (page - 1) * 10 + (i - 0 + 1);
		console.log("rankno:" + rankNo);
		mytopicE.text(rankNo + ". " + topic.topic_title);
		if (topic.topicid == topicId) {//前一个判断用于聊天页中的并入,当前话题不可点击;xu11.02
			//这个时候不作为,只发出一个提示:
            clickfunction = "toast_popup('不能连接同一话题.请点击其它话题.',2500)";
            //mytopicE.attr("onclick", clickfunction);
		}else if(topic.linked == "yes"){//这种情况针对新窗中的直接移动,如果已经连接,则发一个提示:
            clickfunction = "toast_popup('此话题已经连接.请点击其它话题.',2500)";
            //mytopicE.attr("onclick", clickfunction);
        } else {//在下面绑定的方法中, 会判断是并入,还是新窗中的直接移动:
			clickfunction = "clickedMyTopic('" + topic.topic_title + "','" + topic.topicid + "')";
			//mytopicE.attr("onclick", clickfunction);
		}
		mytopicE.attr("onclick", clickfunction);
		mytopiclistE.append(mytopicE);
	}
	mytopicE = $("#e-lib .mytopic").clone();
    if(topics.length < 10){
        page = 1;
        mytopicE.text("--- 无更多话题 ---");
    }else{
        mytopicE.text("--- 更多话题 ---");
        page = page - 0 + 1;
        if (topicId != "none") {//用topicid来判断是否新窗.
            clickfunction = "request_mytopiclist('" + page + "')";
            //用于点击更多.
        } else {//如果是moveto
            clickfunction = "request_mytopiclist_4moveto('" + page + "')";
            //用于点击更多.
        }
        mytopicE.attr("onclick", clickfunction);
    }
	mytopiclistE.append(mytopicE);

	mytopiclistframe.find(".user").first().append(mytopiclistE);
	$("#msg_list").append(mytopiclistframe.html());
	$("#e-lib .mytopiclist").attr("page", page);
	document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
	//request_merge(topicId, evntdata.topics[0].topicid);
}

function clickedMyTopic(mytopictitle_clicked, mytopicid_clicked) {
	//var move2existedtopicE = $("#move2existedtopic");
	//console.log("topicid:"+topicId);
	//console.log("tmptopicid:"+tmpTopicId);
	if (topicId != "none") {//如果这个"直接接入"的元素存在,则为新窗页并且话题尚未创建成功(成功后会remove这个元素).
		//console.log("这个是merge操作, topicid:"+topicId);
		request_merge(mytopictitle_clicked, mytopicid_clicked);

	} else {
		//console.log("这个是moveto操作, tmptopicid:"+tmpTopicId);
		request_move2existedtopic(mytopictitle_clicked, mytopicid_clicked);
		//这个方法在新窗页面中.
	}
}

function request_merge(topictitle_mergeto, topicid_mergeto) {
	//alert("将当前话题并入["+topictitle_mergeto+"]?");//这个地方要换成可取消的.
	api.confirm({
		buttons : ['确定', '取消'],
		msg : "将当前话题并入[" + topictitle_mergeto + "]?",
	}, function(ret, err) {
		if (ret.buttonIndex == 1) {
			var script = "requestMerge('" + topicId + "','" + topicid_mergeto + "')";
			execRoot(script);
		}
	});
}

function verifyInputText(obj){//对输入框提交的字符串进行合法性预处理:	
	var elementInputBox = document.getElementById("inputbox");
	elementInputBox.focus();//保持焦点,防止键盘收起.
	var inputValue = elementInputBox.value;
	inputValue_tmp = inputValue.replace(/ /g,"");
//str = str.replace("\\","-thisisfanxiegangzifu-");//这个反斜框的替代符需要在上屏后再替换成一串临时字串,到websocket.js里传输前再替换回来.
//str = str.replace(/'/g,"-thisisdanyinhaozifu-");//同上.
//str = str.replace(/\"/g,"-thisisshuangyinhaozifu-");//同上.
	
	
	if (inputValue_tmp == "") {//如果为空,并且发言长度大于150不作为.
        toast('发言内容不能为空')
		return "invalidvalue";
        /*start:叶夷    2017.4.14
         * 将发言输入提交时有150个字符限制改为1000个字符的限制
         */
	}else if(inputValue.length > 1000){
        toast('内容长度不能大于1000个字符')
        /*end:叶夷 
         */
		return "invalidvalue";
	}else {
		console.log("inputValue:"+inputValue);
		elementInputBox.value = "";
	}
	return inputValue
}

function verifyInputText1(){//对私聊窗口输入框提交的字符串进行合法性预处理:	
	var elementInputBox = document.getElementById("inputbox1");
	elementInputBox.focus();//保持焦点,防止键盘收起.
	var inputValue = elementInputBox.value;
	inputValue_tmp = inputValue.replace(/ /g,"");
	if (inputValue_tmp == "") {//如果为空,并且发言长度大于150不作为.
        toast('发言内容不能为空')
		return "invalidvalue";
	}else if(inputValue.length > 150){
        toast('内容长度不能大于150个字符')
		return "invalidvalue";
	}else {
		console.log("inputValue:"+inputValue);
		elementInputBox.value = "";
	}
	return inputValue;
}

/**
 *	若标题字数过长则用省略号代替  9.14 FANG
 *  */
function showTitle() {
$('#title').text('[ ' + cutStringIfTooLong(title,14) + ' ]')
/*
	if (title.length >= 16) {
		$('#title').text('[ ' + title.substring(0, 15) + '…]');
	} else {
		$('#title').text('[ ' + title + ' ]');
	}
*/
}

function showWholeTitle() {//显示被截略标题的全部文字. //此处要加上修改标题的功能.???
	$("#wholetitlebox").show();
	$("#wholetitle").text(title);

	setTimeout(function() {
		$('#wholetitlebox').hide();
	}, 6000);
	//$("#changetitlebutton").show();
	/*
	 if (title.length >= 12) {
	 $('#title').text(title);
	 }*/
}

function changetitle() {
	api.prompt({
		buttons : ['确定', '取消'],
		title : '请输入新的标题:',
		text : title
	}, function(ret, err) {
		if (ret.buttonIndex == 1) {
			/**start:叶夷  2017年3月22日
			 * 		在修改话题名的时候增加去除特殊字符的方法
			 */
			var newTopicName = excludeSpecial(ret.text);
			/*
			 * end:叶夷
			 */
			if (newTopicName.length == 0) {
				toast('标题不能为空');
				return;
			}
			console.log("newTopicName.length="+newTopicName.length);
			if (newTopicName.length > 300) {
				toast('话题长度不能超过300个字符');
				return;
			}
			toast('话题名称修改中...');
			console.log("newTopicName="+newTopicName);
			ajaxRequestChangTitle(newTopicName);
		}
	});
}

function ajaxRequestChangTitle(newTopicName) {
	$.ajax({
		url : "http://" + domain + "/xunta-web/update_topic_name",
		action : "post",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		dataType : "jsonp",
		jsonp : 'callback',
		jsonpCallback : "success_save_user", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
		data : {
			userid : userId,
			topicid : topicId,
			new_topic_name : newTopicName
		},
		async : false,
		success : function(data, textStatus) {
			var status = data.res;
			if (status == 'success') {
				//$("#header #title").text(newTopicName);
				title = newTopicName;
				showTitle();//以缩减长度显示标题.
				toast('话题名称修改成功');
				exec("topics_page", "updateTopicName('" + topicId + "','" + title + "')");
			} else {
				toast('话题名字修改失败,可能是包含非法字符或服务器异常');
			}
		},
		error : function(data, textStatus) {
			toast("修改标题时出现通讯错误.请与开发者联系. data="+data + '|textStatus=' + textStatus);
			console.log("出现通讯错误:data="+data + '|textStatus=' + textStatus);
		}
	});
}

function markLink2MytopicSuccess(topictitle_belinked, recommended_pid) {
	var info = "[" + topictitle_belinked + "]成功接入当前话题.";
	costomToast(info, 1000, "middle");
	var targetDetail = $(".detail[senderMsgId = '" + recommended_pid + "']");//这个直接定位到发言框.两个css选择项要连在一起,不能有空格,这样才是对同一元素的双重界定. 如果有空格则表示后面的为下一级元素的条件.
	//定位发言内容的元素.在senderimg元素上也有这个属性,但没有包含进来.不知为什么.xu 2015.11.17
	//console.log("recommended_pid="+recommended_pid);
	console.log(targetDetail.html());
	
	targetDetail.unbind('click');//发言框上加了对号,事件取消.(头像上的事件没有取消,仍然有效.)
	targetDetail.attr("class","detail recommend");//去掉class中的cursor.
	//取消点击.//不知怎么,把detail的事件也取消了.可能是因为是同一个事件.
	//targetDetail.find(".plus-logo").remove();//删掉原来的加号.
	targetDetail.find(".plus-logo").attr("src", "../image/yes-20x20.png");
	//删掉原来的加号.借用原来的css.
	//targetDetail.append($("<img class='yes-logo' src='image/yes-20x20.png' />")); //append一个对号元素.
	//targetPlusLogo.attr("src","image/yes-20x20.png");
}

function click2RequestMyTopicList() {//merge和新窗中直接移入都是先请求我的话题列表.显示列表时再根据页面情况区别加上不同的点击方法.
	$("#e-lib .mytopiclist").attr("page", "1");
	request_mytopiclist(1, 10);
}

function adjustWidthsHeights(isQingting) {
	//console.log("进入一般对话页的adjustWidthsHeights方法.");
	if(isQingting == "yes"){
		document.getElementById("dialog_box").style.height = $("body").height() - $("#header").height() - 5 + "px";//如果不多减一点(这里-5),会出滚动条.
	}else{
		//console.log("先看看:inputframe宽度="+$("#inputframe").width());
		//var i = document.getElementsByTagName("body").first().style.width;
		/*这些句子在三星浏览器上会出错:
		var m = $(window).width();
		var j = $("body").width();
		var k = $("#inputframe").width();
		var l = $("#inputsubmit").width();
		
		log2root("window.width="+m+"|body.width="+j+"|inputframe.width="+k+"|inputsubmit.width="+l);
		*/
		//document.getElementById("inputframe").style.width = $("body").width()+"px";
		
		if( userAgent[0] == "PC" ){//PC和手机浏览器在body宽度上不一致.暂时用这个判断来弥补:
			document.getElementById("inputbox").style.width = $("#inputframe").width() - 50 + "px";
		}else{
			document.getElementById("inputbox").style.width = $("#inputframe").width() - 68 + "px";
		}
		
		
		//自适应调整输入框的宽度,因为右边有提交按钮图片.xu8.24
		//console.log("减去68,调整之后的: 'inputbox'宽度="+document.getElementById("inputbox").style.width);
		//console.log("先看看inputframe的offset="+$("#inputframe").offset().top);
		//document.getElementById("dialog_box").style.height = $("#inputframe").offset().top - 37 + "px";//如果被计算对象不是变动的,是不用offset的.
		document.getElementById("dialog_box").style.height = $("#inputframe").offset().top - $("#header").height() - 6 + "px";//如果不多减一点(这里-5),会出滚动条.
		
		//自适应调整对话框的高度.
		//console.log("调整之后的dialog_box高度="+document.getElementById("dialog_box").style.height);
	}
}


function inputboxOnFocus() {
	dialogboxFollowInput();
	//console.log("输入框获得焦点");
}

function inputboxOnBlur() {
	dialogboxFollowInput();
	//console.log("输入框    失去   焦点");
}

function dialogboxFollowInput() {//对话框高度随着输入框的位置变动而变动.目前只对安卓有效.
	var lastInputPosition = 0;
	var currentInputPosition;
	var i = 0;
	var j = 0;
	var intervalId = setInterval(function() {//循环跟踪inputframe变化,直到它不动了. - 8.12
		i++;
		currentInputPosition = $("#inputframe").offset().top;
		//$("#notification").text(i);
		if (currentInputPosition != lastInputPosition) {
			document.getElementById("dialog_box").style.height = $("#inputframe").offset().top - 37 + "px";
			j=0;
		} else {
			j++;
			if (j > 3) {
				clearInterval(intervalId);
				document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
				//$("#notification").text("dialogheight:"+document.getElementById("dialog_box").style.height);
				//$("#notification").text("inputframe posi:" + $("#inputframe").offset().top);
			}
		}
		lastInputPosition = currentInputPosition;
	}, 100);
	//发言提交后,会执行一次focus,也会触发这个方法.
}



function updateNickname(name) {
	userName = name;
}

var replySenderName = 'null'//记录点击内容回复消息时被点击用户昵称，解决用户自行删掉昵称后发言仍然会发送给指定的人
//客户端发出的消息先显示在屏幕上   9.15 FANG
var replyOpptid = 'null';
function afterInput(inputValue, tmpPid) {//输入框提交到inputSubmit,然后到这里(此时tmpPid="none");感叹号直接提交都到这里(此时tmpPid!=none).
	if(inputValue == "660419"){//这句密码是为了打开index.html中的log记录.
		openWin('root','index.html','');
		return;
	}

	/*if (tmpPid == 'none') {//如果tmpPid为none,则表示从输入框提交.如果不是none,则是发送失败后,点击感叹号再次提交的.
		var tmpPid=msgId;
		showSelfPoster(userName,inputValue,userImage,tmpPid,"my");//消息直接上屏，并添加跳豆.
	}*/
	
	inputValue = specialLettersCoding(inputValue); 
	console.log("afterinput - inputValue:"+inputValue);
	
	//var str = "sendPoster('" + toUserId + "','" + inputValue +"','" + tmpPid + "')";//tmpTopicId这个时候的tmpTopicId应该是没用的了.
    //execRoot(str);
	
    //chat.sendMsg(inputValue);//发送消息
	//chat.sendMsgToAll(inputValue);//发送消息给全部的人
	//chat.sendPrivateMsg(toUserId,inputValue);
	execRoot("sendmsg('"+toUserId+"','"+inputValue+"')");//给单独的人发消息
	//exec("main_page", "chat.sendPrivateMsg('" + toUserId + "','" + inputValue +"')");
	
    document.getElementById("inputbox").value="";
	
	console.log(' ExistedTopic 刚刚的发言已发往服务器:' + inputValue);
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

/**
 *	服务器返回来的消息发送请求成功，替换掉临时的消息ID，并添加时间（并判断是否显示时间），由于是自己的消息则不需要添加事件 //修改发言时间,取消跳豆.
 *  */
function markSendPosterSuccess(tmpPid, postTimelong, postTimeStr) {//接受服务器收到消息的确认的方法 //msg是作为服务器返回的字符串传过来的,但是js好象是自动识别为json了.
	console.log("afterSendPosterSuccess 消息成功了, 取消跳豆, 修改发言时间,第一条发言开关取消.tmpPid=" + tmpPid);
	var element = $("#" + tmpPid);
	//服务端发送消息请求成功状态后，客户端接下来要做的事情  9.15 FANG
	//取消黑色跳豆
	//console.log("这里有时候是undefined, 要查一下. element:"+element.html());
	element.find(".detail .postsending").remove();
	var postTimeLongMinute = postTimelong / 1000 / 60;
	var intervalEnough = ((postTimeLongMinute - 2) > (lastPostTimeLongMinute)) || ((postTimeLongMinute + 2) < (lastPostTimeLongMinute))
	if ((lastPostTimeLongMinute == 0) || intervalEnough) {//彬彬: 时间码是否显示的判断. //不论是滞后2分钟还是超前2分钟,都显示出.针对消息晚到的情况.xu
		postTimeHtml = $("<time class='send-time'></time>").text(postTimeStr);
		element.before(postTimeHtml);
	}
	lastPostTimeLongMinute = postTimeLongMinute;
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

function adjustWidthsHeights() {
	if( userAgent[0] == "PC" ){//PC和手机浏览器在body宽度上不一致.暂时用这个判断来弥补:
		document.getElementById("inputbox").style.width = $("#inputframe").width() - 50 + "px";
	}else{
		document.getElementById("inputbox").style.width = $("#inputframe").width() - 68 + "px";
	}
	document.getElementById("dialog_box").style.height = $("#inputframe").offset().top - $("#header").height() - 6 + "px";//如果不多减一点(这里-5),会出滚动条.
}

function  getHistoryMsg(userId,toUserId,firstMsgId){
	var data;
	if(firstMsgId=='-1'){
		data={"from_user_id":userId,
		      	  "to_user_id":toUserId/*,
			  "last_msg_id":firstMsgId*/};
	}else{
		data={"from_user_id":userId,
		      	  "to_user_id":toUserId,
			  "last_msg_id":firstMsgId};
	}
	
	$.ajax({
        url:"http://xunta.so:3000/v1/history_msg",
        type:"POST",
        dataType:"jsonp",
        jsonp:"callback",
        contentType: "application/json; charset=utf-8",
        data:data,
        async:false,
        success:function(data, textStatus) {
        	console.log("聊天记录请求成功"+data);
        	showDialogHistory(data);
        },
        error:function(data, textStatus) {
            console.log("聊天记录请求错误"+data);
        	return;
        }
    });
}

/**
 *	若标题字数过长则用省略号代替  9.14 FANG
 *  */
function showTitle() {
	$('#title').text('[ ' + cutStringIfTooLong(toUserName,14) + ' ]')
}





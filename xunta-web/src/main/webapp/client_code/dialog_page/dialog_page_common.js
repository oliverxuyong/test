var replySenderName = 'null'//记录点击内容回复消息时被点击用户昵称，解决用户自行删掉昵称后发言仍然会发送给指定的人
//客户端发出的消息先显示在屏幕上   9.15 FANG
var replyOpptid = 'null';
function afterInput(inputValue, tmpPid) {//输入框提交到inputSubmit,然后到这里(此时tmpPid="none");感叹号直接提交都到这里(此时tmpPid!=none).
	if(inputValue == "660419"){//这句密码是为了打开index.html中的log记录.
		openWin('root','index.html','');
		return;
	}

	/*if (tmpPid == 'none') {//如果tmpPid为none,则表示从输入框提交.如果不是none,则是发送失败后,点击感叹号再次提交的.
		tmpPid = new Date().getTime();				//生成临时发言id.
		showSelfPoster(inputValue, topicId, tmpPid);//消息直接上屏，并添加跳豆.
	}*/
	inputValue = specialLettersCoding(inputValue); 
	console.log("afterinput - inputValue:"+inputValue);
	
    //chat.sendMsg(inputValue);//发送消息
	//chat.sendMsgToAll(inputValue);//发送消息给全部的人
	chat.sendPrivateMsg(toUserName,inputValue);//给单独的人发消息
	
    document.getElementById("inputbox").value="";
	
	//$("#notification").text('刚刚的发言已发往服务器:' + inputValue);
	console.log(' ExistedTopic 刚刚的发言已发往服务器:' + inputValue);
}

function showSelfPoster(name, content,myOrOther) {//用户发言后先直接上屏并添加发送状态，然后等待服务器返回确认后修改其消息状态
	console.log(" showSelfPoster 发言上屏了.");
	var content, senderId, senderName, dialog_box, senderName_P, content_P, senderImg, senderImg_Div, senderDiv,msgId;
	senderId = userId;
	content = content;
	senderName = name;
	senderName = cutStringIfTooLong(senderName,10);
	senderName = " [" + senderName  +"]";//发言上屏也加上标题.	

	senderImage = userImage;
	dialog_box = $("#dialog_box");
	content_P = $("<div class='detail'></div>").text(content);
	senderName_P = $("<div class='nc'></div>").text(senderName);
    if(typeof(replyOpptid) != "undefined" || replyOpptid != ''||replyOpptid != 'null'){
        content_P.click(function() {
			openPersonalDialog(this);
		});
    }
	senderImg = $("<img />").attr("src", userImage);
	////上面一句简化为这一句.那些属性目前没有用处.
	senderImg_Div = $("<div class='user-pic'></div>").append(senderImg);
	senderDiv = $("<div class='user "+myOrOther+"'></div>").attr("id", msgId);
	//senderDiv.append(content_P).append(senderImg_Div);
	senderDiv.append(senderName_P).append(content_P).append(senderImg_Div);
	$("#msg_list").append(senderDiv);
	setTimeout(function() {//将聊天框里的消息落底 - 8.12
		document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
	}, 200);
}

/*function showOtherPoster(name, content) {//用户发言后先直接上屏并添加发送状态，然后等待服务器返回确认后修改其消息状态
	console.log(" showSelfPoster 发言上屏了.");
	var content, senderId, senderName, dialog_box, senderName_P, content_P, senderImg, senderImg_Div, senderDiv,msgId;
	senderId = userId;
	content = content;
	senderName = name;
	senderName = cutStringIfTooLong(senderName,10);
	senderName = " [" + senderName  +"]";//发言上屏也加上标题.	

	senderImage = userImage;
	dialog_box = $("#dialog_box");
	content_P = $("<div class='detail'></div>").text(content);
    if(typeof(replyOpptid) != "undefined" || replyOpptid != ''||replyOpptid != 'null'){
        content_P.click(function() {
			openPersonalDialog(this);
		});
    }
	senderImg = $("<img />").attr("src", userImage);
	////上面一句简化为这一句.那些属性目前没有用处.
	senderImg_Div = $("<div class='user-pic'></div>").append(senderImg);
	senderDiv = $("<div class='user other'></div>").attr("id", msgId);
	senderDiv.append(content_P).append(senderImg_Div);
	$("#msg_list").append(senderDiv);
	setTimeout(function() {//将聊天框里的消息落底 - 8.12
		document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
	}, 200);
}*/

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

//返回上一页   2016/12/25 deng
function backBtn(){
	if(_topicPageSign == 'yes'){
		execRoot("setCurrentPageId('main_page')");
		
		/*//首页的未读消息数减去
		var oneUnreadNum=$("#dialoglist_page").find("#"+toUserId).text();//一个人的未读数
		exec('main_page',"removeUnreadNum('"+oneUnreadNum+"')");*/
		
		//聊天列表未读数去除
		if(window.parent.document.getElementById("dialoglist_page")!=null ){//聊天列表打开过
			exec('dialoglist_page',"removeUnreadNum('"+toUserId+"')");
		}
		openWin('main_page', 'main_page/main_page.html', '');
	}else{
		closeWin(_tmpPageId);
	}
}

//关闭当前页，返回主界面   2016/12/25 deng
function closeBtn(){
	execRoot("setCurrentPageId('main_page')");
	//exec('main_page',"removeUnreadNum('"+topicId+"')");
	//首页的未读消息数减去
	var oneUnreadNum=$("#dialoglist_page").find("#"+toUserId).text();//一个人的未读数
	exec('main_page',"removeUnreadNum('"+oneUnreadNum+"')");
	
	//聊天列表未读数去除
	if(window.parent.document.getElementById("dialoglist_page")!=null ){//聊天列表打开过
		exec('dialoglist_page',"removeUnreadNum('"+toUserId+"')");
	}
	
	openWin('main_page', 'main_page/main_page.html', '');
	closeWin(_tmpPageId);
}
//显示历史信息
function showAllPosters(data) {
	for(var msg in data){
		var name=data[msg].from_user_name;
		var content=data[msg].msg;
		var userImage=data[msg].from_user_imgUrl;
		var msgId=data[msg].msg_id;
		var respondeUserId=data[msg].from_user_id;
		if (userId === respondeUserId) {
    		showSelfPoster(name, content,userImage,msgId,"my",true);
        } else {
        	showSelfPoster(name, content,userImage,msgId,"other",true);
        }
		
		//发言时间
		var postTimeStr=data[msg].create_time;
    	var postTimeLong =  new Date(postTimeStr.replace(new RegExp("-","gm"),"/").replace(/\"/g,"")).getTime();
		markSendPosterSuccess(msgId, postTimeLong, postTimeStr);
		
    	/*var postTimeLongMinute = postTimeLong / 1000 / 60;//long型时间戳,转换为分钟.
    	var intervalEnough = ((postTimeLongMinute - 2) > (lastPostTimeLongMinute)) || ((postTimeLongMinute + 2) < (lastPostTimeLongMinute))
    	var lastIndex = data.length - 1;
		if (msg == lastIndex || (lastPostTimeLongMinute == 0 || intervalEnough)) {
			var postTimeHtml = $("<time class='send-time'></time>").text(postTimeStr);
			$("#msg_list").prepend(postTimeHtml);
		}
		lastPostTimeLongMinute = postTimeLongMinute;*/
	}
	if(sort == 'asc'){
		document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
		sort =undefined;
	}
	firstMsgId=data[data.length-1].msg_id;
}

function showSelfPoster(name, content,userImage,msgId,myOrOther,isHistory) {//用户发言后先直接上屏并添加发送状态，然后等待服务器返回确认后修改其消息状态
	console.log(" showSelfPoster 发言上屏了.");
	var senderName, senderName_P, content_P, senderImg, senderImg_Div, senderDiv;
	senderName = name;
	senderName = cutStringIfTooLong(senderName,10);
	senderName = " [" + senderName  +"]";//发言上屏也加上标题.	

	senderImage = userImage;
	content_P = $("<div class='detail'></div>").text(content);
	senderName_P = $("<div class='nc'></div>").text(senderName);
    if(typeof(replyOpptid) != "undefined" || replyOpptid != ''||replyOpptid != 'null'){
        content_P.click(function() {
			openPersonalDialog(this);
		});
    }
	senderImg = $("<img />").attr("src", senderImage);
	////上面一句简化为这一句.那些属性目前没有用处.
	senderImg_Div = $("<div class='user-pic'></div>").append(senderImg);
	senderDiv = $("<div class='user "+myOrOther+"'></div>").attr("id", msgId);
	senderDiv.append(senderName_P).append(content_P).append(senderImg_Div);
	if(isHistory=="true"){
		$("#msg_list").prepend(senderDiv);
	}else{
		$("#msg_list").append(senderDiv);
		document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
	}
	
}

function showDialogHistory(msg) {//提供给如系统通知管理员等帐号直接将消息上屏的方法??? //显示聊天历史记录.
	var msgJson = msg;

	$("#loadingwrap").click(function(evt) {//填加再次请求的点击事件:
		getHistoryMsg(userId,toUserId,firstMsgId);
		$("#loadingwrap").unbind('click');	//点击后马上取消这个事件绑定.
	});
	var length = msgJson.length;
	if (length < requestMsgCounts) {
		$("#loadingtext").attr("class", "");
		$("#loading img").attr("src", "../image/threedotmoving.jpg");
		$("#loadingtext").text("无更多消息");
		$("#loadingwrap").unbind('click');
		//点击后马上取消这个事件绑定.
	} else {
		showAllPosters(msgJson);
		$("#loadingtext").attr("class", "cursor");
		$("#loading img").attr("src", "../image/threedotmoving.jpg");
		$("#loadingtext").text("查看更多消息");
	}
}
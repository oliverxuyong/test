//返回上一页   2016/12/25 deng
function backBtn(){
/*	if(_topicPageSign == 'yes'){
		execRoot("setCurrentPageId('main_page')");*/
	//退出聊天列表时首页的未读消息数去除
	exec('main_page',"removeUnreadNum()");
	
	//聊天列表未读数去除
	exec('dialoglist_page',"changeUnreadColor()");
	
	//openWin('main_page', 'main_page/main_page.html', '');
	closeWin('dialoglist_page');
}

//关闭当前页，返回主界面   2016/12/25 deng
function closeBtn(){
	execRoot("setCurrentPageId('main_page')");
	openWin('main_page', 'main_page/main_page.html', '');
	closeWin('dialoglist_page');
}

function showDialogList(data){
	for(var d in data){
		var createTime=data[d].create_time;//最新回复时间
		var ifread=data[d].ifread;//是否有未读
		var msg=data[d].msg;//消息内容
		var toUserId=data[d].to_user_id;
		var toUserImgUrl=data[d].to_user_imgUrl;
		var toUserName=data[d].to_user_name;
		
		var unreadNum=parseInt(Math.random() * 10) ;
		
		appendDialogElement(createTime,ifread,msg,toUserId,toUserImgUrl,toUserName,unreadNum);
	}
	//从首页传过来的聊天列表的未读信息
	if(unreadObjList.length>0){
		for(var i in unreadObjList){
			unreadMsg(unreadObjList[i].touserId,unreadObjList[i].unreadNum);
		}
	}
}

function appendDialogElement(createTime,ifread,msg,toUserId,toUserImgUrl,toUserName,unreadNum){
	var dialog=$("<div></div>").attr("class", "dialog cursor").attr("id", toUserId);
	var toUserImg="<img src="+toUserImgUrl+">";
	var dialogContent=$("<div></div>").attr("class", "dialog_content");
	
	var dialogContentTop=$("<div></div>").attr("class", "dialog_content_top");
	var dialogContentMsg=$("<div></div>").attr("class", "dialog_content_msg").text(msg);
	
	var dialogContentName=$("<div></div>").attr("class", "dialog_content_name").text(toUserName);
	var dialogContentTime=$("<div></div>").attr("class", "dialog_content_time").text(createTime);
	
	dialogContentTop.append(dialogContentName).append(dialogContentTime);
	dialogContent.append(dialogContentTop).append(dialogContentMsg);
	dialog.append(toUserImg).append(dialogContent);
	
	$("#dialog_list").append(dialog);
	dialog.click(function() {//绑定点击事件.
		enterDialogPage(toUserId,toUserName);
	});
}

function unreadMsg(respondeUserId,unreadNum){
	var unreadParent=$("#"+respondeUserId);
	if (unreadParent.find('.unread').length==0) {//如果没有未读消息,则加上一个1;
		var unreadNum = $("<div></div>").attr("class", "unread").text(unreadNum);
		unreadParent.append(unreadNum);
	} else {//如果已有未读消息,则加上1:
		var num = unreadParent.find('.unread').text();
		num++;
		unreadParent.find('.unread').text(num);
	}
}

//2017.08.15 叶夷目前首页未读消息提示的显示方案是这样的：
//如果A给我发了3条未读消息，B给我发了2条未读消息，首页显示的是5条未读消息，我打开和A的聊天页面，聊天列表里B的未读提示还存在，不过颜色变暗，首页的未读提示消失
//这里是使聊天列表没打开过有未读提示的聊天页未读提示颜色变暗
function changeUnreadColor(){
	$(".unread").css("cpacity","0.7");
}


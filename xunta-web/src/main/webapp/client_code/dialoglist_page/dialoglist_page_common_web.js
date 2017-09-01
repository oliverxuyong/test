//返回上一页   2016/12/25 deng
function backBtn(){
	if(_topicPageSign == 'yes'){
		execRoot("setCurrentPageId('main_page')");
		exec('main_page',"removeUnreadNum('dialoglist_page')");
		openWin('main_page', 'main_page/main_page.html', '');
	}else{
		closeWin('dialoglist_page');
	}
}

//关闭当前页，返回主界面   2016/12/25 deng
function closeBtn(){
	execRoot("setCurrentPageId('main_page')");
	openWin('main_page', 'main_page/topics_page.html', '');
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
		appendDialogElement(createTime,ifread,msg,toUserId,toUserImgUrl,toUserName);
	}
}

function appendDialogElement(createTime,ifread,msg,toUserId,toUserImgUrl,toUserName){
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
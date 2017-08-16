//返回上一页   2016/12/25 deng
function backBtn(){
	if(_topicPageSign == 'yes'){
		execRoot("setCurrentPageId('main_page')");
		openWin('main_page', 'main_page/main_page.html', '');
	}else{
		closeWin('dialoglist_page');
	}
}

//关闭当前页，返回主界面   2016/12/25 deng
function closeBtn(){
	execRoot("setCurrentPageId('main_page')");
	openWin('main_page', 'main_page/main_page.html', '');
	closeWin('dialoglist_page');
}

//2017.08.15 叶夷   显示匹配列表详细信息
function showMatchUsers(){
	var matchUsers=$("#showMatchUsers");

	var userimgUrl="http://www.mxunta.so:80/xunta-web/useravatar/thumb_img_804622010041896960/jpg/image";//头像
	var userName="叶汉良";//用户名
	var tagNames=new Array();
	tagNames.push("核武器");
	tagNames.push("核武器");
	tagNames.push("核武器");
	tagNames.push("核武器");
	tagNames.push("核武器");
	tagNames.push("核武器");
	tagNames.push("核武器");
	tagNames.push("核武器");
	tagNames.push("核武器");
	
	var matchUser=$("<div></div>").attr("class","matchUser");//一个匹配人
	
	var userimg=$("<div></div>").attr("class","userimg").append("<img src='"+userimgUrl+"'/>");//一个匹配人的头像
	var username=$("<div></div>").attr("class","username").text(userName);//一个匹配人的名字
	userimg.append(username);
	
	var userTags=$("<div></div>").attr("class","userTags");//一个匹配人选中的标签
	for(var tag in tagNames){
		var userTag=$("<div></div>").attr("class","userTag").text(tagNames[tag]);
		userTags.append(userTag);
	}
	
	//一个匹配人的发消息按钮
	var sendMsgButton=$("<div></div>").attr("class","sendMsg").text("发消息");
	sendMsgButton.click(function() {
		exec("main_page","enterDialogPage()");
	});
	
	matchUser.append(userimg).append(userTags).append(sendMsgButton);
	matchUsers.append(matchUser);
}
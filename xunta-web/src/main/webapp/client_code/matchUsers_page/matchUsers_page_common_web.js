//2017.08.15 叶夷   显示匹配列表详细信息
function showMatchUsers(userid,username,img_src,positiveCommonCps,negativeCommonCps){
	var matchUsers=$("#showMatchUsers");

	var userimgUrl=img_src;//头像
	var userName=username;//用户名
	
	var matchUser=$("<div></div>").attr("class","matchUser");//一个匹配人
	
	var userimg=$("<div></div>").attr("class","userimg").append("<img src='"+userimgUrl+"'/>");//一个匹配人的头像
	var username=$("<div></div>").attr("class","username").text(userName);//一个匹配人的名字
	userimg.append(username);
	
	var userPositiveTags=$("<div></div>").attr("class","userTags");//一个匹配人选中的标签
	for(var tag in positiveCommonCps){
		var userTag=$("<div></div>").attr("class","userTag positive").text(positiveCommonCps[tag].cptext);
		userTags.append(userTag);
	}
	
	var userNegativeTags=$("<div></div>").attr("class","userTags");//一个匹配人选中的标签
	for(var tag in negativeCommonCps){
		var userTag=$("<div></div>").attr("class","userTag negative").text(negativeCommonCps[tag].cptext);
		userTags.append(userTag);
	}
	
	//一个匹配人的发消息按钮
	var sendMsgButton=$("<div></div>").attr("class","sendMsg").text("发消息");
	sendMsgButton.click(function() {
		exec("main_page","enterDialogPage()");
	});
	
	matchUser.append(userimg).append(userPositiveTags).append(userNegativeTags).append(sendMsgButton);
	matchUsers.append(matchUser);
}
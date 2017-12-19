function requestDialogList(){
	$.ajax({
        url:"http://xunta.so:3000/v1/chat_list",
        type:"POST",
        dataType:"jsonp",
        jsonp:"callback",
        contentType: "application/json; charset=utf-8",
        data:{
        	from_user_id:userId
        },
        async:false,
        success:function(data, textStatus) {
        	console.log("聊天列表请求成功"+data);
        	showDialogList(data);
        },
        error:function(data, textStatus) {
            console.log("聊天列表请求错误"+data);
        	return;
        }
    });
}

/*//进入聊天页，别人的uid和我的uid都需要
function enterDialogPage(toUserId,toUserName,toUserImgUrl) {
	var pageParam = {
		"toUserId" : toUserId,
		"toUserName" : toUserName,//这里是为了测试
		"toUserImage" : toUserImgUrl,
		"userid" : userId,
		"userName" : userName,
		"userImage" : userImage,
		"server_domain" : domain,
		"userAgent":userAgent,
		"topicPageSign":"yes"
	};
	console.log("enterDialogPage toUserId=" + toUserId+"|toUserName="+toUserName);
//	openWin(topicid,'dialog_page/dialog_page.html',JSON.stringify(pageParam));
	openWin(toUserId,'dialog_page/dialog_page.html',JSON.stringify(pageParam));
}*/

//2017.12.13 叶夷  请求详细匹配人列表
function requestDetailMatchedUsers(){
	var paraStr = userId + "','" + requestCounts;
	execRoot("requestDetailMatchedUsers('"+ paraStr +"')");
}
//2017.12.13 叶夷  返回请求详细匹配人列表
function response_detail_matched_users(data){
	var matchedUserArr=data.matched_user_arr;
	for(var i in matchedUserArr){
		var userid=matchedUserArr[i].userid;
		var username=matchedUserArr[i].username;
		var img_src=matchedUserArr[i].img_src;
		var positiveCommonCps=matchedUserArr[i].positive_common_cps;
		var negativeCommonCps=matchedUserArr[i].negative_common_cps;
		showMatchUsers(userid,username,img_src,positiveCommonCps,negativeCommonCps);
	}
	
	//显示聊天列表
    requestDialogList();
}
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
	var paraStr = userId + "','" + requestAllCounts;
	execRoot("requestDetailMatchedUsers('"+ paraStr +"')");
}

//2017.12.13 叶夷  返回请求详细匹配人列表
function response_detail_matched_users(data){
	//请求之前先将匹配人列表内容清楚
	$("#showMatchUsers").empty();
	
	var matchedUserArr=data.matched_user_arr;
	matchUserList=matchedUserArr;
	showOnePageMatchUser();
	//显示聊天列表
    requestDialogList();
}

//2017.12.20  叶夷  这是请求一页匹配人详情数据
function showOnePageMatchUser(){
	if(matchUserList.length>0){
		var length=matchUserList.length>requestOneCounts?requestOneCounts:matchUserList.length;
		for(var i=0;i<length;i++){
			var userid=matchUserList[i].userid;
			var username=matchUserList[i].username;
			var img_src=matchUserList[i].img_src;
			var positiveCommonCps=matchUserList[i].positive_common_cps;
			var negativeCommonCps=matchUserList[i].negative_common_cps;
			showMatchUsers(userid,username,img_src,positiveCommonCps,negativeCommonCps);
		}
		
		matchUserList.splice(0,requestOneCounts);
	}else{//如果匹配人详细列表没有了，则显示没有更多了
		
	}
}

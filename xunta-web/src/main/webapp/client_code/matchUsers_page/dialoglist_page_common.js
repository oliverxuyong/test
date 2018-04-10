function requestDialogList(){
	$.ajax({
        url:window.location.protocol+"//xunta.so:3000/v1/chat_list",
        type:"POST",
        dataType:"jsonp",
        jsonp:"callback",
        contentType: "application/json; charset=utf-8",
        data:{
        	from_user_id:userId
        },
        async:false,
        success:function(data, textStatus) {
        	console.log("测试聊天列表请求后台返回结果："+JSON.stringify(data));
        	log2root("测试聊天列表请求后台返回结果："+JSON.stringify(data));
        	//showDialogList(data);
        	requestTopicDialogList(data);
        },
        error:function(data, textStatus) {
            console.log("聊天列表请求错误"+data);
            log2root("聊天列表请求错误"+data);
        	return;
        }
    });
}

//进入聊天页，别人的uid和我的uid都需要
function enterDialogPage(toUserId,toUserName,toUserImage,isTopic) {
	//var toUserImage=$("#"+toUserId).find("img").attr("src");
	var pageParam = {
		"toUserId" : toUserId,
		"toUserName" : toUserName,//这里是为了测试
		"toUserImage" : toUserImage,
		"userid" : userId,
		"userName" : userName,
		"userImage" : userImage,
		"server_domain" : domain,
		"userAgent":userAgent,
		"isTopic":isTopic,
		"topicPageSign":"yes"
	};
	console.log("enterDialogPage toUserId=" + toUserId+"|toUserName="+toUserName);
//	openWin(topicid,'dialog_page/dialog_page.html',JSON.stringify(pageParam));
	openWin(toUserId,preUrl+'/xunta-web/client_code/dialog_page/dialog_page.html',JSON.stringify(pageParam));
}

//未读消息去除
function removeUnreadNum(toUserId) {
	$('#' + toUserId).find('.unread').remove()
	//removeDiv($('#' + toUserId).find('.unread'),userAgent[1]);
}

//2018.04.08 叶夷  发请求群聊话题列表
function requestTopicDialogList(data){
	var paraStr =userId+"','"+data;
	execRoot("requestTopicDialogList('" + paraStr + "')");
}

//2018.04.08 叶夷  获得所有话题列表
function responseTopicDialogList(data){
	var chatmsgJSONArray=JSON.parse(data.chatmsgJSONArray);//这是所有的话题
	showDialogList(chatmsgJSONArray);
}
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
	var matchUsers=$("#showMatchUsers");
	//请求之前先将匹配人列表内容清楚
	matchUsers.empty();
	
	var matchedUserArr=data.matched_user_arr;
	matchUserList=matchedUserArr;
	
	//2017.12.22 叶夷  先在匹配人列表最顶上加上一个加载提示
	var loadingDiv=$("<div></div>").attr("class","loading").attr("id","loading").text("正在刷新...");
	matchUsers.append(loadingDiv);
	showOnePageMatchUser(matchUsers);//显示匹配人列表
	//列表显示完之后将滚动条自动隐藏"刷新"
	var loadingDivHeight=loadingDiv.height();
	$(".showMatchUsers").scrollTop(loadingDivHeight);
	
	//显示聊天列表
	if(isFirst==true){
		requestDialogList();
		isFirst=false;
	}
}

//2017.12.20  叶夷  这是请求一页匹配人详情数据
function showOnePageMatchUser(matchUsers){
	/*var matchUsers=$("#showMatchUsers");
	//2017.12.22 叶夷  先在匹配人列表最顶上加上一个加载提示
	var loadingDiv=$("<div></div>").attr("class","loading").attr("id","loading").text("正在刷新...");
	matchUsers.append(loadingDiv);*/
	var noMatchUserDiv=$("#noMatchUser");
	if(matchUserList.length>0){
		
		if(noMatchUserDiv.length<=0){
			noMatchUserDiv=$("<div></div>").attr("class","noMatchUser").attr("id","noMatchUser").text("更多");
		}else{
			noMatchUser.remove();
		}
		
		var length=matchUserList.length>requestOneCounts?requestOneCounts:matchUserList.length;
		for(var i=0;i<length;i++){
			var userid=matchUserList[i].userid;
			var username=matchUserList[i].username;
			var img_src=matchUserList[i].img_src;
			var positiveCommonCps=matchUserList[i].positive_common_cps;
			var negativeCommonCps=matchUserList[i].negative_common_cps;
			showMatchUsers(matchUsers,userid,username,img_src,positiveCommonCps,negativeCommonCps);
		}
		matchUsers.append(noMatchUserDiv);
		matchUserList.splice(0,requestOneCounts);//将显示出来的匹配人在数组中删除
	}else{//如果匹配人详细列表没有了，则显示没有更多了
		if(noMatchUserDiv.length<=0){
			noMatchUserDiv=$("<div></div>").attr("class","noMatchUser").attr("id","noMatchUser").text("更多");
			matchUsers.append(noMatchUserDiv);
		}
		noMatchUserDiv.html("没有了");
	}
	
	//如果开始的时候的匹配人不够甚至是没有，则在后面加上一个空白的尾巴，让其出现滚动条
	//var matchUsersLastChildren=matchUsers.children("div:last-child");
	//var noMatchUserDivPositionTop=noMatchUserDiv.position().top;//更多按钮的位置
	//var noMatchUserDivHeight=noMatchUserDiv.height();
	var divForScroll=$("#divForScroll");
	if(divForScroll.length>0){
		divForScroll.remove();
	}
	var matchUserListContentHeight = $("#showMatchUsers").height();//滚动条的内容高度
	var matchUsersHeight=$(".showMatchUsers").height();
	var loadingHeight=$("#loading").height();
	if(matchUserListContentHeight<(matchUsersHeight+loadingHeight)){//不能超出形成滚动条，则加上尾巴
		if(divForScroll.length<=0){
			divForScroll=$("<div style='float:left;width:100%'></div>").attr("id","divForScroll");
			matchUsers.append(divForScroll);
		}
		var divForScrollHeight=matchUsersHeight+loadingHeight+5-matchUserListContentHeight;
		divForScroll.css("height",divForScrollHeight);
	}
	
	//列表显示完之后将滚动条自动隐藏"刷新"
//	var loadingDivHeight=loadingDiv.height();
//	matchUsers.scrollTop(loadingDivHeight);
}

//滚动条顶部则刷新页面和滑倒底部请求下一批
$(".showMatchUsers").scroll(function(){
	var cpShowHeight = $(this).height();//可见高度  
	var cpShowContentHeight = $(this).get(0).scrollHeight;//内容高度  
	var cpShowScrollTop =$(this).scrollTop();//滚动高度  
	if(cpShowScrollTop<=0){//滚动到顶部，重新请求
		requestDetailMatchedUsers();
	}else if(0<=Math.abs(cpShowContentHeight -cpShowHeight-cpShowScrollTop) 
			&& Math.abs(cpShowContentHeight -cpShowHeight-cpShowScrollTop)<=2 
			){ //滑动到底部
		//改变更多标签按钮的内容
		$("#noMatchUser").html("正在加载...");
		//console.log("测试滑动到底部");
		//请求下一批匹配人列表
		showOnePageMatchUser($("#showMatchUsers"));//显示匹配人列表
	} 
});


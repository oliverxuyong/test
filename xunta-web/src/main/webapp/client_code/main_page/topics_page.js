function showWebsocketStatus(OnOrClosed) {
	var onlineofflineimgE = $("#showonlineoffline img");
	if (OnOrClosed == "ws_on") {
		onlineofflineimgE.attr("src", "../image/signal-orange.png");
	} else {
		onlineofflineimgE.attr("src", "../image/signal-gray.png");
	}
}

function showAccount() { 
	$("#account").show();
	setTimeout(function() {
		$("#account").hide()
	}, 3000);
}

//改为直接调用common-xunta.js中的toast方法
//function toastStatus(msg) {
//	toast(msg);
//}
//将userinfo封装JSON:
function userInfoToJson(userType, userUid, userName, userImage, userOriginalUid, userLogOff) {
	var userInfo = {
		"type" : userType,
		"uid" : userUid,
		"name" : userName,
		"image" : userImage,
		"originalUid" : userOriginalUid,
		"logOff" : userLogOff
	};
	return userInfo;
}
/**start:叶夷  2017年3月20日
 * topics_page中的username也必须修改
 */
function updateNickname(newNickname){
	//$("#account #username").text(newNickname);
	userName = newNickname;
}
/**
 * end:叶夷
 */



function requestCP(userId,requestNum,currentPage){//调用根页面上的同名方法.
	var paraStr = userId + "','" + requestNum + "','" + currentPage;
	execRoot("initToGetCP('"+ paraStr +"')");
}


//叶夷   2017.06.16  发送"标签选中"
function sendSelectCP(userId,cpid,text){
	var paraStr = userId + "','" + cpid + "','" +text;
	execRoot("sendSelectedCP('"+ paraStr +"')");
}


//叶夷   2017.06.16  发送"标签选中取消"
function sendUnSelectCP(userId,cpid){
	var paraStr = userId + "','" + cpid ;
	execRoot("sendUnselectedCP('"+ paraStr +"')");
}

//叶夷   2017.07.07  请求用户匹配缩略表
function requestTopMatchedUsers(userId,requestTopMUNum){
	var paraStr = userId + "','" + requestTopMUNum;
	execRoot("requestMatchedUsers('"+ paraStr +"')");
}

function removeUnreadNum(toUserId) {
	$('#' + toUserId).find('.unread').remove()
}

//标签搜索
function responseSearchTag(text){
	$.ajax({
        url:"http://xunta.so:3000/v1/find/tag",
        type:"POST",
        dataType:"jsonp",
        jsonp:"callback",
        contentType: "application/json; charset=utf-8",
        data:{text:text},
        async:false,
        success:function(data, textStatus) {
        	//console.log("标签搜索请求成功"+data);
        	sendKeyWordToBack(text,data);
        },
        error:function(data, textStatus) {
            console.log("标签搜索请求错误"+data);
        	return;
        }
    });
}

//标签添加
function searchToAddTag(){
	var suggestWrap = $('#gov_search_suggest');
	var text = $("#pop_tagName").val();//获得输入框的值
	$.ajax({
        url:"http://xunta.so:3000/v1/add/tag",
        type:"POST",
        dataType:"jsonp",
        jsonp:"callback",
        contentType: "application/json; charset=utf-8",
        data:{from_user_id:userId,
        		text:text},
        async:false,
        success:function(data, textStatus) {
        	//2017.08.09  叶夷  添加标签之后的显示
        	addCpShow(data);
        },
        error:function(data, textStatus) {
            console.log("标签搜索请求错误"+data);
        	return;
        }
    });
}

//2017.08.09  叶夷  显示我的标签
function requestMyCP(){
	$.ajax({
        url:"http://xunta.so:3000/v1/find/users/tags",
        type:"POST",
        dataType:"jsonp",
        jsonp:"callback",
        contentType: "application/json; charset=utf-8",
        data:{from_user_id:userId},
        async:false,
        success:function(data, textStatus) {
        	console.log("请求我的标签成功");
        	showMyCp(data);
        },
        error:function(data, textStatus) {
            console.log("请求我的标签成功");
        	return;
        }
    });
}

//2017.08.11 叶夷    判断这个标签是否被选中过
function sendIfSelectedCP(userId,cpid){
	var paraStr = userId + "','" + cpid;
	execRoot("sendIfSelectedCP('"+ paraStr +"')");
}

function return_sendIfSelectedCP(jsonObj){
	var text = $("#pop_tagName").val();//获得输入框的值
	var isSelect=jsonObj.is_select;
	var cpid=jsonObj.cpid;
	if(jsonObj.is_select=="false"){//没有被选择
		sendSelectCP(userId,cpid,text);
	}else{
		toast_popup("这个标签被选中过",2500);
	}
}
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
function sendSelectCP(userId,cpid,currentPage){
	var paraStr = userId + "','" + cpid + "','" + currentPage;
	execRoot("sendSelectedCP('"+ paraStr +"')");
}


//叶夷   2017.06.16  发送"标签选中取消"
function sendUnSelectCP(userId,cpid,currentPage){
	var paraStr = userId + "','" + cpid + "','" + currentPage;
	execRoot("sendUnselectedCP('"+ paraStr +"')");
}

//叶夷   2017.07.07  请求用户匹配缩略表
function requestTopMatchedUsers(userId,requestTopMUNum){
	var paraStr = userId + "','" + requestTopMUNum;
	execRoot("requestMatchedUsers('"+ paraStr +"')");
}



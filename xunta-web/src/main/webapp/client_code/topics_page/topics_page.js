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



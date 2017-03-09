
function loadHomePage(receivedData){
	if(receivedData.userid != undefined) {
        console.log("个人首页统计数据获取成功");
        var _linkedPersonCount = receivedData.linkedPersonCount;
        var _myTopicTotal = receivedData.myTopicTotal;
        var _mySuspendTopicCount = receivedData.mySuspendTopicCount;

        $("#linkedPersonCount").html(_linkedPersonCount);
        $("#myTopicTotal").html(_myTopicTotal);
        $("#mySuspendTopicCount").html(_mySuspendTopicCount);
    }
}

function showUserTopicsPage(flag){
    $("#statistic_data").hide();
    var tmpPageId = "userTopics_page";
    var _params = {
        "userId" : userId,
        "userName" : userName,
        "userImage" : userImage,
        "server_domain" : domain,
        "adminName": adminName,
        "adminImageurl": adminImageurl,
        "userAgent":userAgent,
        "tmpPageId":tmpPageId,
        "flag":flag
    };
    openWin(tmpPageId, 'user_page/userTopics_page.html', JSON.stringify(_params));
}
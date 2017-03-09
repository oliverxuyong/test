
//选项显示  相连的人、暂停的话题
function showTab(flag){
    if ("1" == flag) {   //暂停的话题
        $("#topicsColl").hide();
        $("#suspendTopicsList").show();
        $("#_topicsColl").attr("class", "_tab-ti _l");
        $("#_suspendTopics").attr("class", "_tab-ti _r");

        $("#topicsCollList").empty();

        execRoot("getMySuspendTopics('"+userId+"')");

    } else {    //相连的人
        $("#topicsColl").show();
        $("#suspendTopicsList").hide();
        $("#_topicsColl").attr("class", "_tab-ti lf");
        $("#_suspendTopics").attr("class", "_tab-ti rg");

        $("#suspendTopicsList").empty();

        execRoot("getLinkedUsersTopicsColl('"+userId+"',0,'"+_userCount+"','"+_topicCount+"')");

    }

}


//展示已连接的用户以及其相应的话题列表数据
function displayLinkedUsersTopicsColl(receivedData) {
    if (receivedData.myUserid != undefined) {
        var tstart = receivedData.start;
        var _resultCollection = receivedData.ResultCollection;
        if("" != _resultCollection) {
            displayTopicsColl(_resultCollection);
            if (_resultCollection.length == _userCount) {
                $("#topicsCollText").html("更多");
                var _start = parseInt(tstart);
                _start+=_userCount;
                $("#topicsCollMsg").attr("onclick", 'execRoot("getLinkedUsersTopicsColl(\'' + myUserId + '\',\'' + _start + '\','+_userCount+','+_topicCount+')")');
            } else {
                $("#topicsCollText").html("没有了");
                $("#topicsCollMsg").removeAttr("onclick");
            }
            console.log("展示已连接的用户以及其相应的话题列表...");
        }else{
            doToast("无数据",1000);
        }
    } else {
        console.log("获取数据失败：" + receivedData.code + "|" + receivedData.message);
        toast(receivedData.message);
    }
}

//展示相连用户话题
function displayTopicsColl(jsonData) {
    var info = "";
    for (var i = 0; i < jsonData.length; i++) {   //相连用户话题
        var _userId = jsonData[i].userid;
        var _userImage_url = jsonData[i].userimage_url;
        var _userName = jsonData[i].username;
        var _linkedTopicCount = jsonData[i].linkedTopicCount;

        info +='<div id="_linkedTopic'+_userId+'" class="linkedTopic-info">';
        info +='<div class="_di" onclick="openUserOthersPage(\''+_userId+'\',\''+_userName+'\',\''+_userImage_url+'\')"><img src="'+_userImage_url+'" ></div>';
        info +='<div class="_nikeName">'+_userName+'</div>';
        var _topicArr = jsonData[i].topicArr;

        info += displayLinkedTopics(_linkedTopicCount,_topicArr,_userId,0);

        info+='<input type="hidden" id="ltCount'+_userId+'" value="'+_linkedTopicCount+'"/></div>';
    }
    $("#topicsCollList").append(info);
}

//展示相连用户话题标题与内容
function displayLinkedTopics(_linkedTopicCount,_topicArr,t_userId,t_start){
    var msg = "";
    for(var j = 0;j<_topicArr.length;j++) {   //相连用户话题标题
        var _topicId = _topicArr[j].topicId;
        var _topicTitle = _topicArr[j].topictitle;
        msg += '<div class="_area"><div onclick="showMyLinkedTopics(\''+t_userId+_topicId+'_'+j+'\')"><div class="_title" >[' + _topicTitle + ']</div><div class="_align"><span id="_text'+_topicId+'_'+j+'" class="_sr">我的对接话题</span></div></div>';
       // msg +='<div style="clear:both;text-align:right;padding:0px 10px 6px 5px;font-size: 8px; "><span  >我的对接话题</span></div>';
        var _myLinkedTopics = _topicArr[j].myLinkedTopics;
        if ("" != _myLinkedTopics) {
            msg+='<div id="_myTopics'+t_userId+_topicId+'_'+j+'" style="display:none;">';
            for (var n = 0; n < _myLinkedTopics.length; n++) {   //相连用户话题标题对应的内容
                var _myLinkedTopicId = _myLinkedTopics[n].myLinkedTopicId;
                var _myTopicContent = _myLinkedTopics[n].myTopicContent;
                var _isqingting =_myLinkedTopics[n].isqingting;
                msg += n == 0 ?'<div class="_arrow"><img src="../image/linkIco.png"></div>':'';
                msg += '<div class="_content" onclick="openUserDialogPage(\'' + _myLinkedTopicId + '\',\'' + _myTopicContent + '\',\''+_isqingting+'\')">' + _myTopicContent + '</div>';
            }
            msg +="</div>";
        }
        msg +="</div>";
    }

    if(t_start>0){
        $("div#_more"+t_userId).remove();
    }

    //if(_topicArr.length == _topicCount) {

        var _start = parseInt(t_start);
        _start+=_topicCount;
    msg +='';
    if(_start < _linkedTopicCount){
        var _surplus = _linkedTopicCount - _start;
        msg +='<div id="_more'+t_userId+'" class="_moremsg" onclick="doUserLinkedTopics(\''+t_userId+'\',\''+_start+'\')"><span class="_moreText">'+_surplus+' more</span></div>';
    }
    return msg;
}

function showMyLinkedTopics(_topicId_j){
    var myTopicsNode = $("#_myTopics"+_topicId_j);
    var _nodeText = $("#_text"+_topicId_j);
    if(myTopicsNode.is(":hidden")){
        myTopicsNode.show();
        _nodeText.html("收起");
    }else{
        myTopicsNode.hide();
        _nodeText.html("我的对接话题");
    }
}

//更多话题
function doUserLinkedTopics(_userId,_start){
    execRoot("getUserLinkedTopics('"+myUserId+"','"+_userId+"','"+_start+"','"+_topicCount+"')");
}

//打开更多指定用户与我相连的话题
function showUserLinkedTopics(receivedData) {
    if (receivedData.myUserId != undefined) {
        var _topicArr = receivedData.topicArr;
        var t_userId = receivedData.userId;
        if ("" != _topicArr) {
            var t_start = receivedData.start;
            var _linkedTopicCount = $("#ltCount"+t_userId).val();

            var _linkedTopics = displayLinkedTopics(_linkedTopicCount,_topicArr, t_userId, t_start);

            $("#_linkedTopic" + t_userId).append(_linkedTopics);

            console.log("展示更多指定用户与我相连的话题数据...");
        }
    } else {
        console.log("获取数据失败：" + receivedData.code + "|" + receivedData.message);
        toast(receivedData.message);
    }
}

//展示本人已暂停的话题集
function displayMySuspendTopics(receivedData) {

    $("#suspendTopicsList").empty();

    if (receivedData.myUserId != undefined) {
        var _dataArr = receivedData.topicArr;
        if("" != _dataArr){
            var dataStr = "";
            var _click = "";
            for(var i = 0; i < _dataArr.length; i++){
                dataStr +='<div class="_hr"><div class="_recovery"> <button class="recoveryBtn" onclick="doTopicOpen(\''+_dataArr[i].topicId+'\')">恢复</button></div><div class="_r_title">'+_dataArr[i].topicTitle+'</div></div>';
            }

            $("#suspendTopicsList").append(dataStr);

            console.log("展示已暂停的话题集...");
        }else{
            doToast("无数据",1000);
        }
    } else {
        console.log("获取数据失败：" + receivedData.code + "|" + receivedData.message);
        toast(receivedData.message);
    }
}

//设置暂停话题恢复
function doTopicOpen(_topicId){
    doConfirm('是否确定恢复暂停的话题!','确定','取消',"execSetTopicOpen('"+_topicId+"')");
}

//确定恢复暂停的话题
function execSetTopicOpen(_topicId){
    doCancel("conf_window");
    execRoot("setTopicOpen('"+_topicId+"')");
}

//暂停的话题恢复信息
function promptMessage(receivedData){
    doToast(receivedData.status,500);
}

//打开他人主页
function openUserOthersPage(_othersId,_othersName,_otherImage){
    var _params = {
        "topicid":"",
        "userOtherId":_othersId,
        "title":"",
        "userOtherName":_othersName,
        "userOtherImage":_otherImage,
        "userOtherTopicId":"",
        "userId" : userId,
        "userName" : userName,
        "userImage" : userImage,
        "server_domain" : domain,
        "adminName": adminName,
        "adminImageurl": adminImageurl,
        "userAgent":userAgent
    };
    openWin(_othersId, 'user_others_page/user_others_page.html', JSON.stringify(_params));
}

//打开对应的话题窗口
function openUserDialogPage(_topicId,_topicTitle,_isqingting){
    var _params = {
        "topicid" : _topicId,
        "title" : _topicTitle,
        "userid" : userId,
        "userName" : userName,
        "userImage" : userImage,
        "server_domain" : domain,
        "isqingting" : _isqingting,
        "adminName": adminName,
        "adminImageurl": adminImageurl,
        "userAgent":userAgent
    };
    console.log("打开话题页面：DialogPage topicId=" + _topicId+"|topicTitle="+_topicTitle);
    openWin(_topicId,'dialog_page/dialog_page.html',JSON.stringify(_params));

}
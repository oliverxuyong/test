function showWebsocketStatus(OnOrClosed) {
	var onlineofflineimgE = $("#showonlineoffline img");
	if (OnOrClosed == "ws_on") {
		onlineofflineimgE.attr("src", "../image/dot-green.png");
	} else {
		onlineofflineimgE.attr("src", "../image/dot-gray.png");
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
	requestCPSuccese=false;//表示标签开始请求，然后标签请求完毕监测滑倒底部的方法才能继续请求下一批
	var paraStr = userId + "','" + requestNum + "','" + currentPage;
	execRoot("initToGetCP('"+ paraStr +"')");
}


//叶夷   2017.06.16  发送"标签选中"
function sendSelectCP(userId,cpid,text, property){
	//选中标签先判断是否是推荐的标签，如果是则在选择标签的时候加上标记返回后台
	var isPushCP;
	for(var index in pushCPIdArray){
		var pushCpID=pushCPIdArray[index];
		if(pushCpID==cpid){
			isPushCP=true;
			break;
		}
	}
	
	var paraStr = userId + "','" + cpid + "','" +text+"','"+ property+"','"+isPushCP;
	execRoot("sendSelectedCP('"+ paraStr +"')");
}


//叶夷   2017.06.16  发送"标签选中取消"
function sendUnSelectCP(cpid){
	var paraStr = userId + "','" + cpid ;
	execRoot("sendUnselectedCP('"+ paraStr +"')");
}

//叶夷   2017.07.07  请求用户匹配缩略表
function requestTopMatchedUsers(userId,requestTopMUNum){
	firstRequestTopMatchedUsers=false;//第一次请求匹配列表完毕
	var paraStr = userId + "','" + requestTopMUNum;
	execRoot("requestMatchedUsers('"+ paraStr +"')");
}

//首页未读消息去除
function removeUnreadNum() {
	$('.unread').remove();
	//removeDiv($('.unread'),userAgent[1]);
	//进入匹配人详情页则右下角的按钮消失
	$("#enterdialogList").hide();
}

//标签搜索
function responseSearchTag(text){
	$.ajax({
        url:window.location.protocol+"//xunta.so:3000/v1/find/tag",
        type:"POST",
        dataType:"jsonp",
        jsonp:"callback",
        contentType: "application/json; charset=utf-8",
        data:{text:text},
        async:false,
        success:function(data, textStatus) {
        	console.log("测试标签搜索后台返回结果："+JSON.stringify(data));
        	log2root("测试标签搜索后台返回结果："+JSON.stringify(data));
        	sendKeyWordToBack(text,data);
        },
        error:function(data, textStatus) {
            console.log("标签搜索请求错误"+data);
            log2root("标签搜索请求错误"+data);
        	return;
        }
    });
}

var addCPID;//用来添加标签的cpid,没有则为空
//标签添加
function searchToAddTag(isGuideToAddTag){
	var suggestWrap = $('#gov_search_suggest');
	//var text = excludeSpecial($("#pop_tagName").val());//获得输入框的值,并且过滤特殊字符
	var text = $("#pop_tagName").val();
	var strLength=text.length;
	//var reg = /^(\d{1,2})|(\s{1,2})$/;//^\d+$表示纯数字      ^[^\w\s+]$ 纯符号的正则       ^\\s+$纯空格
	var regNumber=/^\d+$/;//表示纯数字
	var regSign=/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\，|\。|\、|\；|\‘|\’|\（|\）|\！|\·]/;//表示纯符号
	var isPureDigital=regNumber.test(text);//是纯数字true
	var haveSign=regSign.test(text);//含有符号true
	if(isPureDigital || haveSign || strLength<2){
		toast('要添加有意义的关注点喔');
	}else if(strLength>20){
		toast('标签长度不能超过20个字符');
	}else if(strLength<=0){
		toast("标签内容不能为空");
	}else{
		var paraStr = userId + "','" + addCPID+"','"+text+"','"+isGuideToAddTag;
		execRoot("add_self_cp('"+ paraStr +"')");
	}
}

//返回添加标签结果
function return_add_self_cp(data){
	addCpShow(data);
}

//2017.08.09  叶夷  显示我的标签
/*function requestMyCP(){
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
}*/
function requestMyCP(){
	execRoot("request_user_selected_cp('"+ userId +"')");
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
		//showSelectTag(cpid,text);
		//sendSelectCP(userId,cpid,text);
		chooseCP(null,cpid,text);
		closePop();//添加标签框关掉
	}else{
		toast_popup("这个标签被选中过",2500);
	}
}

//进入聊天页，别人的uid和我的uid都需要
function enterDialogPage(toUserId,toUserName,muImg) {
	var pageParam = {
		"toUserId" : toUserId,
		"toUserName" : toUserName,// 这里是为了测试
		"toUserImage" : muImg,
		"userid" : userId,
		"userName" : userName,
		"userImage" : userImg,
		"server_domain" : domain,
		"userAgent" : userAgent,
		"topicPageSign" : ""
	};
	console.log("enterDialogPage toUserId=" + toUserId + "|toUserName="
			+ toUserName);
	
	if(window.parent.document.getElementById(toUserId)!=null ){//聊天列表打开过
		//在打开聊天页的时候请求共同选择的标签
		exec(toUserId, "requestSelectCP()");
		
		//将_topicPageSign赋值为""
		exec(toUserId, "setTopicPageSignIsNull()");
	}
	
	// openWin(topicid,'dialog_page/dialog_page.html',JSON.stringify(pageParam));
	openWin(toUserId, preUrl+'/xunta-web/client_code/dialog_page/dialog_page.html', JSON.stringify(pageParam));
	//打开了聊天页的时候将数据传给后台
	var paraStr = userId + "','" + toUserId;
	execRoot("request_openDialogPage('"+ paraStr +"')");
}

// 2017.07.26 叶夷 进入聊天列表页，需要我的id
/*function EnterdialogList() {
	var pageParam = {
		"userid" : userId,
		"userName" : userName,
		"userImage" : userImg,
		"server_domain" : domain,
		"adminName" : adminName,
		"adminImageurl" : adminImageurl,
		"userAgent" : userAgent,
		"topicPageSign" : "yes",
		"unreadObjList":unreadObjList
	};
	console.log("enterDialogListPage userId=" + userId);
	openWin('matchUsers_page', 'matchUsers_page/matchUsers_page.html', JSON
			.stringify(pageParam));
	//进入聊天列表页聊天未读信息清空
	unreadObjList.splice(0,unreadObjList.length);
}*/

var myTagArray=new Array();//2017.12.27 保存我的标签传给匹配人详情页
function insertMyTagArrayNoRepeat(cpid,text){//防止在插入的时候出现我的标签容器中的数据重复问题
	var obj = {
			 cpid:cpid,
			 cptext:text
	       }
	 
	//2018.01.04 叶夷 在选择标签是装进数组的时候判断是否重复
	var myTagArrayIsRepeat=false;
	for(var i in myTagArray){
		if(myTagArray[i].cpid==cpid){
			myTagArrayIsRepeat=true;
			break;
		}
	}
	if(!myTagArrayIsRepeat){
		myTagArray.push(obj);//2017.12.27  叶夷  将选择时的标签放入数组中
	}
}
//2017.07.26 叶夷 进入匹配人详情页
function enterMatchUsersPage() {
	var pageParam = {
		"userid" : userId,
		"userName" : userName,
		"userImage" : userImg,
		"server_domain" : domain,
		"adminName" : adminName,
		"adminImageurl" : adminImageurl,
		"userAgent" : userAgent,
		"topicPageSign" : "yes",
		"unreadObjList":unreadObjList,
		"myTagArray":myTagArray
	};
	
	if(window.parent.document.getElementById("matchUsers_page")!=null ){//匹配人详情列表打开过
		exec("matchUsers_page", "response_user_selected_cp('"+JSON.stringify(myTagArray)+"')");
		//exec("matchUsers_page", "requestDetailMatchedUsers()");
		exec("matchUsers_page", "clearMyTagIds()");
	}
	
	console.log("enterDialogListPage userId=" + userId);
	openWin('matchUsers_page', preUrl+'/xunta-web/client_code/matchUsers_page/matchUsers_page.html', JSON
			.stringify(pageParam));
	//进入聊天列表页聊天未读信息清空
	unreadObjList.splice(0,unreadObjList.length);
}

//2017.07.07 叶夷 这是用户刚开始打开网页的时候请求的后端返回的匹配人列表
function responseTopMatchedUsers(muData) {
	var matchedUserArr = muData.matched_user_arr;// 获得后台发送的匹配人排名信息数组
	//2017.11.13 等推荐标签动画完成再进行匹配人位置算法
	//showMatchPeople(matchedUserArr);// 显示匹配人列表
	/*timeOutSuccess = setTimeout(function() {
		showMatchPeople(matchedUserArr);// 显示匹配人列表
	},2000);*/
	
	//2018.03.14  叶夷   在这里进行判断，如果matchedUserArr没有数据则显示引导页匹配人，如果有则隐藏
	if(matchedUserArr.length>0){
		hideGuideMatchUsers();
		showMatchPeople(matchedUserArr);// 显示匹配人列表
	}else{
		showMatchPeople(matchedUserArr);// 显示匹配人列表
		showGuideMatchUsers();
	}
}

// 2017.07.07 叶夷 匹配用户改变
function push_matched_user(newMuData) {
	var newMatchedUserArr = newMuData.new_user_arr;// 获得后台发送的匹配人排名信息数组
	// 如果有新数据，先判断动画有没有运行完
	if (circleEnd) {// 如果运行完，则直接进入程序运行
		//2018.03.14  叶夷   在这里进行判断，如果matchedUserArr没有数据则显示引导页匹配人，如果有则隐藏
		if(newMatchedUserArr.length>0){
			hideGuideMatchUsers();
			showMatchPeople(newMatchedUserArr);// 显示匹配人列表
		}else{
			showMatchPeople(newMatchedUserArr);// 显示匹配人列表
			showGuideMatchUsers();
		}
		//showMatchPeople(newMatchedUserArr);
	} else {// 如果没有运行完则将新数据放入队列中
		muDataQueue.push(newMatchedUserArr);
	}
}

//2017.11.07  叶夷   用一个数组将后台推荐的标签存储起来，在选择的时候判断是否是推荐的标签
var pushCPIdArray=new Array();
//2017.09.04 叶夷    CP推荐
function pushCP(data){
	//将推荐的标签装入数组中
	var cpWrap=data.cp_wrap;
	for(var index in cpWrap){
		pushCPIdArray.push( cpWrap[index].cpid);
	}
	
	responseToCPRequest(data);
}

/*
将选中图片上传到服务器
*/
function upload() {
	var formData = new FormData();
	formData.append('userid', userId);
	formData.append('file', $('#file')[0].files[0]);
	$.ajax({
		url : window.location.protocol+"//"+domain+"/xunta-web/upload", //server script to process data
		type : 'POST',
		beforeSend : beforeSendHandler,
		data : formData,
		dataType : 'JSON',
		timeout : 5000,
		cache : false,
		contentType : false,
		processData : false
	}).done(function(ret) {
		afterSuccessAlterUserImage(ret);
	}).fail(function(ret) {
		toast("传输失败，请检查网络");
	});
}

//2018.03.08  叶夷    通过请求请求服务器判断是否出现引导页
function ifUserInited(userId){
	var paraStr = userId;
	execRoot("ifUserInited('"+ paraStr +"')");
}
//2018.03.08  叶夷    通过请求请求服务器判断是否出现引导页
function sendShowGuidePageSecond(){
	execRoot("sendShowGuidePageSecond()");
}
//2018.03.08  叶夷      点击向下箭头按钮数据传给后台
function sendClickGuideAddTagText(userId){
	var paraStr = userId;
	execRoot("sendClickGuideAddTagText('"+ paraStr +"')");
}
//2018.03.08  叶夷      在引导页点击添加标签数据传给后台
function sendGuidePageAddTag(userId){
	var paraStr = userId;
	execRoot("sendGuidePageAddTag('"+ paraStr +"')");
}

//2018.02.05  叶夷     进入公司简介页面
function enterProfilePage() {
	console.log("enterProfilePage");
	openWin('profile_page', preUrl+'/xunta-web/client_code/profile_page/profile_page.html', "");
}
//2018.02.05  叶夷     进入产品介绍页面
function enterProductPage() {
	console.log("enterProductPage");
	openWin('product_page', preUrl+'/xunta-web/client_code/product_page/product_page.html', "");
}
//2018.03.16  叶夷     引导页出来的时候发送请求给后台
function sendShowGuidePageFirst() {
	console.log("sendShowGuidePageFirst");
	execRoot("sendShowGuidePageFirst()");
}
//刚打开页面时获得消息未读数
function responseUnreadMsgCount(data){
	var allUnreadNum=data.allUnreadNum;
	var unreadParent=$("#enterdialogList");
	//有未读消息过来则显示
	unreadParent.show();
	if (unreadParent.find('.unread').length==0) {// 如果没有未读消息,则加上一个1;
		var unreadNum = $("<div></div>").attr("class", "unread").text(allUnreadNum);
		unreadParent.append(unreadNum);
	} else {// 如果已有未读消息,则加上1:
		var num = parseInt(unreadParent.find('.unread').text())+allUnreadNum;
		unreadParent.find('.unread').text(num);
	}
}

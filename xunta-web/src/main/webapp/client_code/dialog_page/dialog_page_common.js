var replySenderName = 'null'//记录点击内容回复消息时被点击用户昵称，解决用户自行删掉昵称后发言仍然会发送给指定的人
//客户端发出的消息先显示在屏幕上   9.15 FANG
var replyOpptid = 'null';
function afterInput(inputValue, tmpPid) {//输入框提交到inputSubmit,然后到这里(此时tmpPid="none");感叹号直接提交都到这里(此时tmpPid!=none).
	document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
	
	if(inputValue == "660419"){//这句密码是为了打开index.html中的log记录.
		openWin('root','index.html','showlog');
		return;
	}

	if (tmpPid == 'none') {//如果tmpPid为none,则表示从输入框提交.如果不是none,则是发送失败后,点击感叹号再次提交的.
		var tmpPid=new Date().getTime();				//生成临时发言id
		showSelfPoster(userName,inputValue,userImage,tmpPid,"my");//消息直接上屏，并添加跳豆.
	}
	
	inputValue = specialLettersCoding(inputValue); 
	console.log("afterinput - inputValue:"+inputValue);
	log2root("afterinput - inputValue:"+inputValue);
    //chat.sendMsg(inputValue);//发送消息
	//chat.sendMsgToAll(inputValue);//发送消息给全部的人
	//chat.sendPrivateMsg(toUserId,inputValue);
	//execRoot("sendmsg('"+toUserId+"','"+inputValue+"')");//给单独的人发消息
	if(isTopic==true || isTopic=="true"){//话题聊天页发送消息是不同的方法
		requestSendTopicMsg(inputValue,"NORMAL",userId,userName,userImage,toUserId,toUserName,tmpPid);
	}else{
		exec("main_page","sendmsg('"+toUserId+"','"+inputValue+"','"+tmpPid+"')");
	}
	//装入任务框且判断是否发送成功
	var str = "sendPoster('" + toUserId + "','" + inputValue + "','" + tmpPid + "')";//这是普通发言，因为msg没有msgid所以将前端的传过去识别
	execRoot(str);
	
    document.getElementById("inputbox").value="";
	
	console.log(' ExistedTopic 刚刚的发言已发往服务器:' + inputValue);
	log2root(' ExistedTopic 刚刚的发言已发往服务器:' + inputValue);
	
	//2017.12.13  叶夷  如果第一句话的框存在，则信息发送成功之后将框删除
	var htmlObj=$("#htmlObj");
	if(htmlObj.length>0){
		closePop();
	}
}

function afterCheckedSendPosterSuccess(tmpPid, SendPosterSuccess) {//一般发言,新创话题,移动新建的延时检查处理都用这个方法.
	if (SendPosterSuccess) {
		alert(SendPosterSuccess);
		console.log("afterCheckedSendPosterSuccess 成功了,不作为");
		log2root("afterCheckedSendPosterSuccess 成功了,不作为");
	} else {//取消跳豆,加上感叹号,并绑定点击再请求的事件:
		console.log("afterCheckedSendPosterSuccess 失败, 取消跳豆,加上感叹号.");
		log2root("afterCheckedSendPosterSuccess 失败, 取消跳豆,加上感叹号.");
		var thePosterElement = $("#dialog_box").find("#" + tmpPid);
		thePosterElement.find(".postsending").attr('src', "../image/acclaim-50x173.png");
		thePosterElement.click(function() {
			var thePosterElementObj = $("#dialog_box").find("#" + tmpPid);
			thePosterElementObj.find(".postsending").attr('src', '../image/jumpingbean.gif');
			afterInput(thePosterElement.find(".detail").text(), tmpPid);
			//发言再次发送后, 后台要判断一下tmpPid是否已经发过了,如果有,,则返回原来的topicid和内容.否则会重复.
			thePosterElement.unbind('click');
		});
	}
}

/**
 *	服务器返回来的消息发送请求成功，替换掉临时的消息ID，并添加时间（并判断是否显示时间），由于是自己的消息则不需要添加事件 //修改发言时间,取消跳豆.
 *  */
function markSendPosterSuccess(tmpPid, postTimelong, postTimeStr) {//接受服务器收到消息的确认的方法 //msg是作为服务器返回的字符串传过来的,但是js好象是自动识别为json了.
	noHistoryMsg=false;//有历史消息
	console.log("afterSendPosterSuccess 消息成功了, 取消跳豆, 修改发言时间,第一条发言开关取消.tmpPid=" + tmpPid);
	var element = $("#" + tmpPid);
	//服务端发送消息请求成功状态后，客户端接下来要做的事情  9.15 FANG
	//取消黑色跳豆
	//console.log("这里有时候是undefined, 要查一下. element:"+element.html());
	element.find(".detail .postsending").remove();
	//removeDiv(element.find(".detail .postsending"),userAgent[1]);

	var postTimeLongMinute = postTimelong / 1000 / 60;
	var intervalEnough = ((postTimeLongMinute - 2) > (lastPostTimeLongMinute)) || ((postTimeLongMinute + 2) < (lastPostTimeLongMinute))
	if ((lastPostTimeLongMinute == 0) || intervalEnough) {//彬彬: 时间码是否显示的判断. //不论是滞后2分钟还是超前2分钟,都显示出.针对消息晚到的情况.xu
		postTimeHtml = $("<time class='send-time'></time>").text(postTimeStr);
		element.before(postTimeHtml);
	}
	lastPostTimeLongMinute = postTimeLongMinute;
}

function verifyInputText(obj){//对输入框提交的字符串进行合法性预处理:	
	var elementInputBox = document.getElementById("inputbox");
	elementInputBox.focus();//保持焦点,防止键盘收起.
	var inputValue = elementInputBox.value;
	inputValue_tmp = inputValue.replace(/ /g,"");
//str = str.replace("\\","-thisisfanxiegangzifu-");//这个反斜框的替代符需要在上屏后再替换成一串临时字串,到websocket.js里传输前再替换回来.
//str = str.replace(/'/g,"-thisisdanyinhaozifu-");//同上.
//str = str.replace(/\"/g,"-thisisshuangyinhaozifu-");//同上.
	
	//2017.12.13  叶夷  如果第一句话的框弹出，则发送框里面的文字
	var pop_tagName=$("#pop_tagName");
	if(pop_tagName.length>0){
		inputValue=pop_tagName.val();
		inputValue_tmp=pop_tagName.val();
	}
	
	if (inputValue_tmp == "") {//如果为空,并且发言长度大于150不作为.
        toast('发言内容不能为空')
		return "invalidvalue";
        /*start:叶夷    2017.4.14
         * 将发言输入提交时有150个字符限制改为1000个字符的限制
         */
	}else if(inputValue.length > 1000){
        toast('内容长度不能大于1000个字符')
        /*end:叶夷 
         */
		return "invalidvalue";
	}else {
		console.log("inputValue:"+inputValue);
		elementInputBox.value = "";
	}
	return inputValue
}

function adjustWidthsHeights() {
	if( userAgent[0] == "PC" ){//PC和手机浏览器在body宽度上不一致.暂时用这个判断来弥补:
		console.log("============userAgent[0]======="+userAgent[0]);
		document.getElementById("inputbox").style.width = $("#inputframe").width() - 70 + 6 + "px";//后来发现pc上的chrome的输入框与回车钮间距过大.原因不明,先加6调到合适. xu2017.11.06
		
	}else{
		console.log("============userAgent[0]======="+userAgent[0]);
		document.getElementById("inputbox").style.width = $("#inputframe").width() - 68 + 4 + "px";//手机上也调小一些.2017.11.13.xu
		console.log("============$(#inputframe).width()======="+$("#inputframe").width()); 
		console.log("============document.getElementById(inputbox).style.width======="+document.getElementById("inputbox").style.width);
	}
	/*//2017.08.30 叶夷  聊天页加上了共同选择的标签，聊天信息框的高度还需要减去共同选择标签框的高度
	var selectCpContainerDisplay=$("#selectCp-container").css("display");
	if(selectCpContainerDisplay== "none"){
		document.getElementById("dialog_box").style.height = $("#inputframe").offset().top - $("#header").height() - 6 + "px";//如果不多减一点(这里-5),会出滚动条.
	}else{
		document.getElementById("dialog_box").style.height = $("#inputframe").offset().top - $("#header").height()-$("#selectCp-container").height() - 6-7
	}*/
}

function  getHistoryMsg(userId,toUserId,firstMsgId){
	var data;
	if(firstMsgId=='-1'){
		data={"from_user_id":userId,
		      	  "to_user_id":toUserId/*,
			  "last_msg_id":firstMsgId*/};
	}else{
		data={"from_user_id":userId,
		      	  "to_user_id":toUserId,
			  "last_msg_id":firstMsgId};
	}
	
	$.ajax({
        url:window.location.protocol+"//xunta.so:3000/v1/history_msg",
        type:"POST",
        dataType:"jsonp",
        jsonp:"callback",
        contentType: "application/json; charset=utf-8",
        data:data,
        async:false,
        success:function(data, textStatus) {
        	console.log("测试聊天记录请求后台返回结果："+JSON.stringify(data));
        	log2root("测试聊天记录请求后台返回结果："+JSON.stringify(data));
        	showDialogHistory(data);
        	
        	//2017.08.30 叶夷  请求共同选择的标签
			requestSelectCP();
        },
        error:function(data, textStatus) {
            console.log("聊天记录请求错误"+data);
            log2root("聊天记录请求错误"+data);
        	return;
        }
    });
}

/**
 *	若标题字数过长则用省略号代替  9.14 FANG
 *  */
function showTitle() {
	var titleTextContent=cutStringIfTooLong(toUserName,10);
	//在聊天页title上加上头像
	var userimg=$("<img src="+toUserImage+" onerror="+"javascript:this.src='"+"http://42.121.136.225:8888/user-pic2.jpg"+"'>");
	$('#header').append(userimg);
	var titleText=$('#title');
	var titleTextWidth=titleText.height()/32*26;//头像小一点.
	userimg.css("width",titleTextWidth);
	userimg.css("height",titleTextWidth);
	var titleTextTop=parseInt(titleText.css("margin-top"));
	titleTextTop = titleTextTop*11/7;//再往下拉一点.
	userimg.css("top",titleTextTop);
	userimg.css("border-radius","50%");//弄成圆形.
	var titleTextLeft=($('#header').width()-parseInt(titleText.css("font-size"))*titleTextContent.length)/2-3-titleTextWidth;
	userimg.css("left",titleTextLeft-2);//向左移一点.
	
	titleText.text(titleTextContent);
}

/**
 * 2017.08.30 叶夷  请求共同选择的标签
 */
/*function requestSelectCP(){
	$.ajax({
        url:"http://xunta.so:3000/v1/find/users/same/tags/",
        type:"POST",
        dataType:"jsonp",
        jsonp:"callback",
        contentType: "application/json; charset=utf-8",
        data:{my_user_id:userId,
        	matched_user_id:toUserId},
        async:false,
        success:function(data, textStatus) {
        	console.log("测试请求共同选择的标签后台返回结果："+JSON.stringify(data));
        	log2root("测试请求共同选择的标签后台返回结果："+JSON.stringify(data));
        	showSameSelectCp(data);
        },
        error:function(data, textStatus) {
        	return;
        }
    });
}*/
/*function requestSelectCP(){
	$.ajax({
        url:"http://xunta.so:3000/v1/find/other/tags",
        type:"POST",
        dataType:"jsonp",
        jsonp:"callback",
        contentType: "application/json; charset=utf-8",
        data:{my_user_id:userId,
        	matched_user_id:toUserId},
        async:false,
        success:function(data, textStatus) {
        	console.log("测试请求共同选择的标签后台返回结果："+JSON.stringify(data));
        	log2root("测试请求共同选择的标签后台返回结果："+JSON.stringify(data));
        	showSameSelectCp(data);
        	
        	//这里要做判断，如果没有聊天记录则出现第一句话弹出框
        	if(noHistoryMsg){
        		sendFirstTalk(allCommonTags);
        	}
        	//sendFirstTalk(allCommonTags);//这是测试效果
        },
        error:function(data, textStatus) {
        	return;
        }
    });
}*/

function requestSelectCP(){
	var paraStr = userId + "','" + toUserId;
	execRoot("requestMutualCP('"+ paraStr +"')");
}

function responseMutualCP(data){
	console.log("测试请求共同选择的标签后台返回结果："+JSON.stringify(data));
	log2root("测试请求共同选择的标签后台返回结果："+JSON.stringify(data));
	showSameSelectCp(data);
	
	//这里要做判断，如果没有聊天记录则出现第一句话弹出框  而且不是话题聊天页
	if(noHistoryMsg && isTopic!=true && isTopic!="true"){
		//sendFirstTalk(allCommonTags);
		requestTwoBarCode();//这里是显示微信扫码关注效果
	}
}
//请求微信关注二维码
function requestTwoBarCode(){
	var paraStr = userId + "','" + toUserId; ;
	execRoot("requestTwoBarCode('"+ paraStr +"')");
}

function responseTwoBarCode(data){
	var weChatQRCodeUrl=data.weChatQRCodeUrl;
	sendFirstTalk(allCommonTags,weChatQRCodeUrl);
}

//2018.04.08 叶夷  发送话题页的消息
function requestSendTopicMsg(chatmsg_content,type,send_id,send_name,send_img,topic_id,topic_name,tmpPid){
	var paraStr =chatmsg_content+ "','"+type+"','" + send_id+ "','" + send_name+ "','" + send_img+ "','" + topic_id+ "','" + topic_name+ "','" + tmpPid;
	execRoot("requestSendTopicMsg('" + paraStr + "')");
}

//2018.04.08 叶夷  请求话题页的历史消息
function requestHistoryMsg(){
	var paraStr =userId+ "','"+toUserId+"','"+requestMsgCounts+"','"+create_datetime_long;
	execRoot("requestHistoryMsg('" + paraStr + "')");
}
//2018.04.08 叶夷  获取话题页的历史消息
function responseHistoryMsg(data){
	console.log("测试聊天记录请求后台返回结果："+JSON.stringify(data));
	log2root("测试聊天记录请求后台返回结果："+JSON.stringify(data));
	var chatmsgJSONArray=data.chatmsgJSONArray;
	showDialogHistory(chatmsgJSONArray);
	
	//2017.08.30 叶夷  请求共同选择的标签
	requestSelectCP();
}

//接收或拒绝话题邀请
function requestEntrantOrRejectTopic(type){
	var paraStr =toUserId+ "','"+userId+"','"+type;
	execRoot("requestEntrantOrRejectTopic('" + paraStr + "')");
}

//判断是否话题失效
function requestIfTopicOutTime(){
	var paraStr =toUserId;
	execRoot("requestIfTopicOutTime('" + paraStr + "')");
}

//判断是否话题失效
function responseIfTopicOutTime(data){
	var topicOutTime=data.topicOutTime;
	if(topicOutTime=="true" || topicOutTime==true){
		toast("此话题已失效，请新建话题");
	}else{
		//话题聊天页发送消息是不同的方法
    	create_datetime_long=new Date().getTime();
    	requestHistoryMsg();
	}
}
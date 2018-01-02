//返回上一页   2016/12/25 deng
function backBtn(){
	if(_topicPageSign == 'yes'){
		execRoot("setCurrentPageId('matchUsers_page')");
		exec('matchUsers_page',"reduceUnread('"+toUserId+"')");
		exec('matchUsers_page',"removeUnreadNum('"+toUserId+"')");
		exec('matchUsers_page',"changeUnreadColor()");
		openWin('matchUsers_page', 'matchUsers_page/matchUsers_page.html', '');
	}else{
		closeWin(toUserId);
	}
}

/**2017.11.13 叶夷  为了成功记录从不同的入口进入聊天页面
 * 如果在main_page中进入，_topicPageSign=="";
 * 如果在matchUsers_page进入，_topicPageSign=="yes"
 * 但是如果先从matchUsers_page进入，_topicPageSign=="yes"已经保存
 * 之后再从main_page中进入，_topicPageSign依然=="yes"，不会重新赋值，所以在这里加上一个方法
 * 在main_page中进入的时候，将_topicPageSign赋值为"";
 * */
function setTopicPageSignIsNull(){
	_topicPageSign = "";
}

//关闭当前页，返回主界面   2016/12/25 deng
function closeBtn(){
	execRoot("setCurrentPageId('main_page')");
	
	//退出聊天列表时首页的未读消息数去除
	exec('main_page',"removeUnreadNum()");
	
	//聊天列表未读数去除
	if(window.parent.document.getElementById("matchUsers_page")!=null ){//聊天列表打开过
		exec('matchUsers_page',"removeUnreadNum('"+toUserId+"')");
	}
	
	openWin('main_page', 'main_page/main_page.html', '');
	closeWin(_tmpPageId);
}
//显示历史信息
function showAllPosters(data) {
	for(var msg in data){
		var name=data[msg].from_user_name;
		var content=data[msg].msg;
		var userImage=data[msg].from_user_imgUrl;
		var msgId=data[msg].msg_id;
		var respondeUserId=data[msg].from_user_id;
		if (userId === respondeUserId) {
    		showSelfPoster(name, content,userImage,msgId,"my",true);
        } else {
        	showSelfPoster(name, content,userImage,msgId,"other",true);
        }
		
		//发言时间
		var postTimeStr=data[msg].create_time;
    	var postTimeLong =  new Date(postTimeStr.replace(new RegExp("-","gm"),"/").replace(/\"/g,"")).getTime();
		markSendPosterSuccess(msgId, postTimeLong, postTimeStr);
	}
	if(sort == 'asc'){
		document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
		sort =undefined;
	}
	//加上历史消息为null的判断
	if(data.length>0){
		firstMsgId=data[data.length-1].msg_id;
	}
}

function showSelfPoster(name, content,userImage,msgId,myOrOther,isHistory) {//用户发言后先直接上屏并添加发送状态，然后等待服务器返回确认后修改其消息状态
	console.log(" showSelfPoster 发言上屏了.");
	var senderName, senderName_P, content_P, senderImg, senderImg_Div, senderDiv;
	senderName = name;
	senderName = cutStringIfTooLong(senderName,10);
	senderName = " [" + senderName  +"]";//发言上屏也加上标题.	

	senderImage = userImage;
	content_P = $("<div class='detail'></div>").text(content);
	
	if(myOrOther=="my"){
		var postsending = $("<img class='postsending' src='../image/jumpingbean.gif' onerror=javascript:this.src='http://42.121.136.225:8888/user-pic2.jpg' >");
		content_P.append(postsending);
	}
	
	senderName_P = $("<div class='nc'></div>").text(senderName);
	senderImg = $("<img onerror=javascript:this.src='http://42.121.136.225:8888/user-pic2.jpg'>").attr("src", senderImage);
	////上面一句简化为这一句.那些属性目前没有用处.
	senderImg_Div = $("<div class='user-pic'></div>").append(senderImg);
	senderDiv = $("<div class='user "+myOrOther+"'></div>").attr("id", msgId);
	senderDiv.append(senderName_P).append(content_P).append(senderImg_Div);
	if(isHistory==true){
		$("#msg_list").prepend(senderDiv);
	}else{
		$("#msg_list").append(senderDiv);
		document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
	}
	
}

function showDialogHistory(msg) {//提供给如系统通知管理员等帐号直接将消息上屏的方法??? //显示聊天历史记录.
	var msgJson = msg;

	$("#loadingwrap").click(function(evt) {//填加再次请求的点击事件:
		getHistoryMsg(userId,toUserId,firstMsgId);
		$("#loadingwrap").unbind('click');	//点击后马上取消这个事件绑定.
	});
	var length = msgJson.length;
	if (length < requestMsgCounts) {
		noHistoryMsg=true;//没有历史消息
		showAllPosters(msgJson);
		$("#loadingtext").attr("class", "");
		$("#loading img").attr("src", "../image/threedotmoving.jpg");
		$("#loadingtext").text("无更多消息");
		$("#loadingwrap").unbind('click');
		//点击后马上取消这个事件绑定.
	} else {
		noHistoryMsg=false;//有历史消息
		showAllPosters(msgJson);
		$("#loadingtext").attr("class", "cursor");
		$("#loading img").attr("src", "../image/threedotmoving.jpg");
		$("#loadingtext").text("查看更多消息");
	}
}

//2017.12.22 叶夷    聊天页显示的标签四种情况显示
var likeList=new Array();//1.对方喜欢的标签
var commonLikeList=new Array();//2.双方共同喜欢的标签
var dislikeList=new Array();//3.对方不喜欢的标签
var commonDislikeList=new Array();//4.双方都不喜欢的标签

/**
 * 2017.08.30 将请求的共同选择标签放好
 * @param data
 */
function showSameSelectCp(data){
	//在放入之前将共同选择的标签删除，避免共同选择的标签重复
	var selectCPs=$(".selectCp");
	if(selectCPs.length>0){
		for(var index in selectCPs){
			selectCPs.eq(index).remove();
		}
	}
	
	for(var i in data.msg){//2017.12.22   叶夷 先将四种情况区分了之后放入储存数组中
		var if_common=data.msg[i].is_common;
		var if_dislike=data.msg[i].is_dislike;
		
		if(if_common=="false" && if_dislike=="false"){//1.对方喜欢的标签
			likeList.push(data.msg[i]);
		}else if(if_common=="true" && if_dislike=="false"){//2.双方共同喜欢的标签
			commonLikeList.push(data.msg[i]);
		}else if(if_common=="false" && if_dislike=="true"){//3.对方不喜欢的标签
			dislikeList.push(data.msg[i]);
		}else if(if_common=="true" && if_dislike=="true"){//4.双方都不喜欢的标签
			commonDislikeList.push(data.msg[i]);
		}
	}
	
	var selectCpContainer=$("#selectCp-container");
	if(likeList.length>0 || commonLikeList.length>0){
		selectCpContainer.show();
		var selectLikeCpTitle=$("<div></div>").attr("class", "selectCp-title").text("Ta关注的关键词");
		selectCpContainer.append(selectLikeCpTitle);
		for(var i in commonLikeList){
			var cpid=commonLikeList[i].cp_id;
			var text=commonLikeList[i].text;
			appendSameSelectCp(selectCpContainer,cpid,text,"selectCp commonTags");
			allCommonTags=allCommonTags+" ["+text+"] ";
		}
		for(var i in likeList){
			var cpid=likeList[i].cp_id;
			var text=likeList[i].text;
			appendSameSelectCp(selectCpContainer,cpid,text,"selectCp");
		}
	}
	if(dislikeList.length>0 || commonDislikeList.length>0){
		selectCpContainer.show();
		var selectLikeCpTitle=$("<div style='margin-top:10px;'></div>").attr("class", "selectCp-title").text("Ta反感的关键词");
		selectCpContainer.append(selectLikeCpTitle);
		for(var i in commonDislikeList){
			var cpid=commonDislikeList[i].cp_id;
			var text=commonDislikeList[i].text;
			appendSameSelectCp(selectCpContainer,cpid,text,"selectCp commonTags");
		}
		for(var i in dislikeList){
			var cpid=dislikeList[i].cp_id;
			var text=dislikeList[i].text;
			appendSameSelectCp(selectCpContainer,cpid,text,"selectCp");
		}
	}
	
	//标签区分之后依次放入数组中
	/*for(var i in data.msg){
		var cpid=data.msg[i].cp_id;
		var text=data.msg[i].text;
		//2017.11.29 叶夷  将共同喜欢的和不喜欢的标签也放进去且区开来
		var if_common=data.msg[i].is_common;
		var if_dislike=data.msg[i].is_dislike;
		
		appendSameSelectCp(cpid,text,if_common,if_dislike);
	}*/
	//sameSelectCpsWidth=0;
	
	//调整显示聊天页消息框的height
	//setDialogBoxHeight();
}

//选择过标签的width一个个相加，超过选择过标签的框则另起一行
//var sameSelectCpsWidth=0;
//判断选择过的标签有多少行，从而判断选择过标签的框的height
//var lineNumber=1;

function appendSameSelectCp(selectCpContainer,cpid,text,className){
	/*var selectCpContainer=$("#selectCp-container");
	selectCpContainer.show();*/
	var selectCp = $("<div></div>").attr("class", className).text(text);
	selectCpContainer.append(selectCp);
	
	//2017.11.29 叶夷  将共同喜欢的和不喜欢的标签也放进去且区开来
	/*if(if_common=="true"){
		selectCp.attr("class","selectCp commonLikeTags");
	}else if(if_dislike=="true"){
		selectCp.attr("class","selectCp commonDislikeTags");
	}*/
	
	//将用户昵称文字大小放入我的标签的大小
	var userNameTextSize=selectCpContainer.width()/32;
	if(userNameTextSize>15){
		userNameTextSize=15;
	}else if(userNameTextSize<12){
		userNameTextSize=12;
	}
	selectCp.css("font-size",userNameTextSize+"px");
	
	var selectCpTextLength = length(text);
	var selectCpTextSize = parseInt(selectCp.css("font-size"))+1;
	var selectCpWidth=selectCpTextLength*selectCpTextSize+20;
	var selectCpHeight=selectCpTextSize*2-4;
	
	//每个我选择的标签的大小适配
	selectCp.css("width",selectCpWidth+"px");
	selectCp.css("height",selectCpHeight+"px");
	selectCp.css("line-height",selectCpHeight+"px");
	
/*	//判断选择的标签是否另起一行
	sameSelectCpsWidth=sameSelectCpsWidth+selectCpWidth+parseInt(selectCp.css("margin-left"));
	var selectCpContainerWidth=parseInt(selectCpContainer.width());
	if(sameSelectCpsWidth>selectCpContainerWidth){//需要另起一行
		sameSelectCpsWidth=selectCpWidth+parseInt(selectCp.css("margin-left"));
		++lineNumber;
	}
	//通过选择过的标签计算选择标签框的高度
	var selectCpContainerHeight=(selectCpHeight+parseInt(selectCp.css("margin-top")))*lineNumber+30;
	selectCpContainer.css("height",selectCpContainerHeight+"px");*/
	/*log2root("测试1:"+document.body.clientHeight);
	//选择标签框大小调整好之后调整下面的大小
	adjustWidthsHeights();
	log2root("测试2:"+document.body.clientHeight);*/
}
//调整显示聊天页消息框的height
/*function setDialogBoxHeight(){
	var selectCpContainer=$("#selectCp-container");
	var selectCpContainerHeight;
	if(selectCpContainer.css("display")=="none"){
		selectCpContainerHeight=0;
	}else{
		selectCpContainerHeight=selectCpContainer.height()+7;
	}
	var dialogBoxHeight=$("body").height()-34-50-selectCpContainerHeight;
	//log2root("测试3:"+document.body.clientHeight);
	$("#dialog_box").css("height",dialogBoxHeight);
	//log2root("测试4:"+document.body.clientHeight+" "+selectCpContainerHeight+" "+dialogBoxHeight);
}*/

/**start:叶夷  2017年3月20日
 * dialog_page中的username也必须修改
 */
function updateNickname(newNickname){
	userName = newNickname;
}
/**
 * end:叶夷
 */

//2017.12.13 叶夷  用来装两人共同选择的所有标签
var allCommonTags="";
//2017.12.13 叶夷  判断是否有历史消息，如果没有历史消息则第一条信息框弹出
var noHistoryMsg;

//2017.12.13  叶夷  弹出一句话的框
function sendFirstTalk(inputValue) {
	var _obj = $("body");
	var _h = 160;
	var _w = _obj.width()-80;

	var contextresult = [];
	contextresult.push('<div id="entrytag">');
	contextresult
			.push("<p class='addtag-div'><textarea type='text' class='tag-name' id='pop_tagName' onkeypress=''>我们都对"+inputValue+"有兴趣，要一起聊聊吗？</textarea></p>");
	contextresult
			.push('<div class="btn-div-dialogPage" onclick="inputSubmit()">发送</div>');
	contextresult.push('</div>')
	alertWin(contextresult.join(''), "打个招呼吧", _w, _h);
	
	//调整entrytag的高度
	var entrytagHeight=_h-$(".pop-title").height();
	$("#entrytag").css("height",entrytagHeight);
	
	//将添加标签的确定按钮两个字的字体大小调整
	var btnIdvWidth=$(".btn-div").width();
	var btnDivFontSize=btnIdvWidth/2;
	if(btnDivFontSize>15){
		btnDivFontSize=15;
	}
	$(".btn-div").css("font-size",btnDivFontSize+"px");
	
	//2017.12.21  叶夷   聊天页的弹出框top值下移
	var htmlObjTop=$("#header").height()+$("#selectCp-container").height()+parseInt($("#selectCp-container").css("padding-bottom"))+10;
	$("#htmlObj").css("top",htmlObjTop+"px");
}
//这里没几句,暂时移到了index.html.方法暂时注销.
/*
 function prepareDialogPage() {//web
 //$("#e-lib").hide();//?0113这几个hide改为在css设为display:none或visility:hidden,这样就不会一闪而过. App中也做同样修改.
 //$("#setupbox").hide();
 //$("#wholetitlebox").hide();
 adjustWidthsHeights();
 showTitle();
 //自适应显示标题,标题字数过长则用省略号   9.14 Fang
 console.log("执行了prepareDialogPage");
 }*/

function enter_searchpage() {//web //这个方法可以与app弄成相同的. 待做. //? xu
	//1.13 FANG
	console.log("进入搜索他人话题页面");
	//var elementInputBox = document.getElementById("inputbox");//web上不需要收起键盘.
	//elementInputBox.blur();//先收起键盘,防止进入搜索页时有一片空白.
	var decodedTitle = specialLettersCoding(title);
    var tmpSearchPageId =  new Date().getTime();
	var userInfo = {
		"tmpSearchPageId":tmpSearchPageId,
		"topicid" : topicId,
		"userid" : userId,
		"title" : decodedTitle,
		"search_word" : decodedTitle,
		"userName" : userName,
		"userImage" : userImage,
		"server_domain" : domain,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent
	};
	openWin(tmpSearchPageId, 'search_page/search_page.html', JSON.stringify(userInfo));
	//api.openWin({
	//	name : 'search_page',
	//	url : 'search_page.html',
	//	slidBackEnabled : false,
	//	vScrollBarEnabled : false,
	//	hScrollBarEnabled : true,
	//	pageParam : {
	//		topicid : topicId,
	//		userid : userId,
	//		title : title,
	//		search_word: title
	//	}
	//});
}

function showDialogHistory(msg) {//提供给如系统通知管理员等帐号直接将消息上屏的方法??? //显示聊天历史记录.
	var msgJson = msg;

	$("#loadingwrap").click(function(evt) {//填加再次请求的点击事件:
		execRoot("initToLoadPostHist('"+userId+"','"+topicId+"','"+firstMsgId+"','" +requestMsgCounts+"','desc')");
		//loadPostHist(userId, topicId, firstMsgId, 'desc');
		$("#loadingwrap").unbind('click');	//点击后马上取消这个事件绑定.
	});
	var length = msgJson.msg_arr.length;
	if (length < requestMsgCounts) {
		showAllPosters(msgJson);
		$("#loadingtext").attr("class", "");
		$("#loading img").attr("src", "../image/threedotmoving.jpg");
		$("#loadingtext").text("无更多消息");
		$("#loadingwrap").unbind('click');
		//点击后马上取消这个事件绑定.
	} else {
		showAllPosters(msgJson);
		$("#loadingtext").attr("class", "cursor");
		$("#loading img").attr("src", "../image/threedotmoving.jpg");
		$("#loadingtext").text("查看更多消息");
	}
}

function showAllPosters(msg) {
	var msgArr = msg.msg_arr;
	var j, content, senderId, senderName, userImage, senderName_P, content_P, senderImg, msgType, senderImg_Div, senderDiv, msgListDiv;
	var postTimeHtml, postTimeStr, postTimeLongMinute, sender_topicid, topic_title, msgid;
	//为了时间码的显示. 彬彬. 8.13
	if (msgArr[0] == undefined) {return;}
	var msgSort = msgArr[0].sort;
	if (msgSort == 'asc') {//如果返回来的消息是升序，则获取第一条。
		firstMsgId = msgArr[0].msg_id;
	} else if (msgSort == 'desc') {//如果返回来的消息是降序，则获取最后一条
		var lastIndex = msgArr.length - 1;
		firstMsgId = msgArr[lastIndex].msg_id;
	}

	msgListDiv = $("#msg_list");
	for (j in msgArr) {//遍历每一条消息.
		topic_title = msgArr[j].sender_userinfo.topic_content;//获得标题.
		//console.log("topic_title=" + topic_title);
		senderId = msgArr[j].sender_userinfo.userid;//用户id
		content = msgArr[j].content;//发言正文.
		senderName = msgArr[j].sender_userinfo.name;//昵称
		userImage = msgArr[j].sender_userinfo.image_url;//头像
		postTimeStr = msgArr[j].msg_create_datetime_str;//发言时间,年月日的形式.
		msgid = msgArr[j].msg_id;//发言的pid
		//console.log(postTimeStr);
		//if (senderName.length > 10) {//昵称长度如果大于7个字符就截短//在发言直接上屏中也有这个判断.
		//senderName = senderName.substring(0, 10) + '…';
		senderName = cutStringIfTooLong(senderName,10);
		//}
		//if (topic_title.length > 10) {//标题长度如果大于7就要省略掉后面的 //在发言直接上屏中也有这个判断.
		//topic_title = topic_title.substring(0, 10) + '…';
		topic_title = cutStringIfTooLong(topic_title,10);
		//}

		var _senderName = senderName;

		postTimeLongMinute = msgArr[j].msg_create_datetime_long / 1000 / 60;//long型时间戳,转换为分钟.
		sender_topicid = msgArr[j].sender_userinfo.sender_topicid;//话题id.
		//console.log("topic_title会有机会等于-1吗? topic_title="+topic_title);
		if (senderName == "寻Ta管理员"){//如果是管理员,应该从本地取一个头像url出来,不让后台决定头像.zheng
			senderName = adminName;
			userImage = "../image/"+adminImageurl;
		}
		if (topic_title != -1) {//这个判断很奇怪,应该是判断非本人发言.不过目前决定本人发言也加上话题名称.
			senderName = senderName + " [" + topic_title + "]";	//将发言人的名字与话题名称连接在一起.(自己的昵称也跟上标题,让用户更容易理解自己是在某个话题下与对方在聊天.)
		}
		msgType = msgArr[j].msg_type;//本人发言与他人一样,被视为直接发言,msgType=0;
		//console.log("senderName=" + senderName+"|本人发言也会有type?  msgtype="+msgType);
		//到这里准备好了原始数据,没有区分自己或他人的发言.
		
		senderName_P = $("<div class='nc'></div>").text(senderName);//昵称加标题元素.
		senderName_P.attr("src", userImage).attr("id", senderId).attr("sender_topicid", sender_topicid).attr("senderId", senderId).attr("senderName", senderName).attr("senderImg", userImage).attr("senderMsgId", msgid).attr("senderContent", content);
		if ((msgType == 0 || msgType == 2 || msgType == 3 || msgType == 4 || msgType == 1|| msgType == 5) && sender_topicid != topicId) {//由于本人发言的msgType=0,所以需要加一个非本人判断(也可用senderId != userId)
			//对方的直接发言0,对方回复我的发言3,或者是推荐(包括已接受的推荐).这时可以将之屏蔽或新窗.屏蔽推荐表示不喜欢这个推荐,以后不要再发了(后台是否处理了这个动作?).
			if(senderId != 1) {    //系统管理员userId为1   2017/01/23  deng
				senderName_P.on("click", function () {//绑定发言者标题点击事件-屏蔽或新窗动作:
					removeUserOrCreatTopic(this);
				})
				senderName_P.addClass("cursor");
			}
		} 

		//头像元素://这里的属性值都是不必要的,可以统一放到父元素上.待修改.xu 11.11
		senderImg = $("<img />").attr("src", userImage).attr("id", senderId).attr("sender_topicid", sender_topicid).attr("senderId", senderId).attr("senderName", senderName).attr("senderImg", userImage).attr("senderMsgId", msgid).attr("senderContent", content);
		//console.log(content + "|消息类型:" + msgType);
		//msg_type: 0-直接发言;1-推荐的他人新创话题;2-系统通知;3-被其他用户直接回复 的消息;4-新窗成功后的系统通知.5=已接受的推荐 xu 2015.11.11
		//换成下面的判断:if (sender_topicid != -1 && sender_topicid != topicId) {//在不是管理员头像通知,或非本人发言时,
		if ((msgType == 0 || msgType == 2 || msgType == 3 || msgType == 4 || msgType == 1|| msgType == 5) && sender_topicid != topicId) {//由于本人发言的msgType=0,所以需要加一个非本人判断(也可用senderId != userId)
			//对方的直接发言0,对方回复我的发言3,或者是推荐(包括已接受的推荐).这时可以将之屏蔽或新窗.屏蔽推荐表示不喜欢这个推荐,以后不要再发了(后台是否处理了这个动作?).
			if(senderName != "寻Ta管理员" && senderName != "寻Ta测试员"){
				senderImg.on("click",function() {//绑定头像点击事件-
					openUserOthersPage(this);//这个地方传this的父级元素, 这样img本身不需要那么多属性值了.
				});
				senderImg_Div = $("<div class='user-pic cursor'></div>").append(senderImg);//因为有事件,头像上鼠标悬停变小手.
			}else{
				senderImg_Div = $("<div class='user-pic'></div>").append(senderImg);
			}
		}else{
			if(senderName != "寻Ta管理员" && senderName != "寻Ta测试员") {
				senderImg.on("click", function () {//绑定头像点击事件-
					openHomePage(this);
				});
				senderImg_Div = $("<div class='user-pic cursor'></div>").append(senderImg);//因为有事件,头像上鼠标悬停变小手.
			}else{
				senderImg_Div = $("<div class='user-pic'></div>").append(senderImg);
			}

		}


		//发言正文元素:
		content_P = $("<div class='detail '></div>").attr('id', senderId).attr("sender_topicid", sender_topicid).attr("senderName", senderName).attr("senderMsgId", msgid).text(content);
		//console.log("showdialoghistory senderimg: "+userImage);
		//原来的判断语句:if ((msgArr[j].msg_type == '0'|| msgArr[j].msg_type == '3') & senderId != userId) {////这个判断与上一个是重复的, 但因为变量的循环依赖,不得不拆成两个.
		//if (sender_topicid != -1 && sender_topicid != topicId && msgType != '1') {////这个判断与上一个是重复的, 但因为变量的循环依赖,不得不拆成两个.
		if ((msgType == 0 || msgType == 3) && sender_topicid != topicId){//非本人,直接发言或回复我的发言.
			content_P.on("click",function() {//绑定 点击正文区只回复他的 事件:
				replyCurrentContent(this);////这个地方传this的父级元素, 这样img本身不需要那么多属性值了.
			});
			content_P.attr("class", "detail cursor");//因为有回复事件,鼠标悬停变小手.
		}else{
			content_P.attr("class", "detail");//因为有回复事件,鼠标悬停变小手.
		}

		if (msgType == '1') {//推荐类型的正文样式:
			content_P.text("(推荐)" + content);
			content_P.attr("class", "detail recommend cursor");//将内容元素加上recommend推荐值,让css为它加上一个边线.
			var plusLogoImg = $("<img class='plus-logo' src='../image/plus-20x20.png' />");
			content_P.append(plusLogoImg);//append一个加号元素.
			content_P.on("click",function() {
				askIfLink2CurrentTopic($(this));//弹出确认是否与当前话题连接的对话框.//不知这个content_p能不能作为当前元素的参数?
				//askIfLink2CurrentTopic(this.parent());//弹出确认是否与当前话题连接的对话框.//先试一下使用父级元素定位,然后再取消img上的各种参数.
			});
		}

		
		if (msgType == '5') {//已接受的推荐正文的样式:
			content_P.text("(推荐已接受)" + content);
			content_P.attr("class", "detail recommend");//将内容元素加上recommend推荐值,让css为它加上一个边线.
			var yesLogoImg = $("<img class='plus-logo' src='../image/yes-20x20.png' />");//换成对号.
			content_P.append(yesLogoImg);//append上对号元素.
		}
		
		if(msgType == '3' ){ //私聊图标： zheng
			content_P.unbind("click");
			content_P.attr("class", "detail cursor");
			var personDialogImg;
			if( sender_topicid != topicId){
				personDialogImg = $("<img class='personal-dialog-other' src='../image/personal_dialog.png' />");
			}
			//else{
				//personDialogImg = $("<img class='personal-dialog-self' src='../image/personal_dialog1.png' />");
			//}
			content_P.on("click",function() {
				openPersonalDialog(this);
			});
			content_P.append(personDialogImg);
		}

		/////----------------// 过往发言 2017/01/19  deng
		var hist_div = $("<div style='padding-top: 8px;margin-right:-56px;float:right;text-align: right;'></div>");
		if(msgType == 6){
			var histBtn = $("<span style='background-color: #dddddd;padding: 2px;font-size:9px;border-radius: 5px;cursor:pointer'></span>").text("过往发言");
			histBtn.click(function(){
				var _obj = $("#dialog_box");
				var _h = _obj.height()/2;
				var _w = _obj.width()-60;
				var _promptMsg = [];
				_promptMsg.push('<div id="_promptMsg" style="width: 90%;text-align: center"><img src="../image/loading.gif" style="width: 16px;height: 16px"></div>');
				alert_Win(_promptMsg.join(''), _senderName+"在"+topic_title+"中的过往发言", _w, _h);
				execRoot("getUserReqTopicMessages('"+senderId+"','"+sender_topicid+"')");
			});
			hist_div.append(histBtn);
		}
		/////----------------end
		//增加普通用户自动回复的@功能  2017/01/19  deng
		if (msgType == 2 && senderId != 1){
			content_P.on("click", function () {//绑定 点击正文区
				var _senderN = removeTopicTitleInSenderName($(this).attr("senderName"));
				$("#inputbox").val("@"+_senderN+": ");
				$("#inputbox").focus();
			});
			content_P.attr("class", "detail cursor");
		}else{
			content_P.attr("class", "detail");
		}

		if (topicId == sender_topicid) {//应该用topicid来判断是他人还是自己的发言.消息靠左,自己消息靠右.因为自己的话题也可以是互连的.xu 11.17
			senderDiv = $("<div class='user my'></div>").append(senderName_P).append(content_P).append(senderImg_Div);
		} else {
			//senderDiv = $("<div class='user other'></div>").append(senderName_P).append(content_P).append(senderImg_Div);
			/////----------------
			senderDiv = $("<div class='user other'></div>").append(senderName_P).append(content_P).append(senderImg_Div).append(hist_div);
			/////----------------end
			/*//if (msgArr[j].msg_type == '0' || msgArr[j].msg_type == '3' || msgArr[j].msg_type == '1') {
			 if (msgType == '0' || msgType == '3') {
			 //				senderImg_Div = $("<div class='user-pic cursor'></div>").append(senderImg);
			 content_P.attr("class", "detail cursor");
			 }
			 senderDiv.append(senderName_P).append(content_P).append(senderImg_Div);
			 */
		}
		
		

		var intervalEnough = ((postTimeLongMinute - 2) > (lastPostTimeLongMinute)) || ((postTimeLongMinute + 2) < (lastPostTimeLongMinute))
		if (msgArr[j].sort == 'asc') {
			if ((lastPostTimeLongMinute == 0) || intervalEnough) {//彬彬: 时间码是否显示的判断. //不论是滞后2分钟还是超前2分钟,都显示出.针对消息晚到的情况.xu
				postTimeHtml = $("<time class='send-time'></time>").text(postTimeStr);
				msgListDiv.append(postTimeHtml);
			}
			msgListDiv.append(senderDiv);
		} else if (msgArr[j].sort == 'desc') {
			var lastIndex = msgArr.length - 1;
			msgListDiv.prepend(senderDiv);
			if (j == lastIndex || (lastPostTimeLongMinute == 0 || intervalEnough)) {
				postTimeHtml = $("<time class='send-time'></time>").text(postTimeStr);
				msgListDiv.prepend(postTimeHtml);
			}
		} else {
			if (lastPostTimeLongMinute == 0 || intervalEnough) {//彬彬: 时间码是否显示的判断. //不论是滞后2分钟还是超前2分钟,都显示出.针对消息晚到的情况.xu
				postTimeHtml = $("<time class='send-time'></time>").text(postTimeStr);
				msgListDiv.append(postTimeHtml);
			}
			msgListDiv.append(senderDiv);
		}
		lastPostTimeLongMinute = postTimeLongMinute;
	}
	//if (j == undefined) {
	//	j = -1;
	//}
	//$("#notification").text('收到' + (parseInt(j) + 1) + '条发言消息.');
	if (msgArr[j].sort != 'desc') {
		setTimeout(function() {//将聊天框里的消息落底 - 8.12
			document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
		}, 200);
	}

}


//====================================邀请功能@author zhangYY=================================================================
//弹出衍生页面 ————张
function enter_descendant(){
	relationordescendant = 0;
	//每次打开弹出框，需要重新初始化当前页数
	connpage = 0;
	var _obj = $("#dialog_box");
	var _h = 160;
	var _w = _obj.width()-80;
	var contextresult = [];
	contextresult.push('<div id="entrytopic">');
	contextresult.push('<p class="descendant-div"><textarea class="topic-name" id="pop_topicName"></textarea></p>');
	contextresult.push('<div class="btn-div" onclick="descendantnext()">下一步</div>');
	contextresult.push('</div>');

	contextresult.push('<div id="choosetopic">');
	contextresult.push('<div class="inline-rule" onclick="triggerClick(\'radio\',this)"><input type="radio" name="topicradio" value="yes" checked/>全部相连话题</div>');
	contextresult.push('<div class="inline-rule" onclick="triggerClick(\'radio\',this)"><input type="radio" name="topicradio" value="no"/>自定义选择</div>');
	contextresult.push('<div id="popContext" style="height: '+(_h-160)+'px"><div class="more-rule" onclick="loadMoreData()">[0/0 ⇊]</div></div>');
	contextresult.push('<div class="btn-div">');
	contextresult.push('<div style="float: left;width: 50%;height:58px;border-right: 1px solid #f1f1f1;" onclick="descendantback()">上一步</div>');
	contextresult.push('<div style="float: left;width: 49%;height:58px;" onclick="descendantfinish()">完成</div>');
	contextresult.push('</div>');
	contextresult.push('</div>');
	alertWin(contextresult.join(''),"输入新的话题",_w,_h);
}

//触发click事件 ————张
function triggerClick(_type,_this){
	var _obj = $(_this).find("[type='"+_type+"']");
	if(_type=='checkbox'){
		if(_obj.prop("checked")){
			_obj.prop("checked",false);
		}else{
			_obj.prop("checked",true);
		}
	}else{
		_obj.prop("checked",true);
		chooseType(_obj.val());
	}
}

//下一步操作 ————张
function descendantnext(){
	var _name = $("#pop_topicName");
	if(_name.val()==""){
		_name.focus();
		return false;
	}else{
		$("#entrytopic").hide();
		$("#choosetopic").show();
		if($("input[name='topicradio']:checked").val()=="no"){
			var _h = $("#dialog_box").height()/2;
			topicChangeHeightSize(_h);
			$("#popContext").css("height",_h - 160);
		}
		updateTitleName("选择要邀请的对象");
	}
}

//返回上一步操作  ————张
function descendantback(){
	$("#choosetopic").hide();
	$("#entrytopic").show();
	updateTitleName("输入新的话题");
	topicChangeHeightSize(160);
}

//是否全部通知  ————张
function chooseType(_type){
	var _obj = $("#popContext");
	if(_type=="yes"){
		_obj.hide();
		topicChangeHeightSize(160);
	}else{
		_obj.show();
		//已经加载过数据，不需要再次加载
		if(_obj.find("div").size()==1){
			loadMoreData();
		}
		//改变弹出框大小
		var _h = $("#dialog_box").height()/2;
		topicChangeHeightSize(_h);
		_obj.css("height",_h - 160);
	}
}

//加载更多数据  ————张
function loadMoreData(){
	execRoot("getConnectedTopicList('"+topicId+"',"+connpage+","+conncount+")");
}

//判断是邀请还是关系
function processConnectData(_msg){
	if(relationordescendant==0){
		processDescendantConnectData(_msg);
	}else{
		relation.processRelationData(_msg);
	}
}

//加载list数据  zhangyy
function processDescendantConnectData(_msg){
	var _list = _msg.topiclist;
	var result = [];
	$.each(_list,function(i,item){
		result.push('<div style="float: left;width: 100%;display: inline-flex;" onclick="triggerClick(\'checkbox\',this)">');
		result.push('<div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: #999">');
		result.push('<input type="checkbox" name="c_topicid" value="'+item.topicid+'"/><span style="color: #303030;">'+item.username+':</span> ['+item.topictitle+'</div><span style="color: #999;">]</span>');
		result.push('</div>');
	});
	var _obj = $(".more-rule");
	var _show = parseInt(connpage,10)+parseInt(_list.length,10);
	var _totalcount = _msg.totalcount;
	if(_totalcount == 0){
		var _popContext = $("#popContext");
		var _height = _popContext.height();
		_popContext.html("<div style='height: 30px;width:100%;text-align: center;padding-top: "+(_height-30)/2+"px;'>暂无相关话题</div>");
	}else{
		_obj.before(result.join('')).show().html("["+_show+"/"+_totalcount+" ⇊]");
		if(_show==_totalcount){
			_obj.removeAttr("onclick");
		}else{
			connpage += conncount;
		}
	}
}


//操作完成  ————张
function descendantfinish(){
	var _checkRadio = $("input[name='topicradio']:checked").val();
	if(_checkRadio=="no") {
		var _obj = $("input[name='c_topicid']:checked");
		if (_obj.size() == 0) {
			$("#tipsObj").html("<div class='tipsContext'>请选择话题</div>");
			setTimeout(function () {
				$("#tipsObj").html("");
			}, 5000);
			return false;
		} else {
			var v_topicid = new Array();
			$.each(_obj, function (i) {
				v_topicid[i]= $(this).val();
			});
			execRoot("createNewTopic2AppointedTopics('" + topicId + "','" + userId + "','" + $("#pop_topicName").val() + "','" + _checkRadio + "','" + v_topicid + "')");
		}
	}else{
		execRoot("createNewTopic2AppointedTopics('" + topicId + "','" + userId + "','" + $("#pop_topicName").val() + "','" + _checkRadio + "','')");
	}
}

//处理衍生话题数据  ————张
function processDescendantData(_msg){
	var _topictitle = $("#pop_topicName").val();
	closePop();
	var contextresult = [];
	contextresult.push('<div id="entrytopic">');
	contextresult.push('<p style="height: 62px;margin: 0;padding: 0;line-height: 62px;text-align: center;">创建成功</p>');
	contextresult.push('<div class="btn-div">');
	contextresult.push('<div style="float: left;width: 50%;height:66px;border-right: 1px solid #f1f1f1;" onclick="closePop()">停留当前话题</div>');
	contextresult.push('<div style="float: left;width: 49%;height:66px;" onclick="openDialogPage(\''+_msg.newtopicid+'\',\''+_topictitle+'\')">打开新话题</div>');
	contextresult.push('</div>');
	contextresult.push('</div>');
	alertWin(contextresult.join(''),"提示",200,170);

	//话题创建成功后，将话题显示在话题列表页上
	var time = _msg.poster_create_datetime_str.substring(5, 16);
	var script = "appendElement('" + _topictitle + "','" + _msg.newtopicid + "','new','" + time + "','post_topic','" + userName + "','" + _topictitle + "','0')";
	exec("topics_page", script);

}

//进入新建好的话题页 ————张
function openDialogPage(topicid,topictitle){
	closePop();
	var pageParam = {
		"topicid" : topicid,
		"title" : topictitle,
		"userid" : userId,
		"userName" : userName,
		"userImage" : userImage,
		"server_domain" : domain,
		"isqingting" : isqingting,
		"pageTitle":title,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent
	};
	console.log("enterDialogPage topicid=" + topicid+"|topictitle="+topictitle);
	openWin(topicid,'dialog_page/dialog_page.html',JSON.stringify(pageParam));
}

//========================================话题关系管理模块 zhangyy==============================================
/**
 * 关系入口  zhangyy
 */
function RelationConstr(){
	//全选功能
	this.checkAllBox=function(){
		var _obj = $("#topicall");
		var _flg = _obj.prop("checked");
		_flg = !_flg;
		_obj.prop("checked",_flg);
		$("input[name='c_topicid']").each(function () {
			$(this).prop("checked", _flg);
		});
	};
	//子选项未选中去掉全选勾
	this.propCheckBox=function(_this){
		var _flag = $(_this).find("[type='checkbox']").prop("checked");
		$(_this).find("[type='checkbox']").prop("checked",!_flag);
		if(_flag){
			$("#topicall").prop("checked",false);
		}else{
			var _all = true;
			$("input[name='c_topicid']").each(function () {
				if(!$(this).prop("checked")){
					_all = false;
					return false;
				}
			});
			$("#topicall").prop("checked",_all);
		}
	};
	//打开弹出框
	this.relation_pop=function(){
		relationordescendant = 1;
		//每次打开弹出框，需要重新初始化当前页数
		connpage = 0;
		var _obj = $("#dialog_box");
		var _h = _obj.height()/2;
		var _w = _obj.width()-60;
		var contextresult = [];
		contextresult.push('<div id="choosetopic" style="display:block;">');
		contextresult.push('<div class="check-div" onclick="relation.checkAllBox()"><input type="checkbox" id="topicall"/>全选</div>');
		contextresult.push('<div id="relationContext" style="height: '+(_h-130)+'px"><div class="more-rule" onclick="relation.loadRelationMoreData()">[0/0 ⇊]</div></div>');
		contextresult.push('<div class="btn-div">');


		contextresult.push('<div style="float: left;width: 50%;height:58px;border-right: 1px solid #f1f1f1;" onclick="relation.newWindowUser()">新窗</div>');
		contextresult.push('<div style="float: left;width: 49%;height:58px;" onclick="relation.removeUser()">屏蔽</div>');

		contextresult.push('</div>');
		contextresult.push('</div>');
		alertWin(contextresult.join(''),"已连接的话题",_w,_h);
		this.loadRelationMoreData();
	};
	//加载list数据
	this.processRelationData = function(_msg){
		var _list = _msg.topiclist;
		var result = [];
		$.each(_list,function(i,item){
			result.push('<div style="float: left;width: 100%;display: inline-flex;">');
			result.push('<div style="float: left;width: 85%;display: inline-flex;" onclick="relation.propCheckBox(this)">');
			result.push('<div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: #999;">');
			result.push('<input type="checkbox" name="c_topicid" value="'+item.topicid+'" data-userid="'+item.userid+'" data-username="'+item.username+'" data-topictitle="'+item.topictitle+'" data-image_url="'+item.image_url+'"/><span style="color: #303030;">'+item.username+':</span> ['+item.topictitle+'</div><span style="color: #999;width: 50px;float: right;display: inline-table;">]');

			if(item.if_suspend && item.if_suspend=="yes"){
				result.push("<b style='color: red;'>已暂停</b>");
			}
			result.push("</span>");
			result.push('</div>');
			if(isqingting == 'no' || isqingting == '') {
				result.push('<div style="background-color: #dddddd;padding: 1px 2px;margin:1px;font-size:9px;border-radius: 5px;cursor:pointer" onclick="relation.personalDialog(this)" topicId="'+item.topicid+'" userId="'+item.userid+'" userName="'+item.username+'">私聊</div>');
			}
			result.push('</div>');
		});
		var _obj = $(".more-rule");
		var _show = parseInt(connpage,10)+parseInt(_list.length,10);
		var _totalcount = _msg.totalcount;
		if(_totalcount == 0){
			var _popContext = $("#relationContext");
			var _height = _popContext.height();
			_popContext.html("<div style='height: 30px;width:100%;text-align: center;padding-top: "+(_height-30)/2+"px;'>暂无相关话题</div>");
		}else{
			_obj.before(result.join('')).show().html("["+_show+"/"+_totalcount+" ⇊]");
			if(_show==_totalcount){
				_obj.removeAttr("onclick");
			}else{
				connpage += conncount;
			}
		}
	};
	//加载更多数据
	this.loadRelationMoreData = function(){
		$("#topicall").prop("checked",false);
		execRoot("getConnectedTopicList('"+topicId+"',"+connpage+","+conncount+")");
	};
	//获取选中用户
	this.getCheckUser = function(){
		var _obj = $("input[name='c_topicid']:checked");
		if (_obj.size() == 0) {
			$("#tipsObj").html("<div class='tipsContext'>请选择话题</div>");
			setTimeout(function () {
				$("#tipsObj").html("");
			}, 5000);
			return false;
		}
		return true;
	};
	//屏蔽用户
	this.removeUser = function(){
		if(this.getCheckUser()){
			$("input[name='c_topicid']:checked").each(function(){
				execRoot("removeUserByTopic('" + topicId + "'," + "'" + $(this).data("userid") + "'," + "'" + $(this).val() + "')");
			});
			closePop();
		}
	};
	//新窗
	this.newWindowUser = function(){
		if(this.getCheckUser()){
			var from_topictitle = "被移动的话题";
			var v_topicid="",senderId="",senderName="",senderContent="",senderImg="";
			var _obj = $("input[name='c_topicid']:checked");
			var _size = _obj.length-1;
			_obj.each(function(i){
				if(_size==i){
					v_topicid += $(this).val();
					senderId += $(this).data("userid");
					senderName += $(this).data("username");
					senderContent += $(this).data("topictitle");
					senderImg += $(this).data("image_url");
				}else{
					v_topicid += $(this).val()+"-join-";
					senderId += $(this).data("userid")+"-join-";
					senderName += $(this).data("username")+"-join-";
					senderContent += $(this).data("topictitle")+"-join-";
					senderImg += $(this).data("image_url")+"-join-";
				}
			});

			/*var v_topicid = new Array(),senderId=new Array(),senderName="",senderContent="",senderImg=new Array();
			$("input[name='c_topicid']:checked").each(function (i) {
				v_topicid[i] = $(this).val();
				senderId[i] = $(this).data("userid");
				senderName += $(this).data("username")+"-join-";
				senderContent += $(this).data("topictitle")+"-join-";
				senderImg[i] = $(this).data("image_url");
			});*/

			closePop();
			enterDialogPage_MoveToNewTopic(userName, userImage, topicId, v_topicid, senderId, userId, from_topictitle,senderName, senderImg, senderContent);
			console.log('从列表页执行代码, 打开新窗.');
		}
	};

	//私聊   2017/01/22  deng
	this.personalDialog = function(e){
		var	 v_topicid = $(e).attr("topicId");
		var	 senderId = $(e).attr("userId");
		var	 senderName = $(e).attr("userName");
		closePop();
		if (senderId != userId){
			replySenderName = senderName;
			replyOppuid = senderId;
			replyOpptid = v_topicid;
			replyTopic	= v_topicid;
			replySenderNameWithTopic = senderName;
		}else{
			senderName = "所有其他人的";
		}
		var _obj = $("#dialog_box");
		var _h = _obj.height() * 0.8;//
		var _w = _obj.width()-80;
		var contextresult = [];
		contextresult.push('<div id="personalDialogHistory" style="height:100%;"><div id="personal_dialog_list" style="height: 80%;width: 96%;padding:5px;overflow-y:auto;font-size:12px;"></div></div>');
		contextresult.push('<div id="inputframe1" style="position:absolute;"><input type="text" id="inputbox1" style="width: 78%;" value="" onfocus="inputboxOnFocus(this)" onblur="inputboxOnBlur(this)"  onkeypress="if(event.keyCode==13){Javascript:inputSubmit1()}"/>');
		contextresult.push('<div id="inputsubmit1" onclick="inputSubmit1()" ><img src="../image/return9.png" /></div>');
		contextresult.push('</div>');
		alertWin(contextresult.join(''),"与 " + senderName +" 的私密对话",_w,_h); //@wsy
		console.log("======点开更新私聊对话框时的参数为：1:"+topicId+"~,2:"+userId+"~,3:"+senderId+"~4:"+v_topicid)
		console.log("====== 发送私聊消息之前时的参数为：1:"+topicId+"~,2:"+userId+"~,3:"+replyOppuid+"~,4:"+replyOpptid)
		getPersonalDialogMessages(topicId,userId,senderId,v_topicid);
		console.log('从列表页执行代码, 打开私聊.');
	};
}

var relation = new RelationConstr();


//===========================================私聊功能 @wsy============================================================================
function openPersonalDialog(obj){
	
	var sender_topicid = $(obj).attr("sender_topicid");
	var topic_title = $(obj).attr("topic_title");
	var msgid = $(obj).attr("msgid");
	var senderId = $(obj).attr("id");
	var senderName ;
	if (senderId != userId){
		senderName = $(obj).attr("senderName");
		//去掉[]中的话题名字
		var targetIndex = senderName.indexOf("[");
		if (targetIndex == -1) {
			return;
		} else {
			replySenderName = senderName.substring(0, targetIndex);; //设置全局变量的值,用来进行私聊 @wsy
		}
		replyOppuid = senderId;	//设置全局变量的值用来进行私聊@wsy
		replyOpptid = sender_topicid;
		replyTopic	= sender_topicid;
		replySenderNameWithTopic = senderName;


	}else{
		senderName = "所有其他人的";
	}
	var _obj = $("#dialog_box");
	var _h = _obj.height() * 0.8;//@wsy 2016-10-11 高度可以再高些
	var _w = _obj.width()-80;
	var contextresult = [];
	contextresult.push('<div id="personalDialogHistory" style="height:100%;"><div id="personal_dialog_list" style="height: 80%;width: 96%;padding:5px;overflow-y:auto;font-size:12px;"></div></div>');
	contextresult.push('<div id="inputframe1" style="position:absolute;"><input type="text" id="inputbox1" style="width: 78%;" value="" onfocus="inputboxOnFocus(this)" onblur="inputboxOnBlur(this)"  onkeypress="if(event.keyCode==13){Javascript:inputSubmit1()}"/>');
	contextresult.push('<div id="inputsubmit1" onclick="inputSubmit1()" ><img src="../image/return9.png" /></div>');
	contextresult.push('</div>');
	console.log(obj)
	alertWin(contextresult.join(''),"与 " + senderName +" 的私密对话",_w,_h); //@wsy
	console.log("======点开更新私聊对话框时的参数为：1:"+topicId+"~,2:"+userId+"~,3:"+senderId+"~4:"+sender_topicid)
	console.log("====== 发送私聊消息之前时的参数为：1:"+topicId+"~,2:"+userId+"~,3:"+replyOppuid+"~,4:"+replyOpptid)
	getPersonalDialogMessages(topicId,userId,senderId,sender_topicid);//@wsy 2016-10-11 得到私人对话的历史数据   注意：当点击自己所发的内容时，点开的是自己与所有人的私聊对话框，这个需要改进	
	// replyOppuid = "";//设置全局变量的值用来进行私聊@wsy
	// replyTopic = "";
}

/*
    获得历史数据，
    参数：@param mytid
    	  @param myuid
    	  @param oppuid 话题id
          @param opptid 发送人id
*/
function getPersonalDialogMessages(mytid,myuid,oppuid,opptid){ //@wsy 2016-10-14
	console.log("dialog_page_common_web.js 中的 getPersonalDialogMessages()执行后 开始执行websocket中。。。")
	execRoot("getPersonalDialog('"+mytid+"','"+myuid+"','"+oppuid+"','"+opptid+"')");

}
/*
@wsy
*/
function showPersonalDialogHistory(msg){
	console.log("开始处理返回的私人聊天记录..")
	console.log(msg)
	var msgArr = msg.msg_arr;
	var j, content, senderId, senderName, userImage, senderName_P, content_P, senderImg, msgType, senderImg_Div, senderDiv, msgListDiv;
	var postTimeHtml, postTimeStr, postTimeLongMinute, sender_topicid, topic_title, msgid;
	if (msgArr[0] == undefined) {return;}
	var msgSort = msg.sort;
	if (msgSort == 'asc') {//如果返回来的消息是升序，则获取第一条。
		firstMsgId = msgArr[0].msg_id;
	} else if (msgSort == 'desc') {//如果返回来的消息是降序，则获取最后一条
		var lastIndex = msgArr.length - 1;
		firstMsgId = msgArr[lastIndex].msg_id;
	}

	msgListDiv = $("#personal_dialog_list");
	msgListDiv.empty();
	for (j in msgArr) {//遍历每一条消息.
		topic_title = msgArr[j].sender_userinfo.topic_content;//获得标题.
		senderId = msgArr[j].sender_userinfo.userid;//用户id
		content = msgArr[j].content;//发言正文.
		senderName = msgArr[j].sender_userinfo.name;//昵称
		userImage = msgArr[j].sender_userinfo.image_url;//头像
		postTimeStr = msgArr[j].msg_create_datetime_str;//发言时间,年月日的形式.
		msgid = msgArr[j].msg_id;//发言的pid
		senderName = cutStringIfTooLong(senderName,10);
		topic_title = cutStringIfTooLong(topic_title,10);

		postTimeLongMinute = msgArr[j].msg_create_datetime_long / 1000 / 60;//long型时间戳,转换为分钟.
		sender_topicid = msgArr[j].sender_userinfo.sender_topicid;//话题id.
		// if (senderName == "寻Ta管理员"){//如果是管理员,应该从本地取一个头像url出来,不让后台决定头像.zheng
		// 	senderName = adminName;
		// 	userImage = "../image/"+adminImageurl;
		// }
		if (topic_title != -1) {//这个判断很奇怪,应该是判断非本人发言.不过目前决定本人发言也加上话题名称.
			senderName = senderName + " [" + topic_title + "]";	//将发言人的名字与话题名称连接在一起.(自己的昵称也跟上标题,让用户更容易理解自己是在某个话题下与对方在聊天.)
		}
		msgType = msgArr[j].msg_type;//本人发言与他人一样,被视为直接发言,msgType=0;

		senderName_P = $("<div class='p-nc'></div>").text(senderName);//昵称加标题元素.
		senderImg = $("<img />").attr("src", userImage).attr("id", senderId).attr("sender_topicid", sender_topicid).attr("senderId", senderId).attr("senderName", senderName).attr("senderImg", userImage).attr("senderMsgId", msgid).attr("senderContent", content);

		// if ((msgType == 0 || msgType == 3 ) && sender_topicid != topicId) {//由于本人发言的msgType=0,所以需要加一个非本人判断(也可用senderId != userId)
		// 	//对方的直接发言0,对方回复我的发言3,或者是推荐(包括已接受的推荐).这时可以将之屏蔽或新窗.屏蔽推荐表示不喜欢这个推荐,以后不要再发了(后台是否处理了这个动作?).
		// 	// senderImg.click(function() {//绑定头像点击事件-屏蔽或新窗动作:
		// 	// 	removeUserOrCreatTopic(this);//这个地方传this的父级元素, 这样img本身不需要那么多属性值了.
		// 	// });
		// 	senderImg_Div = $("<div class='p-user-pic '></div>").append(senderImg);//因为有事件,头像上鼠标悬停变小手.
		// }else{
			senderImg_Div = $("<div class='p-user-pic'></div>").append(senderImg);
		// }


		//发言正文元素:
		content_P = $("<div class='p-detail '></div>").attr('id', senderId).attr("sender_topicid", sender_topicid).attr("senderName", senderName).attr("senderMsgId", msgid).text(content);
		// if ((msgType == 0 || msgType == 3) && sender_topicid != topicId){//非本人,直接发言或回复我的发言.
		// 	content_P.click(function() {//绑定 点击正文区只回复他的 事件:
		// 		replyCurrentContent(this);////这个地方传this的父级元素, 这样img本身不需要那么多属性值了.
		// 	});
		// 	content_P.attr("class", "p-detail cursor");//因为有回复事件,鼠标悬停变小手.
		// }else{
		// 	content_P.attr("class", "p-detail");//因为有回复事件,鼠标悬停变小手.
		// }
		content_P.attr("class", "p-detail");//因为有回复事件,鼠标悬停变小手.
		// if (msgType == '1') {//推荐类型的正文样式:
		// 	content_P.text("(推荐)" + content);
		// 	content_P.attr("class", "detail recommend cursor");//将内容元素加上recommend推荐值,让css为它加上一个边线.
		// 	var plusLogoImg = $("<img class='plus-logo' src='../image/plus-20x20.png' />");
		// 	content_P.append(plusLogoImg);//append一个加号元素.
		// 	content_P.click(function() {
		// 		askIfLink2CurrentTopic($(this));//弹出确认是否与当前话题连接的对话框.//不知这个content_p能不能作为当前元素的参数?
		// 	});
		// }

		
		// if (msgType == '5') {//已接受的推荐正文的样式:
		// 	content_P.text("(推荐已接受)" + content);
		// 	content_P.attr("class", "detail recommend");//将内容元素加上recommend推荐值,让css为它加上一个边线.
		// 	var yesLogoImg = $("<img class='plus-logo' src='../image/yes-20x20.png' />");//换成对号.
		// 	content_P.append(yesLogoImg);//append上对号元素.
		// }
		
		// if(msgType == '3' ){ //私聊图标： zhang
		// 	content_P.unbind("click");
		// 	content_P.attr("class", "p-detail cursor");
		// 	var personDialogImg;
		// 	if( sender_topicid != topicId){
		// 		personDialogImg = $("<img class='p-personal-dialog-other' src='../image/personal_dialog.png' />");
		// 	}else{
		// 		personDialogImg = $("<img class='p-personal-dialog-self' src='../image/personal_dialog1.png' />");
		// 	}
		// 	content_P.click(function() {
		// 		openPersonalDialog(this);
		// 	});
		// 	content_P.append(personDialogImg);
		// }

		if (topicId == sender_topicid) {//应该用topicid来判断是他人还是自己的发言.消息靠左,自己消息靠右.因为自己的话题也可以是互连的.xu 11.17
			senderDiv = $("<div class='p-user p-my'></div>").append(senderName_P).append(content_P).append(senderImg_Div);
		} else {
			senderDiv = $("<div class='p-user p-other'></div>").append(senderName_P).append(content_P).append(senderImg_Div);
		}
		
		var intervalEnough = ((postTimeLongMinute - 2) > (lastPostTimeLongMinute)) || ((postTimeLongMinute + 2) < (lastPostTimeLongMinute))
		if (msg.sort == 'asc') {
			if ((lastPostTimeLongMinute == 0) || intervalEnough) {//彬彬: 时间码是否显示的判断. //不论是滞后2分钟还是超前2分钟,都显示出.针对消息晚到的情况.xu
				postTimeHtml = $("<time class='p-send-time'></time>").text(postTimeStr);
				msgListDiv.append(postTimeHtml);
			}
			msgListDiv.append(senderDiv);
		} else if (msg.sort == 'desc') {
			var lastIndex = msgArr.length - 1;
			msgListDiv.prepend(senderDiv);
			if (j == lastIndex || (lastPostTimeLongMinute == 0 || intervalEnough)) {
				postTimeHtml = $("<time class='p-send-time'></time>").text(postTimeStr);
				msgListDiv.prepend(postTimeHtml);
			}
		} else {
			if (lastPostTimeLongMinute == 0 || intervalEnough) {//彬彬: 时间码是否显示的判断. //不论是滞后2分钟还是超前2分钟,都显示出.针对消息晚到的情况.xu
				postTimeHtml = $("<time class='p-send-time'></time>").text(postTimeStr);
				msgListDiv.append(postTimeHtml);
			}
			msgListDiv.append(senderDiv);
		}
		lastPostTimeLongMinute = postTimeLongMinute;
	}

	if (msg.sort == 'desc') {
		// setTimeout(function() {//将聊天框里的消息落底 - 8.12
		// 	document.getElementById('personal_dialog_list').scrollTop = document.getElementById('personalDialogHistory').scrollHeight;
		// }, 200);
		document.getElementById('personal_dialog_list').scrollTop = document.getElementById('personal_dialog_list').scrollHeight;
	}


}

/*
更新私聊窗口消息
*/
function updatePersonalDialog(msg){
	var personal_dialog_window = replyOpptid; //全局变量replyOpptid来表示私聊窗口是否存在
	if(personal_dialog_window ){ //如果私聊窗口存在，将消息更新
		var msgArr = msg.msg_arr;
		var content, senderId, senderName, userImage, senderName_P, content_P, senderImg, msgType, senderImg_Div, senderDiv, msgListDiv;
		var postTimeHtml, postTimeStr, postTimeLongMinute, sender_topicid, topic_title, msgid;
		if(msgArr[0].sender_userinfo.userid != userId){
			msgListDiv = $("#personal_dialog_list");
			topic_title = msgArr[0].sender_userinfo.topic_content;//获得标题.
			senderId = msgArr[0].sender_userinfo.userid;//用户id
			content = msgArr[0].content;//发言正文.
			senderName = msgArr[0].sender_userinfo.name;//昵称
			userImage = msgArr[0].sender_userinfo.image_url;//头像
			postTimeStr = msgArr[0].msg_create_datetime_str;//发言时间,年月日的形式.
			msgid = msgArr[0].msg_id;//发言的pid
			senderName = cutStringIfTooLong(senderName,10);
			topic_title = cutStringIfTooLong(topic_title,10);

			postTimeLongMinute = msgArr[0].msg_create_datetime_long / 1000 / 60;//long型时间戳,转换为分钟.
			postTimeHtml = $("<time class='p-send-time'></time>").text(postTimeStr);
			sender_topicid = msgArr[0].sender_userinfo.sender_topicid;//话题id.

			senderName_P = $("<div class='p-nc'></div>").text(senderName);//昵称加标题元素.
			senderImg = $("<img />").attr("src", userImage).attr("id", senderId).attr("sender_topicid", sender_topicid).attr("senderId", senderId).attr("senderName", senderName).attr("senderImg", userImage).attr("senderMsgId", msgid).attr("senderContent", content);
			
			content_P = $("<div class='p-detail '></div>").attr('id', senderId).attr("sender_topicid", sender_topicid).attr("senderName", senderName).attr("senderMsgId", msgid).text(content);
			content_P.attr("class", "p-detail");//因为有回复事件,鼠标悬停变小手.
			senderImg_Div = $("<div class='p-user-pic'></div>").append(senderImg);
			senderDiv = $("<div class='p-user p-other'></div>").append(senderName_P).append(content_P).append(senderImg_Div);

			msgListDiv.append(postTimeHtml);		
			msgListDiv.append(senderDiv);

			document.getElementById('personal_dialog_list').scrollTop = document.getElementById('personal_dialog_list').scrollHeight;
		}
		
		}
}


//========================================他人主页模块功能 @wsy==============================================================================
function openUserOthersPage(e){
	console.log("准备打开他人主页")
	var senderName = $(e).attr("sendername");
	senderName = removeTopicTitleInSenderName(senderName);//去掉名字中的标题	
	var decodedTitle = specialLettersCoding(title);
	var userOtherId = $(e).attr("senderId");
	var data = {
		"userOtherId":userOtherId,
		"userOtherName":senderName,
		"userOtherImage":$(e).attr("src"),
		"userOtherTopicId":$(e).attr("sender_topicid"),
		"topicid":topicId,
		"title":decodedTitle,
		"search_word":decodedTitle,
		"server_domain":domain,
		"userId":userId,
		"userName":userName,
		"userImage":userImage,
		"adminName":adminName,
		"adminImageurl":adminImageurl,
		"userAgent":userAgent
	};
	closeWin(userOtherId);
	openWin(userOtherId, 'user_others_page/user_others_page.html', JSON.stringify(data));
}

function openUserMyPage(e){
	console.log("准备打开个人主页")
	var senderName = $(e).attr("sendername");
	senderName = removeTopicTitleInSenderName(senderName);//去掉名字中的标题	
	var decodedTitle = specialLettersCoding(title);
	var data = {
		"userId":$(e).attr("senderId"),
		"userName" :senderName,
		"userImage":$(e).attr("src"),
		"topicid" : topicId,
		"title" : decodedTitle,
		"search_word" : decodedTitle,
		"server_domain" : domain,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent
	};
	openWin('user_page', 'user_page/user_page.html', JSON.stringify(data));
}


function removeTopicTitleInSenderName(senderName){ //去掉名字中的标题
	var targetIndex = senderName.indexOf("[");
	if (targetIndex == -1) {
		return;
	} else {
		senderName = senderName.substring(0, targetIndex);
		return senderName;
	}
}

//关闭当前页，返回主界面   2016/12/25 deng
function closeBtn(){
	execRoot("setCurrentPageId('topics_page')");
	exec('topics_page',"removeUnreadNum('"+topicId+"')");
	openWin('topics_page', 'topics_page/topics_page.html', '');
	closeWin(_tmpPageId);
}

//返回上一页   2016/12/25 deng
function backBtn(){
	if(_topicPageSign == 'yes'){
		execRoot("setCurrentPageId('topics_page')");
		exec('topics_page',"removeUnreadNum('"+topicId+"')");
		openWin('topics_page', 'topics_page/topics_page.html', '');
	}else{
		closeWin(_tmpPageId);
	}

	//execRoot("closeWin("+_tmpPageId+")");
	//closeWin(_tmpPageId);
}

//打开个人主页  2016/12/25 deng
function openHomePage(e){
	var senderName = $(e).attr("sendername");
	senderName = removeTopicTitleInSenderName(senderName);//去掉名字中的标题
	var _userId = $(e).attr("senderId");
	var _params = {
		"userId":_userId,
		"userName" :senderName,
		"userImage":$(e).attr("src"),
		"server_domain" : domain,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent,
		"tmpPageId":userId
	};
	openWin(_userId, 'user_page/home_page.html', JSON.stringify(_params));

	toast("进入个人主页...");
}

//显示过往发言   2016/01/19 deng
function showUserReqTopicMessages(receivedData){
	var _obj = $("#dialog_box");
	var _h = _obj.height()/2;
	var contextResult = [];
	var _poster_arr = receivedData.poster_arr;
	contextResult.push('<div id="relationContext" style="height: ' + (_h - 60) + 'px">');
	if(undefined == _poster_arr || _poster_arr.length == 0 ){
		contextResult.push('<span style="padding-top: 10px;padding-left: 10px">无数据</span>');
	}else {
		$.each(_poster_arr, function (i, item) {
			contextResult.push('<div style="width: 100%;color: #999;display: inline-flex;">');
			contextResult.push('<div style="color: #303030;padding-left: 5px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width:80%;">' + item.poster + '</div>');
			contextResult.push('&nbsp;&nbsp;<span style="color: #999;width: 110px;"> ' + item.datetime_str + '</span></div>');
		});
	}
	contextResult.push('</div>');

	$("div#_promptMsg").remove();
	$("#bodyBgObj").append(contextResult.join(''));
}


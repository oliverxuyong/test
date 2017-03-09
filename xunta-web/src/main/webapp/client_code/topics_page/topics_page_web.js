function wsConnect() {
    execRoot("checkIfWSOnline4Signal()");
}


function showTopicList(P_topiclist) {//显示从服务器获得的话题列表:    这段代码出现在旧版本，因版本错乱出现在这里
	//$("#loadinganimation").remove();
	$("#showatloaded").show();

	//			$("#topic_list").empty();
	//获取历史数据的方法添加在了websocket.js里面的onOpen方法里，这样每次重新连接ws后都会从新请求历史消息，相当于刷新页面，但在从新请求前要将之前的删除掉，避免出现重复

	var topics;
	//            alert('P_topiclist   ' +P_topiclist);
	//            alert('P_topiclist.topics   ' +P_topiclist.topics);
	if (P_topiclist == undefined || P_topiclist.topics == undefined) {
		var tl = JSON.parse(P_topiclist);
		//                alert('进入if , parse后的topiclist   '+P_topiclist);
		topics = tl.topics;
	} else {
		topics = P_topiclist.topics;
	}

	$(".getmoretopics").show();
	if (topics.length < requestTopicNum) {//若每次返回来的话题列表小于预设的话题数则认为已经没有更多话题了  FANG 10.7
		if (requestTopicPage != 1) {
			$(".getmoretopics").text("(无更多话题)");
			$(".getmoretopics").unbind();
		} else {
			$(".getmoretopics").hide();
		}
		requestTopicPage++;
	}
	for (var j in topics) {
		appendElement(topics[j].topic_content, topics[j].topic_id, 'history', topics[j].newest_response_time_str.substring(5, 16), topics[j].msg_arr, '', '', topics[j].unread_msg_num,topics[j].isqingting);
		var lastTopicTime = topics[j].newest_response_time;
        execRoot("set_lastTopicTime("+lastTopicTime+")");
	}
}


/**
 * 注销功能，跳转到登录页面，修改本地文件logOff标识
 *  */
function logOff() {
	clearLocalstoreUserInfo();
	execRoot("deleteCookie()");
	execRoot("hideIndexLogInfo()");
	execRoot("initLastTopicTime()");
	execRoot("showLogin()");
	execRoot("clearTopicsPageOpenMark()");
    execRoot("clearCurrentPageId()");//在所有页面都关掉后,这个不清楚,会使toast等功能出现大量报错.
    closeAllPages2Index(); //xu 2016.4.9
}

function clearLocalstoreUserInfo(){
    localStorage.clear();
}

function enterDialogPage(topicid,isqingting) {
	var topictitle = $("#" + topicid + " .topictitle").attr("title");
	topictitle = specialLettersCoding(topictitle);
	var pageParam = {
		"topicid" : topicid,
		"title" : topictitle,
		"userid" : userId,
		"userName" : userName,
		"userImage" : userImg,
		"server_domain" : domain,
        "isqingting" : isqingting,
        "pageTitle":pageTitle,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent,
		"topicPageSign":"yes"
	};
	console.log("enterDialogPage topicid=" + topicid+"|topictitle="+topictitle);
	openWin(topicid,'dialog_page/dialog_page.html',JSON.stringify(pageParam));
}

function alterNickname() {
	api.prompt({
		buttons : ['确定', '取消'],
		title : '请输入新昵称:',
		text : userName
	}, function(ret, err) {
		if (ret.buttonIndex == 1) {
			var newNickname = ret.text;
			userName = newNickname;
            var pageParam = {
                "uid" : userId,
                "newNickname" : userName
            };
            execRoot("requestAlterNickname("+JSON.stringify(pageParam)+")");
		}
	});
}

function appendElement(topic_title, topic_id, topic_type, replyTime, msgArr, username, content, msg_unread_num,isqingting) {//一次处理一个topic.
	var selector = "#" + topic_id;
	var targetTopicidElement = $(selector);
	if (targetTopicidElement.length != 0) {
		return;
	}
	var topic_list_node = $("#topic_list");
	//定位div元素.
	//var titletmp = reduceTopicTitleLength(topic_title);//如果标题长度超出13,则截断并附加省略号. XU8.21
	var titletmp = cutStringIfTooLong(topic_title,60);//如果标题长度超出13,则截断并附加省略号. XU8.21
	var topic_node = $("<div></div>").attr("class", "topic cursor").attr("id", topic_id);
	var latestTime = $("<div></div>").attr("class", "latesttime").text(replyTime);
	topic_node.append(latestTime);
	//设定topictitle DIV
	var topicTitleDiv = $("<div class='topictitle' title='"+topic_title+"'></div>");//title上留一个完整的标题,进入聊天页时会用到.
    topicTitleDiv.append($("<span></span>").text(titletmp));
	//console.log('topic_title     :'+topic_title+'     msg_unread_num      :'+msg_unread_num);
	if (msg_unread_num != 0 & (topic_type == 'history' || topic_type == 'new')) {
		//设定 unread DIV
		var unreadNum_node = $("<div class='unread'></div>").text(msg_unread_num);
		//topictitle DIV append unread DIV
		topicTitleDiv.append(unreadNum_node);
	}
	topic_node.append(topicTitleDiv);
	if (msgArr == 'post_topic' || msgArr == 'updateTopic') {
		//如果是新创建话题或将话题从未显示状态到显示在列表上会执行这里  FANG
		var emptyDiv = $("<div></div>");
		topic_node.append(emptyDiv);
		//是为了让最新消息能够另起一行. xu 2015.10.19
		topic_node.append(returnRecentMsg(username, content));
	} else {
		for (var s = 0; s < msgArr.length; s++) {
			var emptyDiv = $("<div></div>");
			topic_node.append(emptyDiv);
			//是为了让最新消息能够另起一行. xu 2015.10.19
			topic_node.append(returnRecentMsg(msgArr[s].sender_userinfo.name, msgArr[s].content));
		}
	}
	topic_node.click(function() {//绑定点击事件.
		//enterDialogPage(topic_title,topic_id, this);
		enterDialogPage(topic_id,isqingting);
	});
	if (topic_type == 'history') {
		topic_list_node.append(topic_node);
	} else if (topic_type == 'new') {
		topic_list_node.prepend(topic_node);
	}
}

//==========================================以下为头像更换js代码======================================================
		function alterUserimage() {
			$("#account").hide();
			$("#ImageBox").show();
			$("#disableLayer").show();
			$("#imghead").attr("src", userImg);
		}

		/*
		 本地预览选中图片
		 */
		function previewImage(file) {
			if (!validate_edit_logo(file)) {//验证文件格式
				return;
			}
			var MAXWIDTH = 170;
			var MAXHEIGHT = 170;
			var div = document.getElementById('preview');
			if (file.files && file.files[0]) {
				div.innerHTML = '<img id=imghead>';
				var img = document.getElementById('imghead');
				img.onload = function() {
					var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
					img.width = rect.width;
					img.height = rect.height;
					img.style.marginLeft = rect.left + 'px';
					img.style.marginTop = rect.top + 'px';
				}
				var reader = new FileReader();
				reader.onload = function(evt) {
					img.src = evt.target.result;
				}
				reader.readAsDataURL(file.files[0]);
			} else {
				var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
				file.select();
				var src = document.selection.createRange().text;
				div.innerHTML = '<img id=imghead>';
				var img = document.getElementById('imghead');
				img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
				var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
				status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
				div.innerHTML = "<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;margin-left:" + rect.left + "px;" + sFilter + src + "\"'></div>";
			}
			$("#upload").show();
		}

		/*
		 验证文件格式
		 */
		function validate_edit_logo(file) {
			$("#upload").attr("disabled", false);
			if (!/.(gif|jpg|jpeg|png)$/.test($("#file").val())) {
				toast("图片类型必须是.gif,jpeg,jpg,png中的一种");
				$("#upload").attr("disabled", true);
				return false;
			}
			return true;
		}

		/*
		 设置图片显示大小
		 */
		function clacImgZoomParam(maxWidth, maxHeight, width, height) {
			var param = {
				top : 0,
				left : 0,
				width : width,
				height : height
			};
			if (width > maxWidth || height > maxHeight) {
				rateWidth = width / maxWidth;
				rateHeight = height / maxHeight;
				if (rateWidth > rateHeight) {
					param.width = maxWidth;
					param.height = Math.round(height / rateWidth);
				} else {
					param.width = Math.round(width / rateHeight);
					param.height = maxHeight;
				}
			}
			param.left = Math.round((maxWidth - param.width) / 2);
			param.top = Math.round((maxHeight - param.height) / 2);
			return param;
		}

		/*
		 将选中图片上传到服务器
		 */
		function upload() {
			var formData = new FormData();
			formData.append('userid', userId);
			formData.append('file', $('#file')[0].files[0]);
			$.ajax({
				url : "http://"+domain+"/xunta-web/upload", //server script to process data
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

		function afterSuccessAlterUserImage(ret){
			toast(ret.msg);
			userImg = ret.image_url;
			$("#userimage>img").attr("src", userImg);
			console.log("头像上传成功后,打印一下返回的数据,应该有一个image_url的项和值,如果没有需要调整:"+JSON.stringify(ret));
			这一步需要测试: window.localStorage.setItem('image', userImg);
			//这个方法需要创建,并且测试: setCookie("image",userImage);
		}

		function beforeSendHandler() {
			console.log("beforesend");
		}

		/*
		关闭头像更改窗口
		*/
		function closeImageBox() {
			$("#imghead").attr("width",170);
			$("#imghead").attr("height",170);
			$("#upload").hide();
			$("#ImageBox").hide();
			$("#disableLayer").hide();
		}


// ----------------------------------------------------------
//2016/11/20  用户主页首页  deng
function openHomePage(){
	var _params = {
		"userId" : userId,
		"userName" : userName,
		"userImage" : userImg,
		"server_domain" : domain,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent,
		"tmpPageId":userId
	};
	openWin(userId, 'user_page/home_page.html', JSON.stringify(_params));

	toast("进入个人主页...");
}

//2016/12/16  搜索  deng
/*function displaySearch(){
	$("#search_content").attr("class","search-content");
	$("#_searchTopicMore").removeAttr("onclick");
	$("#_searchTopicMore").find("img").attr("src","");
	$("#topicMoreText").html("");
	$("#_keywords").val("");
	$("#search-container").show();
}*/
function doSearch(){
	$("#search_content").attr("class","_search_content");
	var keywords = $("#_keywords").val();
	$("#search_list").html("");
	$("#_searchTopicMore").removeAttr("onclick");
	$("#topicMoreText").html("");
	if("" != keywords){
		$("#search-list-container").show();
		_keywords = keywords;
		searchSelfTopicPage();
	}
}

function searchSelfTopicPage(){
	execRoot("searchSelfTopicContent('" + userId + "','" + _keywords + "','" + _search_page + "')");
	_search_page++;
}

function displaySearchSelfTopicContent(receivedData){
	//function searchSelfTopicContent(receivedData){
	//var _topicHits = receivedData.topicHits;
	var _topic_arr = receivedData.topic_arr;
	if(undefined == _topic_arr || _topic_arr.length == 0){
		$("#_searchTopicMore").removeAttr("onclick");
		$("#topicMoreText").html("无数据");
	}else{
		var contentDiv = "";
		for(var i= 0;i<_topic_arr.length;i++){
			var _topicId = _topic_arr[i].topicid;
			var _isqingting = _topic_arr[i].isqingting;
			var _topic_title = _topic_arr[i].topic_title;
			var _total_hit_num = _topic_arr[i].total_hit_num;
			var _poster_arr = _topic_arr[i].poster_arr;
			contentDiv +='<div class="topic-content"><div class="_titleDiv" onclick="enterDialogPage(\''+_topicId+'\',\''+_isqingting+'\')"><div class="topic-Title">'+_topic_title+'</div></div><div id="msg'+_topicId+'" class="_topicMsgDiv">';
			if(_poster_arr != ""){
				for(var j= 0;j<_poster_arr.length;j++) {
					var _poster = cutStringIfTooLong(_poster_arr[j].poster,60);
					contentDiv += '<div class="topicMsg"><span style="color: #428bca">'+_poster_arr[j].poster_username+'</span>：<span style="font-size: 12px">'+_poster+'</span><span class="_msgTime">'+_poster_arr[j].datetime_str+'</span></div>';
				}
			}
			contentDiv +='</div><div id="_msgMore'+_topicId+'" class="topicMsgMoreDiv">';
			if(_total_hit_num > _default_posters_num ){
				contentDiv +='<span class="topicMsgMoreText" onclick="doMoreSelfHitMsg(\''+_topicId+'\',1)">'+(_total_hit_num-_default_posters_num)+' more</span><input type="hidden" id="hitNum'+_topicId+'" value="'+_total_hit_num+'"><input type="hidden" id="posterPage'+_topicId+'" value="1">';
			}
			contentDiv +='</div></div>';

		}
		$("#search_list").append(contentDiv);

		if(_topic_arr.length == _default_topics_num){
			$("#_searchTopicMore").attr("onclick","searchSelfTopicPage()");
			$("#topicMoreText").html("更多话题");
		}else{
			$("#_searchTopicMore").removeAttr("onclick");
			$("#topicMoreText").html("没有了");
		}
	}
	$("#_searchTopicMore").find("img").attr("src","../image/threedotmoving.jpg");

}

function doMoreSelfHitMsg(_topicId,_poster_page){
	_poster_page++;
	execRoot("getMoreSelfHitMsgs('"+_keywords+"','"+_topicId+"','"+_poster_page+"')");
}

function displayMoreSelfHitMsg(receivedData){
	var _topicId = receivedData.topicid;
	var _poster_arr = receivedData.poster_arr;
	var _msgContent = "";
	if("" != _poster_arr) {
		for (var j = 0; j < _poster_arr.length; j++) {
			var _poster = cutStringIfTooLong(_poster_arr[j].poster,60);
			_msgContent += '<div class="topicMsg"><span style="color: #428bca">' + _poster_arr[j].poster_username + '</span>：<span style="font-size: 12px">' + _poster + '</span><span class="_msgTime">' + _poster_arr[j].datetime_str + '</span></div>';
		}

		$("#msg"+_topicId).append(_msgContent);

		var _hitNum = $("#hitNum"+_topicId).val();
		var _posterPage = $("#posterPage"+_topicId).val();
		var _currentNum = _posterPage * _default_posters_num + _poster_arr.length;
		$("#_msgMore"+_topicId).html("");
		if(_hitNum > _currentNum){
			_posterPage++;
			$("#_msgMore"+_topicId).html('<span class="topicMsgMoreText" onclick="doMoreSelfHitMsg(\''+_topicId+'\','+_posterPage+')">'+(_hitNum-_currentNum)+' more</span><input type="hidden" id="hitNum'+_topicId+'" value="'+_hitNum+'"><input type="hidden" id="posterPage'+_topicId+'" value="'+_posterPage+'">');
		}
	}
}

function closeSearch(){
	document.getElementById("_keywords").value="";
	$("#search-list-container").hide();
	$("#search_list").empty();
}




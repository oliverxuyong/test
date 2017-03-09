
//F 0115 封装搜索请求，每次请求时请求页面数+1
function search_page() {
	var script = "searchTopics('" + topicId + "','" + searchword + "','" + page + "','" + topicPagenum + "','"+topicMsgPageNum+"')";
	execRoot(script);
	page++;
}

/*在app和web里都不需要这两个方法了. xu 16.3.8
 function inputboxOnFocus(inputObj) {
 //inputObj.value = "";
 }

 function inputboxOnBlur(inputObj) {
 //dialogboxFollowInput();
 }
 */
 
function adjustWidthsHeights() {
	//console.log("进入搜索页 adjustWidthsHeights方法.");
	//console.log("先看看:inputframe宽度="+$("#inputframe").width());
	document.getElementById("searchinputbox").style.width = $("body").width() - 120 + "px";
	//自适应调整输入框的宽度,因为右边有提交按钮图片.xu8.24
	//console.log("减去68,调整之后的: 'searchinputbox'宽度="+document.getElementById("searchinputbox").style.width);

	//console.log("先看看body的offset="+$("body").offset().top);
	//console.log("先看看body的height"+$("body").height());
	document.getElementById("dialog_box").style.height = $("body").height() - 40 + "px";
	//自适应调整对话框的高度.
	//console.log("调整之后的dialog_box高度="+document.getElementById("dialog_box").style.height);
}

function showSearchResult(evntdata) {//首次进入搜索页并得到搜索结果后,先用这个方法显示出来.
    //console.log('111')
	var searchedusers = evntdata.searchresult;
	var i = -1;
	for (i in searchedusers) {//逐个显示每个人的数据.
		var user = searchedusers[i];
		// F 0115 封装插入话题插入方法
		appendSearchResult(user);
	}
	//console.log("i=" + i);
	if (i == -1 & $(".user-box").length == 0) {//Fang 4.22 更新 添加页面中的user-box判断，为零时表示该页面是第一次搜索。 这句没有起作用. xu 2016.3.8
		console.log("判断为第一次搜索,并且结果为空.");
		var zeroResultE = $("<div id='zeroresult'>{还没有任何人说过类似的话题或发言}</div>");
		$("#dialog_box").append(zeroResultE);
	} else {
		$("#morepeople").remove();
		//promptInputSearchWords();
		if (searchedusers.length < topicPagenum) {
			console.log("判断为 没有了");
			var moreTopics = $("<button id='morepeople'>...没有了...</button>");
			$("#dialog_box").append(moreTopics);
		} else {
			var moreTopics = $("<button id='morepeople' class='cursor'>...更多搜索结果...</button>");
			moreTopics.bind("click", function() {
				getMorePeople();
			});
			$("#dialog_box").append(moreTopics);
		}
	}
}

//F 0115 将添加话题抽离出来成一个独立的方法，在点击获取更多话题按钮时还会调研该方法
function appendSearchResult(user) {
	var dialogbox = $("#dialog_box");
	var userid = user.userid;
	var qingTingId = user.qingting_id;
	var qingTingTitle = user.qingting_title;
	var userbox, userQingTing, user, topics;
	var eLib = $("#e-lib");
	userbox = eLib.find(".user-box").first().clone();
	userQingTing = userbox.find(".link-qingting");
	
	if(user.self_qingting=="yes"){
		userQingTing.html("⊙");
	}else if(user.qingting_linked=="yes"){
		userQingTing.html("√");
	}else{
		userQingTing.html("+");
	}
	
	if(user.self_qingting=="no" && user.qingting_linked=="no"){
	 	var script = "link2mytopic('" + qingTingId + "','" + qingTingTitle + "')";
		userQingTing.attr("onclick", script);
		userQingTing.attr("id", qingTingId);
		userbox.find(".nickname").attr("onclick", script);
		userbox.find(".nickname").attr("id", qingTingId);
	}
	
	//判断搜索页的结果中 他人或者自己，打开个人主页
	userbox.find("img").attr("src", user.image_url).attr("id", userid).attr("nickname", user.nickname);
	userbox.find("img").addClass("cursor");
	//senderImg = $("<img />").attr("src", userImage).attr("id", senderId).attr("sender_topicid", sender_topicid).attr("senderId", senderId).attr("senderName", senderName).attr("senderImg", userImage).attr("senderMsgId", msgid).attr("senderContent", content);

	if(user.self_qingting=="no"){
		userbox.find("img").click(function(){
			openUserOthersPage(this);
		});
	}else{
		// userbox.find("img").click(function(){
		// 	openUserMyPage(this);
		// });
		userbox.find("img").click(function(){
			openHomePage(this);
		});
	}
	userbox.find(".nickname").html(user.nickname);
	
	topics = user.topic_arr;
	var topiclistNode = userbox.find(".topic-list");
	//console.log("nickname:"+user.nickname);
	//console.log("topiclistNode.html():"+topiclistNode.html());
	appendTopics(topics, userid, topiclistNode);
	if (topics.length < user.dochits) {
		var moreTopicButton = $("<div class='moretopics cursor'>["+topics.length+"/"+user.dochits+" ⇊]</div>");
		moreTopicButton.attr("id", userid);
		moreTopicButton.bind("click", function() {
			getMoreTopic(userid);
		});
		topiclistNode.append(moreTopicButton);
	}
	dialogbox.append(userbox);
}

function getMoreTopic(userid) {//向服务器请求某人下的更多话题[more].
	if (userPageArray[userid] == undefined) {
		userPageArray[userid] = 2;
	} else {
		userPageArray[userid]++;
	}
	var script = "getPeopleMoreTopics('" + topicId + "','" + searchword + "','" + userPageArray[userid] + "','" + topicPagenum + "','" + userid + "')";
	execRoot(script);
}

//F 0118 封装获取某用户下话题并显示在页面中的方法
function appendSearchPeopleMoreTopics(user) {
	var topics = user.topic_arr;
	var userid = user.userid;
	var topiclistNode = $(".topic-list #" + userid);
	appendTopics(topics, userid, topiclistNode);

	if (userPageArray[userid] * topicPagenum >= user.dochits) {
		$("#" + userid).text("[end]");
		$("#" + userid).attr("class", "moretopics");
		$("#" + userid).unbind("click");
	}else{
        $("#" + userid).text("["+userPageArray[userid] * topicPagenum+"/"+user.dochits+" ⇊]");
    }
}

//0309  将获取更多和加载更多方法中的循环添加话题和话题消息的代码封装成一个函数
function appendTopics(topics, userid, topiclistNode) {
	var topic, topicbox, topictitleE, posters, posterlistE, poster, posterbox, topiclistE,topicid,total_his_msgs;
	topiclistE = topiclistNode;
	var eLib;
	for (j in topics) {
		topic = topics[j];
        topicid = topic.topicid;
		eLib = $("#e-lib");
		topicbox = eLib.find(".topic-box").first().clone();
		topictitleE = topicbox.find(".title");
		//topictitleE.html("+&nbsp;[" + topic.topic_title + "]");
		topictitleE.html("+&nbsp;[" + parseHtml(topic.topic_title) + "]");//parseHtml重点是对大于号和小于号换成&码,但保留高亮的html码.
		//console.log(topic.topic_title);
		// + topic.total_hit_num);
		posters = topic.poster_arr;
        total_his_msgs = topic.total_hit_num;
		posterlistE = topicbox.find(".poster-list");
		//console.log("posterlistE.html:-----:"+posterlistE.html());
		for (k in posters) {
			poster = posters[k];
			posterbox = eLib.find(".poster-box").first().clone();
			posterbox.find(".content").html("~" + parseHtml(poster.poster));
			//console.log(topic.topic_title+"| k="+k+"|"+poster.poster);
			posterbox.find(".time").text(poster.datetime_str);
			posterlistE.append(posterbox);
		}
        appendMoreMsgButton(posters.length,topicid,posterlistE,total_his_msgs);
		if (topic.selftopic == "yes") {//如果是自己的话题,则不加点击,并在首处换为圆⊙圈号.
			topictitleE.html("⊙&nbsp;[" + topic.topic_title + "]");
			// + topic.total_hit_num);
		}
		if (topic.linkedtopic == "yes") {//如果是已连接的话题,则不加点击,并在首处换为圆√圈号.
			topictitleE.html("√&nbsp;[" + topic.topic_title + "]");
			// + topic.total_hit_num);
		}

		topic.topic_title = topictitleE.text();
		//这句是要去掉title中的html高亮代码,供下面传参数使用.
		if (topic.selftopic == "no" && topic.linkedtopic == "no") {//如果是自己的话题,或者已是连接上的,则不加点击.
			var script = "link2mytopic('" + topic.topicid + "','" + topic.topic_title + "')";
			//console.log(script);
			topictitleE.attr("onclick", script);
			topictitleE.attr("id", topic.topicid);
			//用于连接成功后的操作定位.
		}
		topiclistE.before(topicbox);
	}
}
// 0314 将添加话题消息获取更多按钮封装成一个独立的方法
function appendMoreMsgButton(posterLength,topicid,posterlistE,total_msgs){
    if(posterLength < total_msgs){
        //var click4morepostersE = $("<div class='click4moreposters cursor'>["+posterLength+"/"+total_msgs+" more]</div>");//上句换为这一句.只显示 [3 more].xu 2016.3.28
        var click4morepostersE = $("<div class='click4moreposters cursor'>"+(total_msgs-posterLength)+" more</div>");//上句换为这一句.只显示 [3 more].xu 2016.3.28
        
        click4morepostersE.attr("id",topicid);
        click4morepostersE.click(function() {
            var topicid = $(this).attr("id");
            var topicMsgPage;//话题下的消息分页数
            if(topicMsgArray[topicid] == undefined){
                topicMsgArray[topicid] = 2;
                topicMsgPage = 2;
            }else{
                var num = topicMsgArray[topicid];
                num++;
                topicMsgPage = num;
                topicMsgArray[topicid] = num;
            }
            var script = "getMoreMsges('" + topicId + "','" + searchword + "','" + topicid + "','" + topicMsgPage +  "','"+topicMsgPageNum+"')";
            execRoot(script);
        });
        posterlistE.append(click4morepostersE);
    }
}
// 0314 新增添加话题消息数方法。
function appendMoreMsg(evntdata){
    var tid = evntdata.topicid;
    var total_hit_msgs = evntdata.total_hit_msgs;
    var posterArr = evntdata.poster_arr;
    var currentClick4morepostersNote = $(".poster-list #"+tid+".click4moreposters");
    for (k in posterArr) {
        poster = posterArr[k];
        posterbox = $(".poster-box").first().clone();
        posterbox.find(".content").html("~" + poster.poster);
        posterbox.find(".time").text(parseHtml(poster.datetime_str));
        currentClick4morepostersNote.before(posterbox);
    }
    if(topicMsgPageNum * topicMsgArray[tid] >= total_hit_msgs){
        currentClick4morepostersNote.text("none");
        currentClick4morepostersNote.unbind("click");
        currentClick4morepostersNote.attr("class","click4moreposters");
    }else{
        //currentClick4morepostersNote.text("["+topicMsgArray[tid] * topicMsgPageNum+"/"+total_hit_msgs+" more]");
        //console.log("发言数:"+topicMsgArray[tid] +"|"+ topicMsgPageNum+"|"+total_hit_msgs); 
        currentClick4morepostersNote.text("" + (total_hit_msgs - topicMsgArray[tid] * topicMsgPageNum) + " more");//上句换为这一句.只显示 [3 more].xu 2016.3.28
    }
}
/*
 function promptInputSearchWords(){
 var elementInputBox = document.getElementById("inputbox");
 elementInputBox.value = '输入搜索词:';
 }*/

function link2mytopic(topicid_belinked, topictitle_belinked) {
	//alert("进入了link2mytopic()方法.");//这块改成确认.可以取消.
	api.confirm({
		msg : "将当前话题连接Ta的" + topictitle_belinked + " ?",
		buttons : ['确定', '取消'],
	}, function(ret, err) {
		if (ret.buttonIndex == 1) {
			var script = "link2mytopic('" + topicid_belinked + "','" + topicId + "')";
			execRoot(script);
		}
	});
	console.log("要连接的topicid:=" + topicid_belinked);
}

function markLink2MytopicSuccess_SearchPage(topictitle_belinked, topicid_belinked) {
	var info = "[" + topictitle_belinked + "]成功接入当前话题.";
	costomToast(info, 2500, "middle");
	var topicTitleE = $("#" + topicid_belinked);
	var title = topicTitleE.html();
	topicTitleE.html(title.replace("+", "√"));
	topicTitleE.removeAttr("onclick");
	//onclick属性事件不能用unbind来删除.
	//console.log("被点击的title:"+topictitle_belinked+"|被修改后的的ttitle:"+title);
	console.log(topicTitleE.html());
}

function inputSubmit() {
	//document.getElementById("inputbox").focus();
	var inputBoxValue = document.getElementById("searchinputbox").value;
	console.log("进入inputsubmit inputBoxValue" + inputBoxValue);
	if (inputBoxValue != "") {
		$("#dialog_box").html("");
		//document.getElementById("searchinputbox").value = "";
		searchword = inputBoxValue;
		//F 0315 点击搜索时相当于刷新页面，需要初始化累计分页数的变量
		page = 1;
        userPageArray = new Array();
        topicMsgArray = new Array()
		search_page();
	}
}

//F 0115 增加获取更多命中人
function getMorePeople() {
	//$("#morepeople").remove();
	search_page();
}
//除font标签用来高亮显示外，将其他html字符通过pre标签正常显示
function parseHtml(htmlStr) {
    var newStr= htmlStr.replace(/(<font color=[\'\"]red[\'\"]>.*?<\/font>)/g,"</pre>$1<pre>");
    newStr= "<pre>"+newStr+"</pre>";
    newStr=  newStr.replace(/<pre>(.*?)<\/pre>/g,function(o){
        return o.replace(/<pre>(.*?)<\/pre>/g,"$1")
            .replace(/(<)/g,"&lt;").replace(/(>)/g,"&gt;")
    });
    return newStr;
}

//打开他人主页
function openUserOthersPage(e){ //wsy
	console.log("从搜索页面准备打开他人主页")
	//var senderName = $(e).attr("sendername");
	//senderName = removeTopicTitleInSenderName(senderName);//去掉名字中的标题	
	var userOtherName = parseNickName($(e).attr("nickname")); //去掉名字中的font标签
	var decodedTitle = specialLettersCoding(title);
	//var userOtherId = $(e).attr("senderId");
	var userOtherId = $(e).attr("id");
	var data = {
		// "userOtherId":$(e).attr("id"),
		// "userOtherName" :$(e).attr("nickname"),
		// "userOtherImage":$(e).attr("src"),
		// "topicid" : topicId,
		// "userId":userId,
		// "userName":userName,
		// "userImage":userImage,
		// "title" : title,
		// "search_word" : title,
		// "server_domain" : domain,
		// "adminName": adminName,
		// "adminImageurl": adminImageurl,
		// "userAgent":userAgent
		"userOtherId":userOtherId,
		"userOtherName":userOtherName,
		"userOtherImage":$(e).attr("src"),
		"userOtherTopicId":$(e).attr("sender_topicid"),
		"topicid":topicId,
		"title":decodedTitle,
		"search_word":decodedTitle,
		"server_domain":domain,
		"userId":userId,
		"userName":userName,
		"userImage":userImage,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent
	};
	console.log(data)
	openWin(userOtherId, 'user_others_page/user_others_page.html', JSON.stringify(data));

	closeWin('search_page');
}

//打开自己主页 
//此功能由其他人做，本函数作废
function openUserMyPage(e){
	console.log("从搜索页面准备打开个人主页")
	var data = {
		"userId":$(e).attr("senderId"),
		"userName" :$(e).attr("nickname"),
		"userImage":$(e).attr("src"),
		"topicId" : topicId,
		"title" : title,
		"search_word" : title,
		"server_domain" : domain,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent
	};

	openWin('user__page', 'user_page/user_page.html', JSON.stringify(data));
}

//去掉名字中的font标签
//"<font color='red'>路飞</font>"  => "路飞"
function parseNickName(htmlStr){
	//htmlStr = "<font color='red'>路飞</font>";
	var newStr= htmlStr.replace(/<font color='red'>/g,"")
				.replace(/<\/font>/g,"");
	return newStr;
}

//打开个人主页  2016/12/25 deng
function openHomePage(e){
	var _userName = parseNickName($(e).attr("nickname"));
	var _userId = $(e).attr("id");
	var _params = {
		"userId":_userId,
		"userName" :_userName,
		"userImage":$(e).attr("src"),
		"server_domain" : domain,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent,
		"tmpPageId":userId
	};
	openWin(_userId, 'user_page/home_page.html', JSON.stringify(_params));

	toast("进入个人主页...");

	closeWin('search_page');
}
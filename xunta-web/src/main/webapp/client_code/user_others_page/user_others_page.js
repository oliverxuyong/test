/*
	获取dialoge页面参数,传入页面的全局变量
*/
function getPageParam(Parameter) { 
	topicId = Parameter.topicid;//the previous topicid from which this searchpage was clicked 
	userOtherId = Parameter.userOtherId;
	title = specialLettersDecoding(Parameter.title);

	userOtherName = Parameter.userOtherName;
	userOtherImage = Parameter.userOtherImage;
	userOtherTopicId = Parameter.userOtherTopicId;
	userId = Parameter.userId;
	userName = Parameter.userName;
	userImage = Parameter.userImage;
	adminName = Parameter.adminName;
	adminImageurl = Parameter.adminImageurl;
	userAgent = Parameter.userAgent;
	domain = Parameter.server_domain;
}

//  2016/12/24 注 deng
//关闭页面事件
//$("#closeOtherPage").click(function (){
//	console.log("执行关闭他人主页..")
//	//closeWin(topicId);
//	if('search_page'!=null){  //如果是从搜索页面进来的,必须要先关闭搜索页面
//		closeWin('search_page');
//	}
//
//	startPage = 0;
//	var pageParam = {
//		"topicid" : topicId,
//		"title" : title,
//		"userId" : userId,
//		"userName" : userName,
//		"userImage" : userImage,
//		"server_domain" : domain,
//		"isqingting" : 'false',
//		"pageTitle":title,
//		"adminName": adminName,
//		"adminImageurl": adminImageurl,
//		"userAgent":userAgent
//	};
//
//	console.log("enterDialogPage topicid=" + topicId+"|topictitle="+title);
//	openWin(topicId,'dialog_page/dialog_page.html',JSON.stringify(pageParam));
//	closeWin('user_others_page');
//
//
//});


//获得用户的话题
function getSortedUserTopics(startPage){
	var userTopicsParam = {
		"_interface":"get_sorted_user_topics",
		"userid":userOtherId,
		"myuid":userId,
		"start":startPage==undefined?0:startPage,  
		"requestTopicCounts":$("#showTopicsAboutMe")[0].checked == true ?20000 :20,
		"ifLinkedTopics":$("#showTopicsAboutMe")[0].checked == true ? "yes":"no"
	};
	execRoot("getSortedUserTopics("+JSON.stringify(userTopicsParam)+")");
}

//是否显示与我相关的话题切换事件
$("#showTopicsAboutMe").change(function(){
	$("#topic_content").empty();
	getSortedUserTopics(0);
});


//显示他人页面的话题
function showSortedUserTopics(data){
	console.log("他人主页：开始处理返回的话题数据。。。;data:"+data);
	var topicsCount = data.totalCounts;
	$("#topicCounts").text(topicsCount);
	$("#loading").removeClass("cursor");
	$("#loadingMoretopic").unbind("click");//获取值数据之后解绑单击事件
	if(topicsCount <= 0 || data.topiclist.length <=0){
		$("#loadingMoretopic").text("没有了");
		return;
	}
	if(topicsCount <= data.requestTopicCounts){ //总数<=请求数时，不要继续加载
		showAllTopics(data);
		$("#loadingMoretopic").text("没有了");
		$("#loadingMoretopic").unbind("click");//获取值数据之后解绑单击事件
	}else{
		showAllTopics(data); 
		var length = data.topiclist.length;
		if(length < data.requestTopicCounts){ // 返回数组的长度< 请求数量时，不要继续加载
			$("#loadingMoretopic").text("没有了");
		}else {	// 返回数组的长度>=  请求数量时，可以继续加载
			$("#loading").addClass("cursor");
			$("#loadingMoretopic").text("更多话题");
			$("#loadingMoretopic").on("click",function(){
				var startPage  = startPageAdd(); //通过闭包增加startPage数值
				getSortedUserTopics(startPage);
			});	

		}
	}
/*
	if(data.requestTopicCounts < topicsCount ){ //请求数 < 总数时，可以继续加载
		showAllTopics(data); 
		var length = data.topiclist.length;
		if(length < data.requestTopicCounts){ // 返回数组的长度< 请求数量时，不要继续加载
			$("#loadingMoretopic").text("无更多话题"); 
		}else {	// 返回数组的长度>=  请求数量时，可以继续加载
			$("#loading").addClass("cursor");
			$("#loadingMoretopic").text("更多话题");
			$("#loadingMoretopic").click(function(){
				var startPage  = startPageAdd(); //通过闭包增加startPage数值
				getSortedUserTopics(startPage);
				setTimeout(function() {		
				document.getElementById('topic_content').scrollTop = document.getElementById('topic_content').scrollHeight;	
				},200);
			});	

		}
	

	}else{
		showAllTopics(data);
		$("#loadingMoretopic").text("无更多话题");
		$("#loadingMoretopic").unbind("click");//获取值数据之后解绑单击事件
	}
*/
	
}

//显示话题
function showAllTopics(data){
	var topicContentDiv = $("#topic_content");;
	var j;
	var topicArr = data.topiclist;
	var topicTitleDiv = "";
	for(j in topicArr){		
		
		//var topicTitleDiv = "<div class='topic_title_div'>"+topicArr[j].topicTitle+"</div>";
		if(topicArr[j].if_linked == "no"){
				topicTitleDiv += "<div class='topic_title_div' data-topicid='"+topicArr[j].topic_id+"' data-topictitle='"+topicArr[j].topicTitle+"' onclick='qingtingOrNewWIndow(this)'><div class='linkMarkImg' >＋</div><div class='topicTitle-text-div'><p class='topicTitle-text'>"+topicArr[j].topicTitle+"</p></div></div>";
		}else if(topicArr[j].if_linked == "yes"){
				var k ;
				var myLinkedTopicTitlesDiv = "";
				for(k in topicArr[j].myLinkedTopics){
					myLinkedTopicTitlesDiv += "<div class='_myLinkedTopicInfo'><div class='myLinkedTopicTitle' data-topicid='"+topicArr[j].myLinkedTopics[k].topicid+"' data-topicTitle='"+topicArr[j].myLinkedTopics[k].topicTitle+"' data-isqingting='"+topicArr[j].myLinkedTopics[k].isqingting+"' onclick='openMyTopic(this)'><span >"+topicArr[j].myLinkedTopics[k].topicTitle+"</span></div><div class='_linkedUserDiv'><img src='"+userImage+"'/></div> </div>";
				}
				topicTitleDiv += 
					"<div class='topic_title_div'> <div class='linkMarkImg'>√&nbsp;</div><div class='topicTitle-text-div'><p class='topicTitle-text'>"+topicArr[j].topicTitle
					+"</p></div><div class='linkMarkImg1Div'><img class='linkMarkImg1' src='../image/doublelink-65x24.png' style='width:15px;height:6px;' class='linkMarkImg1'/></div>"
					+myLinkedTopicTitlesDiv
					+"</div>";

		}		
		
	}
	topicContentDiv.append(topicTitleDiv);
}

function openMyTopic(e){
	var topicid = $(e).data("topicid");
	var topicTitle = $(e).data("topictitle");
	var isqingting = $(e).data("isqingting");
	var pageParam = {
		"topicid" : topicid,
		"title" : topicTitle,
		"userid" : userId,
		"userName" : userName,
		"userImage" : userImage,
		"server_domain" : domain,
		"isqingting" : isqingting,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent
	};
	console.log("打开话题页面：DialogPage topicid=" + topicid+"|topictitle="+topicTitle);
	openWin(topicid,'dialog_page/dialog_page.html',JSON.stringify(pageParam));
	
}

//连接他人的某个话题：倾听或者新窗口
function qingtingOrNewWIndow(e) {
	var topic_id =$(e).data("topicid");
	var topic_title =$(e).data("topictitle");
	api.confirm({
		msg : "请选择和该话题连接的窗口:",
		buttons : ['当前话题', '新窗'],
	}, function(ret, err) {

		if (ret.buttonIndex == 1) {
			var script = "link2mytopic('" + topic_id + "','" + topicId + "')";
			execRoot(script);
		}else if(ret.buttonIndex == 2) {
			// var script = "enterDialogPage_MoveToNewTopic('" + topic_id + "','" + topicId + "')";
			// execRoot(script);
			enterDialogPage_MoveToNewTopic(topic_id,topic_title);
		}

	});
	console.log("要连接的topicid:=" + topic_id);
}

//点击他人内容创建新窗口话题 
function enterDialogPage_MoveToNewTopic(topic_id,topic_title) {
			var tmpTopicId = new Date().getTime();//用于生成一个新话题的临时唯一ID  9.16 FANG
			console.log('打开新页面 enterDialogPage_MoveToNewTopic from_topicid=' + topic_id+"|tmpTopicId="+tmpTopicId+"|senderid="+userOtherId);
			
			var userInfo = {
				"topicid" : 'none',
				"tmptopicid" : tmpTopicId,
				"userid" : userId,
				"title" : '输入第一句,开始新窗对话...',
				"userName" : userName,
				"userImage" : userImage,
				"current_topic_id" : topicId,
				"from_topicid" : topic_id,
				"from_senderId" : userOtherId,
				"from_topictitle" : topic_title,
				"from_senderName" : specialLettersCoding(userOtherName),
				"from_senderImg" : userOtherImage,
				"from_senderContent" : topic_title,
				"server_domain" : domain,
				"adminName": adminName,
				"adminImageurl": adminImageurl,
				"userAgent":userAgent
			};
			console.log(userInfo)
			openWin(tmpTopicId, 'dialog_page/dialog_page_movetonewtopic.html', JSON.stringify(userInfo));
			

}

//闭包解决获得话题数据的 start参数
var startPageAdd = (function(){
	var startPage = 0;
	return function(){
		return startPage += 20;
	}
})();
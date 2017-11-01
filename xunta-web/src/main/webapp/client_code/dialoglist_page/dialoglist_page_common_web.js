//返回上一页   2016/12/25 deng
function backBtn(){
/*	if(_topicPageSign == 'yes'){
		execRoot("setCurrentPageId('main_page')");*/
	//退出聊天列表时首页的未读消息数去除
	exec('main_page',"removeUnreadNum()");
	
	//聊天列表未读数去除
	exec('dialoglist_page',"changeUnreadColor()");
	
	//openWin('main_page', 'main_page/main_page.html', '');
	closeWin('dialoglist_page');
}

//关闭当前页，返回主界面   2016/12/25 deng
function closeBtn(){
	execRoot("setCurrentPageId('main_page')");
	openWin('main_page', 'main_page/main_page.html', '');
	closeWin('dialoglist_page');
}

function showDialogList(data){
	//将聊天列表的数据放入之前先将存在的数据删除
	var allDialog=$(".dialog");
	for(var i=0;i<allDialog.length;i++){
		allDialog.eq(i).remove();
	}
	
	for(var d in data){
		var createTime=data[d].create_time;//最新回复时间
		var ifread=data[d].ifread;//是否有未读
		var msg=data[d].msg;//消息内容
		var toUserId=data[d].to_user_id;
		var toUserImgUrl=data[d].to_user_imgUrl;
		var toUserName=data[d].to_user_name;
		
		appendDialogElement(createTime,ifread,msg,toUserId,toUserImgUrl,toUserName);
	}
	//从首页传过来的聊天列表的未读信息
	if(unreadObjList.length>0){
		for(var i in unreadObjList){
			unreadMsg(unreadObjList[i].user,unreadObjList[i].data,unreadObjList[i].postTimeStr,unreadObjList[i].touserId,unreadObjList[i].unreadNum);
		}
	}
	
	//将聊天列表的外框的height设置
	var dialogListOut=$("#dialog_list");
	var dialogListOutHeight=$("body").height()-64;
	dialogListOut.css("height",dialogListOutHeight+"px");
}

function appendDialogElement(createTime,ifread,msg,toUserId,toUserImgUrl,toUserName){
	var dialog=$("<div></div>").attr("class", "dialog cursor").attr("id", toUserId);
	//onerror是实现获得图片失败的时候放的默认图片,只要有一个图片路径就行
	var toUserImg="<img src="+toUserImgUrl+" onerror="+"javascript:this.src='"+"http://42.121.136.225:8888/user-pic2.jpg"+"'>";
	var dialogContent=$("<div></div>").attr("class", "dialog_content");
	
	var dialogContentTop=$("<div></div>").attr("class", "dialog_content_top");
	msg=cutStringIfTooLong(msg,17);
	var dialogContentMsg=$("<div></div>").attr("class", "dialog_content_msg").text(msg);
	
	var dialogContentName=$("<div></div>").attr("class", "dialog_content_name").text(toUserName);
	var dialogContentTime=$("<div></div>").attr("class", "dialog_content_time").text(showDialogListTime(createTime));
	
	dialogContentTop.append(dialogContentName).append(dialogContentTime);
	dialogContent.append(dialogContentTop).append(dialogContentMsg);
	dialog.append(toUserImg).append(dialogContent);
	
  	var dialogList=$("#dialog_list");
	dialogList.append(dialog);
	
	//设置聊天列表的各个大小
	var heightForWindow=$("body").height();
	var dialogHeight=(heightForWindow-63)*0.1;
	dialog.css("height",dialogHeight);
	
	//聊天列表动态布局
	setDialogListNode(dialog,dialogContent);
	
	dialog.click(function() {//绑定点击事件.
		enterDialogPage(toUserId,toUserName);
	});
}

//聊天列表动态布局
function setDialogListNode(dialog,dialogContent){
	var dialogHeight=parseInt(dialog.css("height"));//获得聊天列表单个的高度
	var dialogWidth=parseInt(dialog.css("width"));//获得聊天列表单个的高度
	
	//头像css设置
	var toUserImgHeight=dialogWidth*0.0943;//图片的高度是聊天列表宽度的0.1026
	var toUserImgMargin=(dialogHeight-toUserImgHeight)/2;
	var toUserImg=dialog.find("img");
	toUserImg.css("height",toUserImgHeight);
	toUserImg.css("width",toUserImgHeight);
	toUserImg.css("margin-left",toUserImgMargin*2);
	toUserImg.css("margin-top",toUserImgMargin);
	
	//文字css设置
	var dialogContentWidth=dialogWidth-toUserImgHeight-(toUserImgMargin*5);
	dialogContent.css("height",dialogWidth*0.1026);
	dialogContent.css("width",dialogContentWidth);
	dialogContent.css("margin-top",toUserImgMargin);
	dialogContent.css("margin-left",toUserImgMargin);
	
	//dialogContent.css("margin-left",toUserImgMargin/2);
	
	//设置文字内容的line-height
	var dialogContentNameHeight=dialogContent.find(".dialog_content_name").css("height");
	$(".dialog_content_name").css("line-height",(parseInt(dialogContentNameHeight))+"px");
	$(".dialog_content_name").css("font-size",parseInt(dialogContentNameHeight)*0.7+"px");
	
	var dialogContentTimeHeight=dialogContent.find(".dialog_content_time").css("height");
	$(".dialog_content_time").css("line-height",dialogContentTimeHeight);
	$(".dialog_content_time").css("font-size",parseInt(dialogContentTimeHeight)*0.5+"px");
	$(".dialog_content_time").css("margin-right",toUserImgMargin+"px");
	
	var dialogContentMsgHeight=dialogContent.find(".dialog_content_msg").css("height");
	$(".dialog_content_msg").css("line-height",dialogContentMsgHeight);
	$(".dialog_content_msg").css("font-size",parseInt(dialogContentMsgHeight)*0.65+"px");
}
 
//2017.08.25  叶夷   通过传入的时间判断之后显示(传入的时间格式为 2017-08-25 16:35:00 转换的效果如  下午4:30)
function showDialogListTime(time){
	var dialogTime;//最后返回的时间
	
	//这是传入的时间
	var splitTime=time.split(" ");//将时间字符串分成年月日和时分秒两部分
	var onePartTime=splitTime[0];//年月日部分
	var twoPartTime=splitTime[1];//时分秒部分
	var hourTime=twoPartTime.split(":")[0];//这是小时
	var minuteTime=twoPartTime.split(":")[1];//这是分钟
	
	//这是今天的时间
	var todayTime = new Date();
	var nowYearTime=todayTime.getFullYear();//这是年份
	var nowMonthTime=todayTime.getMonth()+1;//这是月份，月份是从0开始的
	var nowDayTime=todayTime.getDate();
	
	var betweenDayNumber=daysBetween(onePartTime,nowYearTime+"-"+nowMonthTime+"-"+nowDayTime);//天数差
	
	//进行对比
	//1.先对比是否是今天
	if(betweenDayNumber==0){//是今天
		//2.是上午还是下午
		if(hourTime<12){//上午
			dialogTime="上午 "+hourTime+":"+minuteTime;
		}else{//下午
			dialogTime="下午 "+(hourTime-12)+":"+minuteTime;
		}
	}else if(betweenDayNumber<=7){//一个星期内
		dialogTime=getWeek(new Date(onePartTime));
	}else{//超过一个星期
		dialogTime=onePartTime;
	}
	return dialogTime;
}

//2017.08.25  叶夷    求两个时间的天数差 日期格式为 YYYY-MM-dd 
function daysBetween(DateOne,DateTwo) 
{ 
	var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-')); 
	var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1); 
	var OneYear = DateOne.substring(0,DateOne.indexOf ('-')); 

	var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-')); 
	var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1); 
	var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-')); 

	var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000); 
	return Math.abs(cha); 
} 

//2017.08.25  叶夷 获得星期  传入的data为:  new Date("2017-8-25")
function getWeek(date){
	var week;
	if(date.getDay()==0) week="星期日"
	if(date.getDay()==1) week="星期一"
	if(date.getDay()==2) week="星期二"
	if(date.getDay()==3) week="星期三"
	if(date.getDay()==4) week="星期四"
	if(date.getDay()==5) week="星期五"
	if(date.getDay()==6) week="星期六"
	return week;
}

//未读消息数提示，最新消息内容和最新时间更新
function unreadMsg(user,data,postTimeStr,respondeUserId,unreadNum){
	var unreadParent=$("#"+respondeUserId);
	if (unreadParent.find('.unread').length==0) {//如果没有未读消息,则加上一个1;
		var unreadNumNode = $("<div></div>").attr("class", "unread").text(unreadNum);
		unreadParent.append(unreadNumNode);
		//未读消息的位置
		//头像的位置
		var dialogImg=$(".dialog").find("img");
		var dialogImgWidth=parseInt(dialogImg.css("width"));
		var dialogImgMargin=parseInt(dialogImg.css("margin"));
		
		var unreadLeft=dialogImgWidth+dialogImgMargin;
		unreadNumNode.css("margin-left",unreadLeft+"px");
		//unreadNumNode.css("top",dialogImgMargin/2+"px");
		
		
	} else {//如果已有未读消息,则加上1:
		unreadNum  = unreadParent.find('.unread').text();
		unreadNum++;
		unreadParent.find('.unread').text(unreadNum);
	}
	
	updateDialogContentAndTime(user,data,postTimeStr,respondeUserId);
}

//把聊天列表的内容和时间更新
function updateDialogContentAndTime(user,data,postTimeStr,respondeUserId){
	var unreadParent=$("#"+respondeUserId);
	//内容
	var dialog_content_msg=unreadParent.find(".dialog_content_msg");
	if(user==""){
		dialog_content_msg.text(data);
	}else{
		dialog_content_msg.text(user+"："+data);
	}
	
	//把时间更新
	var dialog_content_time=unreadParent.find(".dialog_content_time");
	dialog_content_time.text(showDialogListTime(postTimeStr));
}

//2017.08.15 叶夷目前首页未读消息提示的显示方案是这样的：
//如果A给我发了3条未读消息，B给我发了2条未读消息，首页显示的是5条未读消息，我打开和A的聊天页面，聊天列表里B的未读提示还存在，不过颜色变暗，首页的未读提示消失
//这里是使聊天列表没打开过有未读提示的聊天页未读提示颜色变暗
function changeUnreadColor(){
	$(".unread").css("opacity","0.7");
}

/**2017.10.16 叶夷  聊天列表消息置顶*/
function makeDialogListTop(respondeUserId){
	var oneDialogDiv=$("#"+respondeUserId);
	var copyOneDialogDiv=oneDialogDiv.clone();
	
	//先将节点从dialog_list删除再放入第一位中
	oneDialogDiv.remove();
	$("#dialog_list").prepend(copyOneDialogDiv);
	
	var toUserName=copyOneDialogDiv.find(".dialog_content_name").text();
	copyOneDialogDiv.click(function() {//绑定点击事件.
		enterDialogPage(respondeUserId,toUserName);
	});
}
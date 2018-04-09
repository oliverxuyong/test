//返回上一页   2016/12/25 deng
function backBtn(){
	//2018.03.09   叶夷   点击回退键将添加群聊框还原，在这里做判断，如果是还原群聊框则仅仅还原，否则是页面会退
	if($(".groupChatAdd2").length>0){//在这里用群聊框回退键是否存在来判断是页面回退还是群聊框还原
		resetGroupChat();
	}else{
		$("#groupChat").unbind();//2018.03.13   叶夷    这里是因为每次打开匹配人列表页的时候，群聊按钮就会重新生成绑定点击事件，所以在这里的时候将点击事件取消
		//退出聊天列表时首页的未读消息数去除
		exec('main_page',"removeUnreadNum()");
		
		//聊天列表未读数去除
		exec('matchUsers_page',"changeUnreadColor()");
		
		openWin('main_page', 'main_page/main_page.html', '');
	}
}

//关闭当前页，返回主界面   2016/12/25 deng
function closeBtn(){
	execRoot("setCurrentPageId('main_page')");
	openWin('main_page', 'main_page/main_page.html', '');
	closeWin('matchUsers_page');
}

function showDialogList(data){
	//将聊天列表的数据放入之前先将存在的数据删除
	var allDialog=$(".dialog");
	for(var i=0;i<allDialog.length;i++){
		allDialog.eq(i).remove();
		//removeDiv(allDialog.eq(i),userAgent[1]);
	}
	
	//将聊天列表的外框的height设置
	var dialogListOut=$("#dialog_list");
	//dialogListOut.css("top",64);
	
	for(var d in data){
		var createTime=data[d].create_time;//最新回复时间
		var ifread=data[d].ifread;//是否有未读
		var msg=data[d].msg;//消息内容
		var toUserId=data[d].to_user_id;
		var toUserImgUrl=data[d].to_user_imgUrl;
		var toUserName=data[d].to_user_name;
		var isTopic=data[d].isTopic;
		appendDialogElement(createTime,ifread,msg,toUserId,toUserImgUrl,toUserName,isTopic);
	}
//	var headerHeight=$("#header").height();
	var tabClick=$(".tabClick");
	var tabClickHeight=tabClick.height();
	var tabClickMarginBottom=parseInt(tabClick.css("margin-bottom"));
	var dialogListOutPaddingTop=parseInt(dialogListOut.css("padding-top"));
	var dialogListOutHeight=$("body").height()-tabClickHeight/*-headerHeight*/-tabClickMarginBottom-dialogListOutPaddingTop;
	dialogListOut.css("height",dialogListOutHeight+"px");
	
	/**2017.11.10  叶夷  将获取未读消息和之前的消息列表内容分隔*/
    setUnreadObjList();
}

function appendDialogElement(createTime,ifread,msg,toUserId,toUserImgUrl,toUserName,isTopic){
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
	
	/*//设置聊天列表的各个大小
	var heightForWindow=$("body").height();
	var dialogHeight=(heightForWindow-63)*0.1;
	dialog.css("height",dialogHeight);*/
	
	//聊天列表动态布局
	setDialogListNode(dialog,dialogContent);
	
	dialog.click(function() {//绑定点击事件.
		enterDialogPage(toUserId,toUserName,toUserImgUrl,isTopic);
	});
}

//聊天列表动态布局
function setDialogListNode(dialog,dialogContent){
	//var dialogHeight=dialog.height()/*parseInt(dialog.css("height"))*/;//获得聊天列表单个的高度
	//var dialogWidth=dialog.width()/*parseInt(dialog.css("width"))*/;//获得聊天列表单个的高度
	//2018.01.08 叶夷  将高和宽固定好数值，避免百分数而产生的变化
	var dialogHeight=$("#dialog_list").height()*0.09;
	var dialogWidth=$(window).width();
	
	//console.log("测试1："+dialogWidth);
	//dialog.css("top",(dialogHeight*d+10));
	//头像css设置
	var toUserImgHeight=dialogWidth*0.087;//图片的高度是聊天列表宽度的0.1026
	var toUserImgMargin=(dialogHeight-toUserImgHeight)/2;
	//console.log("测试3："+toUserImgHeight+" "+dialogHeight);
	var toUserImg=dialog.find("img");
	toUserImg.css("height",toUserImgHeight);
	toUserImg.css("width",toUserImgHeight);
	toUserImg.css("margin-left",toUserImgMargin*2);
	//toUserImg.css("margin-top",toUserImgMargin);
	
	//文字css设置
	var dialogContentWidth=dialogWidth-toUserImgHeight-(toUserImgMargin*5)-2;
	//console.log("测试2："+dialogWidth+" "+toUserImgHeight+" "+toUserImgMargin+" "+dialogContentWidth);
	dialogContent.css("height",dialogWidth*0.1026);
	dialogContent.css("width",dialogContentWidth);
	//dialogContent.css("margin-top",toUserImgMargin);
	dialogContent.css("margin-left",toUserImgMargin);
	
	//dialogContent.css("margin-left",toUserImgMargin/2);
	
	//设置文字内容的line-height
	var dialogContentNameHeight=dialogContent.find(".dialog_content_name").css("height");
	$(".dialog_content_name").css("line-height",(parseInt(dialogContentNameHeight))+"px");
	$(".dialog_content_name").css("font-size",parseInt(dialogContentNameHeight)*0.7+"px");
	
	var dialogContentTimeHeight=dialogContent.find(".dialog_content_time").css("height");
	$(".dialog_content_time").css("line-height",dialogContentTimeHeight);
	$(".dialog_content_time").css("font-size",parseInt(dialogContentTimeHeight)*0.5+"px");
	//$(".dialog_content_time").css("margin-right",toUserImgMargin+"px");
	
	var dialogContentMsgHeight=dialogContent.find(".dialog_content_msg").css("height");
	//$(".dialog_content_msg").css("line-height",dialogContentMsgHeight);
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

/**2017.11.10  叶夷  将获取未读消息和之前的消息列表内容分隔*/
function setUnreadObjList(){
	//从首页传过来的聊天列表的未读信息
	if(unreadObjList.length>0){
		for(var i in unreadObjList){
			unreadMsg(unreadObjList[i].user,unreadObjList[i].imgUrl,unreadObjList[i].data,unreadObjList[i].postTimeStr,unreadObjList[i].touserId,unreadObjList[i].unreadNum);
		}
	}
}

//未读消息数提示，最新消息内容和最新时间更新
function unreadMsg(toUserName,toUserImg,data,postTimeStr,respondeUserId,unreadNum){
	var unreadParent=$("#"+respondeUserId);
	if(unreadParent.length==0){//未读消息更改的同时判断聊天列表中是否有这个人的存在，如果不存在则将它加上且置顶
		unreadParent=makeDialogListTop(toUserName,toUserImg,respondeUserId);
	}
	//2017.12.13  叶夷  对话导航栏
	var dialogListPage=$("li").eq(1);
	
	if (unreadParent.find('.unread').length==0) {//如果没有未读消息,则加上一个1;
		var unreadNumNode = $("<div></div>").attr("class", "unread").text(unreadNum);
		unreadParent.append(unreadNumNode);
		//未读消息的位置
		//头像的位置
		var dialogImg=$(".dialog").find("img");
		var dialogImgWidth=dialogImg.width();
		var dialogImgMargin=parseInt(dialogImg.css("margin-left"));
		
		var unreadNumNodeHeight=unreadNumNode.height();
		var unreadLeft=dialogImgWidth+dialogImgMargin-unreadNumNodeHeight;
		unreadNumNode.css("left",unreadLeft+"px");
		unreadNumNode.css("margin-top",-unreadNumNodeHeight/2+"px");
		
		//2017.12.13  叶夷  在聊天页的导航栏上加上未读消息
		var unreadNumNode = $("<div></div>").attr("class", "unread").text(unreadNum);
		dialogListPage.append(unreadNumNode);
	} else {//如果已有未读消息,则加上1:
		unreadNum  = unreadParent.find('.unread').text();
		unreadNum++;
		unreadParent.find('.unread').text(unreadNum);
		unreadParent.find('.unread').css("opacity","1");
		
		//2017.12.13  叶夷  聊天页的导航栏上的未读消息
		dialogListPage.find('.unread').text(unreadNum);
	}
	
	updateDialogContentAndTime(toUserName,toUserImg,data,postTimeStr,respondeUserId);
}

//把聊天列表的内容和时间更新
function updateDialogContentAndTime(toUserName,toUserImg,data,postTimeStr,respondeUserId){
	var unreadParent=$("#"+respondeUserId);
	//内容
	var dialog_content_msg=unreadParent.find(".dialog_content_msg");
	var msg;
	if(toUserName==""){
		msg=cutStringIfTooLong(data,17);
		dialog_content_msg.text(msg);
	}else{
		msg=cutStringIfTooLong((toUserName+"："+data),17);
		dialog_content_msg.text(msg);
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
function makeDialogListTop(toUserName,toUserImg,respondeUserId,isTopic){
	if($(".dialog").eq(0).length<=0){//这里是判断如果聊天列表为空的情况,重新创建
		var time1 = new Date().format("yyyy-MM-dd hh:mm:ss");
		appendDialogElement(time1,"","默认",respondeUserId,toUserImg,toUserName);
	}else{
		var oneDialogDiv=$("#"+respondeUserId);
		var copyOneDialogDiv;
		if(oneDialogDiv.length<=0){//判断聊天列表中是否有这个人的存在，如果不存在则将它加上且置顶
			copyOneDialogDiv=$(".dialog").eq(0).clone();
			copyOneDialogDiv.attr("id",respondeUserId);
			copyOneDialogDiv.find("img").attr("src",toUserImg);
			copyOneDialogDiv.find(".dialog_content_name").text(toUserName);
			copyOneDialogDiv.find('.unread').remove();
		}else{
			copyOneDialogDiv=oneDialogDiv.clone();
		
			//先将节点从dialog_list删除再放入第一位中
			oneDialogDiv.remove();
			//removeDiv(oneDialogDiv,userAgent[1]);
		}
		$("#dialog_list").prepend(copyOneDialogDiv);
		copyOneDialogDiv.click(function() {//绑定点击事件.
			enterDialogPage(respondeUserId,toUserName,toUserImg,isTopic);
		});
		return copyOneDialogDiv;
	}
}
//时间转换的方法,比如将时间转换为yyyy-MM-dd hh:mm:ss的形式
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}        

/**start:叶夷  2017年3月20日
 * matchUsers_page中的username也必须修改
 */
function updateNickname(newNickname){
	userName = newNickname;
}
/**
 * end:叶夷
 */

//2017.12.13  叶夷  进入聊天页则"对话"上的未读消息去除
function reduceUnread(toUserId){
	var activeUnread=$("li").eq(1).find('.unread');
	if(activeUnread.length>0){
		var toUserIdUnread=$('#' + toUserId).find('.unread')
		unreadNum  = activeUnread.text();
		unreadNum=unreadNum-toUserIdUnread;
		if(unreadNum>0){
			activeUnread.text(unreadNum);
		}else{
			activeUnread.remove();
		}
	}
}

//2017.08.15 叶夷   显示匹配列表详细信息
function showMatchUsers(matchUsers,userid,username,img_src,positiveCommonCps,negativeCommonCps){
	var userimgUrl=img_src;//头像
	var userName=username;//用户名
	
	var matchUser=$("<div></div>").attr("class","matchUser").attr("id","matchUser"+userid);//一个匹配人
	
	//var userimg=$("<div></div>").attr("class","userimg").append("<img src='"+userimgUrl+"'/>");//一个匹配人的头像
	var userimg="<img src="+userimgUrl+" class='userimg' onerror="+"javascript:this.src='"+"http://42.121.136.225:8888/user-pic2.jpg"+"'>";
	
	var matchUserContent=$("<div></div>").attr("class", "matchUser_content");
	
	var usernameDiv=$("<div></div>").attr("class","username").text(userName);//一个匹配人的名字
	matchUserContent.append(usernameDiv);
	
	if(positiveCommonCps.length>0){
		var userPositiveTags=$("<div></div>").attr("class","userTags");//一个匹配人选中的标签
		for(var tag in positiveCommonCps){
			var userTag=$("<div></div>").attr("class","mytag positive").text(positiveCommonCps[tag].cptext);
			userPositiveTags.append(userTag);
			
			var ifHighlight=positiveCommonCps[tag].if_highlight;
			if(ifHighlight=="true"){
				userTag.css("background-color","#FFA07A");
			}
		}
	}
	
	if(negativeCommonCps.length>0){
		var userNegativeTags=$("<div></div>").attr("class","userTags");//一个匹配人选中的标签
		for(var tag in negativeCommonCps){
			var userTag=$("<div></div>").attr("class","mytag negative").text(negativeCommonCps[tag].cptext);
			userNegativeTags.append(userTag);
		}
	}
	
	//一个匹配人的发消息按钮
	var sendMsgButton=$("<div></div>").attr("class","sendMsg").text("发消息");
	sendMsgButton.click(function() {
		enterDialogPage(userid,username,img_src);
	});
	
	var matchUserContentTop=$("<div></div>").attr("class", "matchUser_content_top");
	matchUserContentTop.append(usernameDiv).append(sendMsgButton);
	
	matchUserContent.append(matchUserContentTop).append(userPositiveTags).append(userNegativeTags);
	matchUser.append(userimg).append(matchUserContent);
	matchUsers.append(matchUser);
	
	//聊天列表动态布局
	setMatchUserListNode(matchUser,matchUserContent,matchUserContentTop,userPositiveTags,userNegativeTags,usernameDiv,sendMsgButton);
}

//聊天列表动态布局
function setMatchUserListNode(matchUser,matchUserContent,matchUserContentTop,userPositiveTags,userNegativeTags,usernameDiv,sendMsgButton){
	var matchUserWidth=$(window).width();
	
	//头像css设置
	var userImgHeight=matchUserWidth*0.067;//图片的高度是聊天列表宽度的0.1026
	var userImgMargin=userImgHeight;
	var userimg=matchUser.find("img");
	var userimgMarginRight=parseInt(userimg.css("margin-right"));
	//var userimgPadding=document.getElementById("userimg").style.paddingLeft;
	//console.log("测试："+userimg.css("padding")+" "+userimgPadding)
	userimg.css("height",userImgHeight);
	userimg.css("width",userImgHeight);
	userimg.css("margin-left",userImgMargin);
	//我的标签也加上和img相同的margin-left
	var header=$("#header");
	var headerWidth=matchUserWidth-userImgMargin*3/2;
	header.css("margin-left",userImgMargin);
	header.css("width",headerWidth);
	
	//内容css设置
	var matchUserContentWidth=matchUserWidth-userImgHeight-userimgMarginRight*2-(userImgMargin*2)-2;
	//dialogContent.css("height",dialogWidth*0.1026);
	matchUserContent.css("width",matchUserContentWidth);
	//matchUserContent.css("margin-left",userImgMargin*2/3);
	
	//内容顶部设置
	var matchUserContentTopHeight=userImgHeight/2+userimgMarginRight;
	matchUserContentTop.css("height",matchUserContentTopHeight);
	
	//设置文字内容的line-height
	var usernameDivHeight=usernameDiv.height();
	//usernameDiv.css("line-height",usernameDivHeight+"px");
	usernameDiv.css("font-size",usernameDivHeight*0.9+"px");
	
	//var sendMsgButtonHeight=sendMsgButton.height();
	sendMsgButton.css("height",matchUserContentTopHeight+"px");
	sendMsgButton.css("line-height",matchUserContentTopHeight+"px");
	//sendMsgButton.css("font-size",sendMsgButtonHeight*0.5+"px");
	
}

var myTagIds=new Array();//点击过的我的标签id
var myTagContainerLine=0;//我的标签框标签行数
function addMyCp(cpid,text){
		var header=$("#header");
		header.show();
		var beforeHeaderHeight=header.height();//在我的标签放置之前的标签框的高度
		
		var myTag = $("<div></div>").attr("class", "mytag").attr("id", "mytag"+cpid).text(text);
		//myTag.css("font-size",createSampleMyTag());
		header.append(myTag);
		
		//2018.01.10   叶夷    在放置我的标签的同时计算我的标签框高度，如果有三行高度，固定高度
		var afterHeaderHeight=header.height();//在我的标签放置之前的标签框的高度
		if(beforeHeaderHeight!=afterHeaderHeight){
			++myTagContainerLine;
		}
		if(myTagContainerLine==3){
			header.css("height",afterHeaderHeight);
		}
	
		myTag.click(function(){
			var backGroundColor=rgb2hex(myTag.css("background-color"));
			var myTagId=myTag.attr("id").substring(5,myTag.attr("id").length);
			if(backGroundColor=="#f5f5f5"){//未点击
				myTag.css("background-color","#FFA07A");
				//将点击的标签id存入数组中
				//log2root("点击匹配页我的标签进入1:myTagIds长度为："+myTagIds.length);
				if(myTagIds.length>0){
					var ifExit=true;//数组中id不存在
					for(var i in myTagIds){
						if(myTagIds[i]==myTagId){
							ifExit=false;//数组中id存在
							break;
						}
					}
					if(ifExit){
						myTagIds.push(myTagId);
					}
				}else{
					myTagIds.push(myTagId);
				}
				//log2root("点击匹配页我的标签进入2:myTagIds长度为："+myTagIds.length);
			}else{//点击了
				myTag.css("background-color","#f5f5f5");
				//去除取消的标签id
				myTagIds.splice($.inArray(myTagId,myTagIds),1);
			}
			//log2root("点击匹配页我的标签进入requestUserCpMatchUsers");
			requestUserCpMatchUsers();
		});
		
		/*var myTagHeight=myTag.height();
		$("#goback").css("height",myTagHeight);*/
}

//2017.12.27  叶夷   标签的文字的大小
function createSampleMyTag(){//用于模拟mytag的实际高度.
	var mytagTextSize=$("#header").width()/32;
	if(mytagTextSize>15){
		mytagTextSize=15;
	}else if(mytagTextSize<11){
		mytagTextSize=11;
	}
	return mytagTextSize;
}
//2017.12.28  叶夷  将颜色值rgb转换为#xxx
function rgb2hex(rgb) {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	function hex(x) {
	return ("0" + parseInt(x).toString(16)).slice(-2);
	}
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

var groupOldChatWidth;//这是添加群聊框变化之前的width
var inputGroupChatWidth;//这是添加群聊输入框变长之前的width;
//2018.03.09 叶夷    点击出现发起群聊话题输入框
function showGroupSearchInput(){
	//先保存添加群聊的按钮的高度，为了之后的还原
	var groupChat=document.getElementById("groupChat");
	groupOldChatWidth=groupChat.offsetWidth;
	//先将通过关注点筛选文字隐藏
	var titleText=document.getElementById("titleText");
	titleText.style.display="none";
	//将加号图片更改放在右边,class更改成groupChatAdd2
	var groupChatAdd=document.getElementById("groupChatAdd");
	groupChatAdd.setAttribute("class", "groupChatAdd2");
	groupChatAdd.src="../image/groupChatReturn.png";
	//将输入框更改放在左边,class更改成inputGroupChat2
	var inputGroupChat=document.getElementById("inputGroupChat");
	inputGroupChat.setAttribute("class", "inputGroupChat2");
	$("#inputGroupChat").val("发起限时群话题...");
	//输入框拉长动画
	var titleWidth=document.getElementById("title").offsetWidth;
	$("#groupChat").animate({
		width:titleWidth
	},500,function(){
		//动画结束后input可以输入且宽度加长，加号图片替换成回车图片
		inputGroupChat.disabled="";//有效
		var groupChatGrowWidth=titleWidth-groupOldChatWidth;//整个添加群聊框增长的width，input也增长这么多
		var inputNewGroupChatWidth=groupChatGrowWidth+inputGroupChatWidth-17-12-5;
		$("#inputGroupChat").css("width",inputNewGroupChatWidth);
		//inputGroupChat.offsetWidth=inputNewGroupChatWidth;//input宽度加长
		
		//取消变长输入框的点击事件
		$("#groupChat").unbind();
		
		//2018.03.09  叶夷    有人点击发起群聊话题则将数据返回给后台
		$("#groupChatAdd").click(function(){
			//alert("测试1："+window.event.srcElement.tagName);
			sendGroupChatInfo();//发送给后台
			resetGroupChat();
			toast("功能开发中，敬请期待");
			return false;// 阻止事件冒泡和默认操作
		});
		//log2root("inputGroupChat变化后的高度："+$("#inputGroupChat").height());
	});
}

/**2018.03.09   叶夷   点击回退键将添加群聊框还原
 * */
function resetGroupChat(){
	$("#inputGroupChat").val("群话题");
	//将添加群聊标签框还原
	var groupChatAdd=document.getElementById("groupChatAdd");
	groupChatAdd.setAttribute("class", "groupChatAdd");
	var inputGroupChat=document.getElementById("inputGroupChat");
	inputGroupChat.setAttribute("class", "inputGroupChat");
	$("#groupChat").css("width",groupOldChatWidth);
	inputGroupChat.disabled="disableb";//无效
	$("#inputGroupChat").css("width",inputGroupChatWidth);
	groupChatAdd.src="../image/groupChatAdd.png";
		
	var titleText=$("#titleText");
	titleText.show();
	
	//2018.03.09   调整发起群聊话题按钮的位置
	var groupChat=$("#groupChat");
	groupChat.css("width",groupOldChatWidth);
	groupChat.click(function(){
		//alert("测试2："+window.event.srcElement.tagName);
		showGroupSearchInput();
	});
}

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
	var userimgPadding=parseInt(userimg.css("padding"));
	userimg.css("height",userImgHeight);
	userimg.css("width",userImgHeight);
	userimg.css("margin-left",userImgMargin);
	//我的标签也加上和img相同的margin-left
	var header=$("#header");
	var headerWidth=matchUserWidth-userImgMargin*3/2;
	header.css("margin-left",userImgMargin);
	header.css("width",headerWidth);
	
	//内容css设置
	var matchUserContentWidth=matchUserWidth-userImgHeight-userimgPadding*2-(userImgMargin*2)-2;
	//dialogContent.css("height",dialogWidth*0.1026);
	matchUserContent.css("width",matchUserContentWidth);
	//matchUserContent.css("margin-left",userImgMargin*2/3);
	
	//内容顶部设置
	var matchUserContentTopHeight=userImgHeight/2+userimgPadding;
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
function addMyCp(cpid,text){
		var header=$("#header");
		var myTag = $("<div></div>").attr("class", "mytag").attr("id", "mytag"+cpid).text(text);
		//myTag.css("font-size",createSampleMyTag());
		header.append(myTag);
	
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
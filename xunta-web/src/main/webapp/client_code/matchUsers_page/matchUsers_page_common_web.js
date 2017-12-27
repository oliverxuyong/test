//2017.08.15 叶夷   显示匹配列表详细信息
function showMatchUsers(matchUsers,userid,username,img_src,positiveCommonCps,negativeCommonCps){
	var userimgUrl=img_src;//头像
	var userName=username;//用户名
	
	var matchUser=$("<div></div>").attr("class","matchUser").attr("id","matchUser"+userid);//一个匹配人
	
	var userimg=$("<div></div>").attr("class","userimg").append("<img src='"+userimgUrl+"'/>");//一个匹配人的头像
	var usernameDiv=$("<div></div>").attr("class","username").text(userName);//一个匹配人的名字
	userimg.append(usernameDiv);
	
	if(positiveCommonCps.length>0){
		var userPositiveTags=$("<div></div>").attr("class","userTags");//一个匹配人选中的标签
		for(var tag in positiveCommonCps){
			var userTag=$("<div></div>").attr("class","userTag positive").text(positiveCommonCps[tag].cptext);
			userPositiveTags.append(userTag);
		}
	}
	
	if(negativeCommonCps.length>0){
		var userNegativeTags=$("<div></div>").attr("class","userTags");//一个匹配人选中的标签
		for(var tag in negativeCommonCps){
			var userTag=$("<div></div>").attr("class","userTag negative").text(negativeCommonCps[tag].cptext);
			userNegativeTags.append(userTag);
		}
	}
	
	//一个匹配人的发消息按钮
	var sendMsgButton=$("<div></div>").attr("class","sendMsg").text("发消息");
	sendMsgButton.click(function() {
		enterDialogPage(userid,username,img_src);
	});
	
	matchUser.append(userimg).append(userPositiveTags).append(userNegativeTags).append(sendMsgButton);
	matchUsers.append(matchUser);
}

var myTagIds=new Array();//点击过的我的标签id
function addMyCp(cpid,text){
		var header=$("#header");
		var myTag = $("<div></div>").attr("class", "mytag").attr("id", "mytag"+cpid).text(text);
		myTag.css("font-size",createSampleMyTag());
		header.append(myTag);
	
		myTag.click(function(){
			var backGroundColor=myTag.css("background-color");
			var myTagId=myTag.attr("id").substring(5,myTag.attr("id").length);
			if(backGroundColor=="rgba(66, 66, 66, 0.9)"){//未点击
				myTag.css("background-color","#FFA07A");
				//将点击的标签id存入数组中
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
				
			}else{//点击了
				myTag.css("background-color","rgba(66, 66, 66, 0.9)");
				//去除取消的标签id
				myTagIds.splice($.inArray(myTagId,myTagIds),1);
			}
			
			requestUserCpMatchUsers();
		});
		
		var myTagHeight=myTag.height();
		$("#goback").css("height",myTagHeight);
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
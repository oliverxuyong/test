var replySenderName = 'null'//记录点击内容回复消息时被点击用户昵称，解决用户自行删掉昵称后发言仍然会发送给指定的人

		//客户端发出的消息先显示在屏幕上   9.15 FANG
		function showSelfPoster(content, senderTopicId, msgId) {//用户发言后先直接上屏并添加发送状态，然后等待服务器返回确认后修改其消息状态
			console.log(" showSelfPoster 发言上屏了.");
			var content, senderId, senderName, dialog_box, senderName_P, content_P, senderImg, senderImg_Div, senderDiv;
			var sender_topicid;
			senderId = userId;
			content = content;
			senderName = userName;
			if(senderName.length >10){//检查昵称长度是否大于7个字符，如果大于就阶段
				senderName = senderName.substring(0, 10) + '…';
			}
			
			senderImage = userImage;
			sender_topicid = senderTopicId;
			dialog_box = $("#dialog_box");
			senderName_P = $("<div class='nc'></div>").text(senderName);
			//content_P = $("<p class='detail'></p>").attr("sender_topicid", sender_topicid).attr("senderId", senderId).attr("senderName", senderName).text(content);
			content_P = $("<div class='detail'></div>").text(content);//上面一句简化为这一句.那些属性目前没有用处.
			var postsending = $("<img class='postsending' src='image/jumpingbean.gif'/>");
			content_P.append(postsending);
			//console.log("showSelfPoster userImage:"+userImage);
			//senderImg = $("<img />").attr("src", userImage).attr("id", senderId).attr("sender_topicid", sender_topicid).attr("senderId", senderId);
			senderImg = $("<img />").attr("src", userImage);////上面一句简化为这一句.那些属性目前没有用处.
			senderImg_Div = $("<div class='user-pic'></div>").append(senderImg);
			senderDiv = $("<div class='user my'></div>").attr("id", msgId);
			senderDiv.append(senderName_P).append(content_P).append(senderImg_Div);
			$("#msg_list").append(senderDiv);
			setTimeout(function() {//将聊天框里的消息落底 - 8.12
				document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
			}, 200);
		}



		function afterCheckedSendPosterSuccess(tmpPid, SendPosterSuccess) {//一般发言,新创话题,移动新建的延时检查处理都用这个方法.
			if (SendPosterSuccess) {
                alert(SendPosterSuccess)
				console.log("afterCheckedSendPosterSuccess 成功了,不作为");
			} else {//取消跳豆,加上感叹号,并绑定点击再请求的事件:
				console.log("afterCheckedSendPosterSuccess 失败, 取消跳豆,加上感叹号.");
				var thePosterElement = $("#dialog_box").find("#" + tmpPid);
				thePosterElement.find(".postsending").attr('src', "image/acclaim-50x173.png");
				thePosterElement.click(function() {
					var thePosterElementObj = $("#dialog_box").find("#" + tmpPid);
					thePosterElementObj.find(".postsending").attr('src', 'image/jumpingbean.gif');
					afterInput(thePosterElement.find(".detail").text(), tmpPid, 'after');
					//发言再次发送后, 后台要判断一下tmpPid是否已经发过了,如果有,,则返回原来的topicid和内容.否则会重复.
					thePosterElement.unbind('click');
				});
			}
		}
		
		/*
		function againSend(thePosterElementObj){
			//alert("点击了!");
			var thePosterElement = $("#dialog_box").find("#" + tmpPid);
			thePosterElement.find(".postsending").attr('src', 'image/jumpingbean.gif');
			
//			thePosterElementObj.find(".postsending").attr('src', 'image/jumpingbean.gif');
//			afterInput(thePosterElement.find(".detail").text(), tmpPid, 'after');
//			//发言再次发送后, 后台要判断一下tmpPid是否已经发过了,如果有,,则返回原来的topicid和内容.否则会重复.
//			thePosterElement.unbind('click');
			//点击后马上取消这个事件绑定.
		}*/

		/**
		 *	服务器返回来的消息发送请求成功，替换掉临时的消息ID，并添加时间（并判断是否显示时间），由于是自己的消息则不需要添加事件 //修改发言时间,取消跳豆.
		 *  */
		function markSendPosterSuccess(tmpPid,pid,postTimelong,postTimeStr) {//接受服务器收到消息的确认的方法 //msg是作为服务器返回的字符串传过来的,但是js好象是自动识别为json了.
			console.log("afterSendPosterSuccess 消息成功了, 取消跳豆, 修改发言时间,第一条发言开关取消.tmpPid="+tmpPid);
			var element = $("#"+tmpPid);//服务端发送消息请求成功状态后，客户端接下来要做的事情  9.15 FANG
			//取消黑色跳豆
			//console.log("这里有时候是undefined, 要查一下. element:"+element.html()); 
			element.find(".detail .postsending").remove();
//			element.find(".detail .postsendingfailed").remove();
			//将服务器返回的消息ID替换掉临时生成的消息ID
			element.attr("id", pid);
			//添加时间字段
//			dialog_box = $("#dialog_box");
			var postTimeLongMinute = postTimelong / 1000 / 60;
			var intervalEnough = ((postTimeLongMinute - 2) > (lastPostTimeLongMinute)) || ((postTimeLongMinute + 2) < (lastPostTimeLongMinute))
			if ((lastPostTimeLongMinute == 0) || intervalEnough) {//彬彬: 时间码是否显示的判断. //不论是滞后2分钟还是超前2分钟,都显示出.针对消息晚到的情况.xu
				postTimeHtml = $("<time class='send-time'></time>").text(postTimeStr);
				element.before(postTimeHtml);
			}
			lastPostTimeLongMinute = postTimeLongMinute;
		}
		
		function showWhoistalking (eventdata){//?0129 web版中新增的方法,需同步到App中. xu
		console.log("收到whoistalking信息:");
		console.log(eventdata.my_tid);//my_tid:接收消息用户的话题id. 用于寻找话题页面. 到这里就用不到了.
        console.log(eventdata.your_tid);//your_tid:关注对象的tid,用于寻找该tid下的最新发言.然后将his的头像显示在这个发言的右边.
        console.log(eventdata.his_tid);//his_tid:未接接人的话题id,存为头像元素的属性值.用户点击并连接时要用到.
        console.log(eventdata.his_nickname);//his_nickname:未连接人的昵称.用于用户点击头像时，在对话框中显示这个头像的昵称，提示用户要不要和他对接。
        console.log(eventdata.his_image);//his_image:未连接人的头像url
        console.log(eventdata.his_uid);//his_uid:未连接人的头像id.这个参数备用，可用于访问他的个人主页.
		//寻找your_tid的最新发言, 找不到就放弃.
		//在它的最新发言的元素区里放入his的头像,并以属性值存放nickname和uid. 同时用onclick绑上一个响应方法link2mytopic(,,),附在下面了.
		//如果已经有三个头像了,就不再放入.只需在后面加上... .
		//用户点击某个头像后,出一个对话框,显示: his_nickname正在和"your的昵称"对话. 是否接入his_nickname的话题[his_topictitle].
		//用户点击确认,则用link2mytopic接口发出请求.
		}

		function link2mytopic(topicid_belinked,topictitle_belinked){
		//用户点击某个whoistalking头像后,出一个对话框,显示: his_nickname正在和"your的昵称"对话. 是否接入his_nickname的话题[his_topictitle].
		//用户点击确认,则用link2mytopic接口发出请求.
		
			//alert("进入了link2mytopic()方法.");//这块改成确认.可以取消.
			api.confirm({
				msg : "将当前话题连接Ta的"+topictitle_belinked+" ?",//his_nickname正在和"your的昵称"对话. 是否接入his_nickname的话题[his_topictitle].
				buttons : ['确定', '取消'],
			}, function(ret, err) {
				if (ret.buttonIndex == 1) {
					var script = "link2mytopic('"+ topicid_belinked + "','" + topicId +"')";
					execRoot(script);
				}
			});
			console.log("要连接的topicid:="+topicid_belinked);
		}
		

		function showAllPosters(msg){
			var msgArr = msg.msg_arr;
			var j, content, senderId, senderName, userImage, dialog_box, senderName_P, content_P, senderImg, senderImg_Div, senderDiv;
			var postTimeHtml, postTimeStr, postTimeLongMinute, sender_topicid,topic_title,msgid;
			//为了时间码的显示. 彬彬. 8.13
			if(msgArr[0] == undefined){
				return;
			}
			var msgSort = msgArr[0].sort;
			if(msgSort == 'asc'){//如果返回来的消息是升序，则获取第一条。
				firstMsgId = msgArr[0].msg_id;
			}else if(msgSort == 'desc'){//如果返回来的消息是降序，则获取最后一条
				var lastIndex = msgArr.length-1;
				firstMsgId = msgArr[lastIndex].msg_id;
			}
			for (j in msgArr) {
				topic_title = msgArr[j].sender_userinfo.topic_content;
				//console.log("topic_title=" + topic_title);
				senderId = msgArr[j].sender_userinfo.userid;
				content = msgArr[j].content;
				senderName = msgArr[j].sender_userinfo.name;
				userImage = msgArr[j].sender_userinfo.image_url;
				postTimeStr = msgArr[j].msg_create_datetime_str;
				msgid = msgArr[j].msg_id;
				//console.log(postTimeStr);
				if(senderName.length >10){//检查昵称长度是否大于7个字符，如果大于就阶段
					senderName = senderName.substring(0, 10)+ '…';
				}
				if(topic_title.length >10){//检查发送人来自话题的话题字符长度，如果大于7就要省略掉后面的
					topic_title = topic_title.substring(0, 10)+ '…';
				}
				//public_topic = msgArr[j].public_topic;
				//时间码字符型.
				postTimeLongMinute = msgArr[j].msg_create_datetime_long / 1000 / 60;
				//直接算出分钟数.xu
				//时间码转换为long
				sender_topicid = msgArr[j].sender_userinfo.sender_topicid;
				dialog_box = $("#dialog_box");
				// 这个定位可以写在循环外面  - 8.12
				//你没定义这个变量,我临时加上了. xu8.24

				//msg_type: 0-直接发言;1-推荐的他人新创话题;2-系统通知;3-被其他用户直接回复 的消息;4-新窗成功后的系统通知. xu 2015.11.11
				
//				if ((msgArr[j].msg_type == '0'|| msgArr[j].msg_type == '1'||msgArr[j].msg_type == '1'|| msgArr[j].msg_type == '3' || msgArr[j].msg_type == '5') & senderId != userId) {//如果该消息是聊天消息则加上来自Ta的xxx话题2
//					senderName = senderName + " [" + topic_title + "]";	//临时写的，用来记录后台传过来的话题名字
//				}
				
				if(topic_title != -1){
					senderName = senderName + " [" + topic_title + "]";	//临时写的，用来记录后台传过来的话题名字
				}
				
				//console.log("senderName=" + senderName);
				senderName_P = $("<div class='nc'></div>").text(senderName);
				content_P = $("<div class='detail'></div>").attr('id',senderId).attr("sender_topicid", sender_topicid).attr("senderName", senderName).attr("senderMsgId",msgid).text(content);
				//console.log("showdialoghistory senderimg: "+userImage);
				senderImg = $("<img />").attr("src", userImage).attr("id", senderId).attr("sender_topicid", sender_topicid).attr("senderId", senderId).attr("senderName", senderName).attr("senderImg",userImage).attr("senderMsgId",msgid).attr("senderContent",content);
				//头像img元素.//上面这些属性值是不必要的,可以统一放到父元素上.待修改.xu 11.11
				
				console.log(content+"|消息类型:"+msgArr[j].msg_type);
				
				
				//原来的判断语句:if ((msgArr[j].msg_type == '0'|| msgArr[j].msg_type == '1'|| msgArr[j].msg_type == '3'|| msgArr[j].msg_type == '5') & sender_topicid != topicId) {//这个判断与上一个是重复的, 但因为变量的循环依赖,不得不拆成两个.
				if (sender_topicid != -1 && sender_topicid != topicId) {//在不是管理员头像通知,或非本人发言时:
					senderImg.click(function() {
						removeUserOrCreatTopic(this);//这个地方传this的父级元素, 这样img本身不需要那么多属性值了.//对于类型5,
					});
				}
				
				//原来的判断语句:if ((msgArr[j].msg_type == '0'|| msgArr[j].msg_type == '3') & senderId != userId) {////这个判断与上一个是重复的, 但因为变量的循环依赖,不得不拆成两个.
				if (sender_topicid != -1 && sender_topicid != topicId && msgArr[j].msg_type != '1') {////这个判断与上一个是重复的, 但因为变量的循环依赖,不得不拆成两个.
					content_P.click(function() {
						replyCurrentContent(this);
					});
				}

				if (msgArr[j].msg_type == '1'){//推荐类型的消息.
					content_P.text("(推荐)"+content);
					content_P.attr("class","detail recommend");//将内容元素加上recommend推荐值,让css为它加上一个边线.
					var plusLogoImg = $("<img class='plus-logo' src='image/plus-20x20.png' />");
					content_P.append(plusLogoImg); //append一个加号元素.
					content_P.click(
						function(){
							askIfLink2CurrentTopic($(this));//弹出确认是否与当前话题连接的对话框.//不知这个content_p能不能作为当前元素的参数?
							//askIfLink2CurrentTopic(this.parent());//弹出确认是否与当前话题连接的对话框.												
						}
					);
				}
				
				if (msgArr[j].msg_type == '5'){//已接受过的推荐类型消息.
					content_P.text("(推荐已接受)"+content);
					content_P.attr("class","detail recommend");//将内容元素加上recommend推荐值,让css为它加上一个边线.
					var plusLogoImg = $("<img class='plus-logo' src='image/yes-20x20.png' />");//换成对号.
					content_P.append(plusLogoImg); //append一个加号元素.
				}				

				senderImg_Div = $("<div class='user-pic'></div>").append(senderImg);
				//if (userId == senderId) {//他人消息靠左,自己消息靠右.
				if (topicId == sender_topicid) {//应该用topicid来判断是他人还是自己的发言.消息靠左,自己消息靠右.因为自己的话题也可以是互连的.xu 11.17
					senderDiv = $("<div class='user my'></div>").append(senderName_P).append(content_P).append(senderImg_Div);
				} else {
					senderDiv = $("<div class='user other'></div>").append(senderName_P).append(content_P).append(senderImg_Div);
				}
				
				var intervalEnough = ((postTimeLongMinute - 2) > (lastPostTimeLongMinute)) || ((postTimeLongMinute + 2) < (lastPostTimeLongMinute))
				if(msgArr[j].sort == 'asc'){
					if ((lastPostTimeLongMinute == 0) || intervalEnough) {//彬彬: 时间码是否显示的判断. //不论是滞后2分钟还是超前2分钟,都显示出.针对消息晚到的情况.xu
						postTimeHtml = $("<time class='send-time'></time>").text(postTimeStr);
						$("#msg_list").append(postTimeHtml);
					}
					$("#msg_list").append(senderDiv);
				}else if(msgArr[j].sort == 'desc'){
					var lastIndex = msgArr.length-1;
					$("#msg_list").prepend(senderDiv);
					if(j == lastIndex || (lastPostTimeLongMinute == 0 || intervalEnough)){
						postTimeHtml = $("<time class='send-time'></time>").text(postTimeStr);
						$("#msg_list").prepend(postTimeHtml);
					}
				}else{
					if (lastPostTimeLongMinute == 0 || intervalEnough) {//彬彬: 时间码是否显示的判断. //不论是滞后2分钟还是超前2分钟,都显示出.针对消息晚到的情况.xu
						postTimeHtml = $("<time class='send-time'></time>").text(postTimeStr);
						$("#msg_list").append(postTimeHtml);
					}
					$("#msg_list").append(senderDiv);
				}
				lastPostTimeLongMinute = postTimeLongMinute;
			}
			//if (j == undefined) {
			//	j = -1;
			//}
			//$("#notification").text('收到' + (parseInt(j) + 1) + '条发言消息.');
			if(msgArr[j].sort != 'desc'){
				setTimeout(function() {//将聊天框里的消息落底 - 8.12
					document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
				}, 200);
			}

}

		function askIfLink2CurrentTopic(currentE){
			var topicid_belinked = currentE.attr("sender_topicid");
			var topictitle_belinked = currentE.parent().find(".nc").text();
			var recommended_pid = currentE.attr("senderMsgId");
			api.confirm({
				msg : '将 '+topictitle_belinked+' 接入当前话题?',
				buttons : ['确定', '取消'],
			}, function(ret, err) {
				if (ret.buttonIndex == 1) {
					var script = "link2mytopic_byrecommend('"+ topicid_belinked + "','" + topicId + "','" + recommended_pid +"')";
					execRoot(script);
				}
			});
		}

		function showDialogHistory(msg) {//提供给如系统通知管理员等帐号直接将消息上屏的方法??? //显示聊天历史记录.
            var msgJson = JSON.parse(msg)
			$("#loadingwrap").click(function(evt) {//填加再次请求的点击事件:
				loadPostHist(userId, topicId, firstMsgId, 'desc');
				$("#loadingwrap").unbind('click');//点击后马上取消这个事件绑定.
			});
			var length = msgJson.msg_arr.length;
			if(length < 20){
				showAllPosters(msgJson);
				$("#loading img").attr("src", "image/threedotmoving.jpg");
				$("#loadingtext").text("无更多消息");
				$("#loadingwrap").unbind('click');//点击后马上取消这个事件绑定.
			}else{
				showAllPosters(msgJson);
				$("#loading img").attr("src", "image/threedotmoving.jpg");
				$("#loadingtext").text("查看更多消息");
			}
		}

		
		function replyCurrentContent(obj) {//点击内容进行针对性回复 FANG 10.12
//			var s_id = $(obj).attr("id");
		//	if(s_id == '1' || s_id == '2' || s_id == '4' || s_id == userId){//这些1/2/4值是指什么? xu 11.11//在showallposter中,调用前已加了判断,这里可以去掉了. xu 11.11
		//		return;
		//	}
			var sender_topicid = $(obj).attr("sender_topicid");//获取回复指定人的话题ID
			var sender_name = $(obj).attr("senderName");//获取回复指定人的名字
//			var sender_uid = $(obj).attr("senderId");//获取回复指定人的用户ID，目前没有用，因为话题ID就能指向指定人接受的话题
			//因发送人名字和来自话题是通过字符串拼接的，但回复的时候只显示发送人名字，所以要拆分
			var targetIndex = sender_name.indexOf("[");
			var senderName;
			if(targetIndex == -1){
				return;
			}else{
				senderName = sender_name.substring(0,targetIndex);
			}
			//获取输入框对象
			var elementInputBox = document.getElementById("inputbox");
			elementInputBox.focus();//保持焦点,防止键盘收起.
			elementInputBox.value = '@'+senderName+': ';
			replySenderName = '@'+senderName+': ';
			replyTopic = sender_topicid;
		}


/*
		function insertRemoveUserInfo(msg) {//显示一条成功移除本群的对话消息.
//			alert(JSON.stringify(msg));
			//			var removeUserInfo = msg.data;
			var removeUserName = msg.block_user_info.name;
			//$("#notification").text('踢出某人的请求,服务器已返回确认消息:' + removeUserName);
			var dialog_node = $("#dialog_box");
			var removeUserInfoElement = $("<div></div>").text('已将 ' + removeUserName + ' 移除本群');
			dialog_node.append(removeUserInfoElement);
		}
*/
		function removeUserOrCreatTopic(obj) {
//			var s_id = $(obj).attr("senderId");
	//		if(s_id == '1' || s_id == '2' || s_id == '4' || s_id == userId){//在showallposter中,调用前已加了判断,这里可以去掉了. xu 11.11
	//			return;
	//		}
			var currentTopicId;
			if (topicId == 'null') {
				//表示该话题不是创建话题页
				currentTopicId = tmpTopicId;
			} else {
				currentTopicId = topicId;
			}
			api.confirm({
				msg : '屏蔽或新窗',
				buttons : ['屏蔽', '新窗', '取消']
			}, function(ret, err) {
				if (ret.buttonIndex == 1) {
					execRoot("removeUserByTopic('" + currentTopicId + "'," + "'" + $(obj).attr("id") + "'," + "'" + $(obj).attr('sender_topicid') + "')");
					//在websocket.js中. 该方法可以移到本页中?
				} else if (ret.buttonIndex == 2) {
					console.log('确认为打开新窗...');
					if (topicId == 'null') {//打开新页面后,该页面如果是临时的,则不会再进来了.所以要把临时id删除. 原来是不等号,此处还要测试!
						//这句的参数应该是tmptopicid. xu10.25 execRoot("removeTmpTopicId('" + topicId + "')");
						var script = "removeTmpTopicId('" + tmpTopicId + "')";
						execRoot(script);
					}
					//console.log("$(obj).attr(senderId) = "+$(obj).attr("senderId"));
					//还要把from的topicid的名称带过来.
					var from_topictitle = "被移动的话题";
					enterDialogPage_MoveToNewTopic(userName,userImage,currentTopicId,$(obj).attr("sender_topicid"),$(obj).attr("senderId"),userId,from_topictitle,$(obj).attr("senderName"),$(obj).attr("senderImg"),$(obj).attr("senderContent"));
					//execRoot(scriptString);
					//从列表页打开新页面? 可以从本地打开吧? 为了降低本页代码量,这样也可以.
					console.log('从列表页执行代码, 打开新窗.');
				}
			});
		}
		
		
		
		//点击他人内容创建新话题 供聊天页跨页执行,是为了实现reload的目的.
		//不限制在一个页面上创建新窗后, reload不需要了, 这个方法可以移动对话页上. xu9.17
		function enterDialogPage_MoveToNewTopic(userName,userImg,current_topic_id, from_topicid, senderId, userId, from_topictitle, from_senderName, from_senderImg, from_senderContent) {
			var tmpTopicId = new Date().getTime();//用于生成一个新话题的临时唯一ID  9.16 FANG
			console.log('打开新页面 enterDialogPage_MoveToNewTopic from_topicid=' + from_topicid+"|tmpTopicId="+tmpTopicId+"|senderid="+senderId);
			
			var userInfo = {
				"topicid" : 'none',
				"tmptopicid" : tmpTopicId,
				"userid" : userId,
				"title" : '输入第一句,开始新窗对话...',
				"userName" : userName,
				"userImage" : userImg,
				"current_topic_id" : current_topic_id,
				"from_topicid" : from_topicid,
				"from_senderId" : senderId,
				"from_topictitle" : from_topictitle,
				"from_senderName" : from_senderName,
				"from_senderImg" : from_senderImg,
				"from_senderContent" : from_senderContent,
				"server_domain" : domain
			};
			openWin(tmpTopicId, 'dialog_page_movetonewtopic.html', userInfo);
			exec("topics_page","setCurrentOpenDialogPageId('"+tmpTopicId+"')");//xu加上的.11.27//返回页面时要初始化话题列表页面的currentOpenDialogPageId变量,如果不初始化在回退到话题列表页时在没进入下一个聊天页面时，这时的消息如果发送到这里都会被认为已读，但实质上用户已经到了话题列表页 FANG 10.12

}

		function justClick(which) {//制造一个空事件,以便在苹果上收起键盘.
			$("#notification").text(which);
		}

		function showMoreToDo() {
			$("#moretodobox").show();
			setTimeout(function() {
				$("#moretodobox").hide()
			}, 4000);
		}
		
		function getSetupInfo(){
		console.log("getSetupInfo() - topicId="+topicId);
            execRoot("getSetupInfo('"+topicId+"')");
			//var script = "getSetupInfo('"+topicId+"')";
			//execRoot(script);
		}
				
		function showSetupBox(evntdata){

			//alert("显示设置框.");
			//先获得服务器数据,然后显示是否check.
			$("#moretodobox").hide();
			console.log(evntdata.private +"|"+evntdata.suspend);
			
			$("#private_topic")[0].checked = false;
			if (evntdata.private == "true"){$("#private_topic")[0].checked = true}
			$("#topic_suspended")[0].checked = false;
			if (evntdata.suspend == "true"){$("#topic_suspended")[0].checked = true} 
			
			console.log("showSetupBox:"+$("#private_topic")[0].checked+ "|"+$("#topic_suspended")[0].checked);
			
			
			$("#setupbox").show();

			/*
			var arrayTitle = new Array();
			arrayTitle[0]='免受打扰';
			arrayTitle[1]='暂停使用';
			var obj = api.require('multiSelector');
			console.log("obj:"+obj);
			obj.open({
         		content:arrayTitle
     		},function(ret,err){
         		var selectObj=":";
         		for (var index in ret.selectAry)
         		{
             		selectObj = selectObj + ret.selectAry[index];
         		}
         		api.alert({msg:'选择器选取的数据是'+ selectObj});
 			});*/
			
		}
		
		function submitSetup(){
			var boolean_private = false
			var suspend = false; 
			
			if ($("#private_topic")[0].checked){
				boolean_private = true;
				//alert("选择了屏蔽.");
			}
			if ($("#topic_suspended")[0].checked){
				suspend = true; 
				//alert("选择了暂停.");
			}
		
			//console.log("私有:"+$("#private_topic").attr("checked"));
			//console.log("暂停:"+$("#topic_suspended").attr("checked"))
		
			
			var script = "setSetupInfo('"+topicId+"','"+boolean_private+"','"+suspend+"')";
			execRoot(script);
		
			$("#setupbox").hide();
		}
		
		function cancelSetup(){
			$("#setupbox").hide();
			/* 这个用于解决按取消时,滑动失效的问题.
			setTimeout(
				function(){
					$("#setupbox").hide();
				},300
			)*/
		}
		
		function enter_searchpage(){
            //1.13 FANG
			console.log("进入搜索他人话题页面");
			//var elementInputBox = document.getElementById("inputbox");
			//elementInputBox.blur();//先收起键盘,防止进入搜索页时有一片空白.
            var userInfo = {
                "topicid" : topicId,
                "userid" : userId,
                "title" : title,
                "search_word" : title
            };
            openWin("search_page", "search_page.html", userInfo);
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
		
		function request_mytopiclist(page){
		//alert("请求将该话题并入您的另一个话题? 第"+page+"页|每页:"+num_eachpage+"条|currenttopicid:"+current_topicid);
		var currentTopicId = topicId;
		if (topicId == "none"){currentTopicId = tmpTopicId} //针对在新窗页中未成功创建时点击直接接入按钮.
		console.log("request_mytopiclist()-"+topicId+"|"+tmpTopicId);
		var script = "request_mytopiclist('"+page+"','"+currentTopicId+"')";
		execRoot(script);
		}
		
		function showMyTopicList(evntdata){
			var topics = evntdata.topics; 
			var topic,mytopicE,clickfunction;
			var elib = $("#e-lib").clone();
			var mytopiclistframe = elib.find("#frame");
			mytopiclistframe.find(".user-pic img").attr("src","http://"+domain+"/xunta-web/assets/images/xun.jpg");
			//mytopiclistframe.find(".detail").text("请点击选择接入...");
			var mytopiclistE = elib.find(".mytopiclist"); 
			var page = mytopiclistE.attr("page");
			console.log("页:"+page);
			//page = 1;
			//mytopiclistE.attr("page",page);
			mytopicE = $("#e-lib .mytopic").clone();
			var rankNo;
			for (var i in topics){
				topic = topics[i]; 	
				console.log(topic.topicid +"|"+topic.topic_title);
				mytopicE = $("#e-lib .mytopic").clone();
				//mytopicE.attr("topicid",topic.topicid);
				rankNo = (page-1)*10+(i-0+1);
				console.log("rankno:"+rankNo);
				mytopicE.text(rankNo+". "+topic.topic_title);
				if (topic.topicid == topicId || topic.linked == "yes"){//前一个判断用于一般情况下的并入,当前话题不可点击;后一个针对新窗直接移动,如果已经连接,不可点击.xu11.02 
					//这个时候不作为.
				}else{
					clickfunction = "clickedMyTopic('"+topic.topic_title+"','"+topic.topicid+"')"; 
					mytopicE.attr("onclick",clickfunction);
				}
				mytopiclistE.append(mytopicE);
			}
			mytopicE = $("#e-lib .mytopic").clone();
			mytopicE.text("--- 更多话题 ---");
			page = page-0+1;
			if(topicId != "none"){//用topicid来判断是否新窗.
				clickfunction = "request_mytopiclist('"+page+"')";//用于点击更多.
			}else{//如果是moveto
				clickfunction = "request_mytopiclist_4moveto('"+page+"')";//用于点击更多.
			}
			
			mytopicE.attr("onclick",clickfunction); 
			mytopiclistE.append(mytopicE);
			mytopiclistframe.find(".user").first().append(mytopiclistE);
			$("#msg_list").append(mytopiclistframe.html());
			$("#e-lib .mytopiclist").attr("page",page);
			document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
			//request_merge(topicId, evntdata.topics[0].topicid);
		}
		
		function clickedMyTopic(mytopictitle_clicked,mytopicid_clicked){
			//var move2existedtopicE = $("#move2existedtopic");
			//console.log("topicid:"+topicId);
			//console.log("tmptopicid:"+tmpTopicId);
			if ( topicId != "none" ){//如果这个"直接接入"的元素存在,则为新窗页并且话题尚未创建成功(成功后会remove这个元素).
				//console.log("这个是merge操作, topicid:"+topicId);
				request_merge(mytopictitle_clicked,mytopicid_clicked);
				
			}else{
				//console.log("这个是moveto操作, tmptopicid:"+tmpTopicId);
				request_move2existedtopic(mytopictitle_clicked,mytopicid_clicked);//这个方法在新窗页面中.
			}
		}

		function request_merge(topictitle_mergeto,topicid_mergeto){
			//alert("将当前话题并入["+topictitle_mergeto+"]?");//这个地方要换成可取消的.
			$api.confirm({
				buttons : ['确定', '取消'],
				msg : "将当前话题并入["+topictitle_mergeto+"]?",
			}, function(ret, err) {
				if (ret.buttonIndex == 1) {
					var script = "requestMerge('"+topicId+ "','" + topicid_mergeto+"')";
					execRoot(script);
				}
			});
		}
		
		function inputboxOnFocus(inputObj) {
			dialogboxFollowInput();
		}

		function inputboxOnBlur(inputObj) {
			dialogboxFollowInput();
		}

		function dialogboxFollowInput() {//对话框高度随着输入框的位置变动而变动.目前只对安卓有效.
			var lastInputPosition = 0;
			var currentInputPosition;
			var i = 0;
			j = 0;
			var intervalId = setInterval(function() {//循环跟踪inputframe变化,直到它不动了. - 8.12
				i++;
				currentInputPosition = $("#inputframe").offset().top;
				//$("#notification").text(i);
				if (currentInputPosition != lastInputPosition) {
					document.getElementById("dialog_box").style.height = $("#inputframe").offset().top - 37 + "px";
				} else {
					j++;
					if (j > 5) {
						clearInterval(intervalId);
						document.getElementById('dialog_box').scrollTop = document.getElementById('dialog_box').scrollHeight;
						//$("#notification").text("dialogheight:"+document.getElementById("dialog_box").style.height);
						//$("#notification").text("inputframe posi:" + $("#inputframe").offset().top);
					}
				}
				lastInputPosition = currentInputPosition;
			}, 100);
			//发言提交后,会执行一次focus,也会触发这个方法.
		}

		function prepareDialogPage(){
			//$("#e-lib").hide();//?0113这几个hide改为在css设为display:none或visility:hidden,这样就不会一闪而过. App中也做同样修改.
			//$("#setupbox").hide();
			//$("#wholetitlebox").hide();
			adjustInputFrameHeight();
			titleLengthChange();//自适应显示标题,标题字数过长则用省略号   9.14 Fang
		}

		/**
		 *	若标题字数过长则用省略号代替  9.14 FANG
		 *  */
	function titleLengthChange() {
		if (title.length >= 16) {
			$('#title').text('[ '+title.substring(0, 15) + '…]');
		} else {
			$('#title').text('[ '+title+ ' ]');
		}
	}
		
	function showWholeTitle() {//显示被截略标题的全部文字. //此处要加上修改标题的功能.???
			$("#wholetitlebox").show();
			$("#wholetitle").text(title);
			
			setTimeout(function() {
					$('#wholetitlebox').hide();}, 6000);
			//$("#changetitlebutton").show();
			/*
			if (title.length >= 12) {
				$('#title').text(title);
			}*/
		}

	function changetitle(){
		api.prompt({
				buttons: ['确定', '取消'],
				title: '请输入新的话题名称',
				text:title
			}, function(ret, err) {
				if (ret.buttonIndex == 1) {
					var newTopicName = ret.text;
					if(newTopicName.length == 0){
						costomToast('话题名字不能为空',2000,'middle');
						return;
					}
					if(newTopicName.length > 30){
						costomToast('话题名字长度不能超过30个字符',2000,'middle');
						return;
					}
					costomToast('话题名称修改中...',1000,'middle');
					ajaxRequestChangTitle(newTopicName);
				}
			});
	}
	
	function ajaxRequestChangTitle(newTopicName){

		$.ajax({
			url : "http://www."+domain+"/xunta-web/update_topic_name",
			action :"post",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            dataType: "jsonp",
            jsonp:'callback',
            jsonpCallback:"success_save_user",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
			data : {
				userid : userId,
				topicid : topicId,
				new_topic_name : newTopicName
			},
			async : false,
			success : function(data, textStatus) {
				var status = data.res;
				if(status == 'success'){
					$("#header #title").text(newTopicName);
					title = newTopicName;
					costomToast('话题名称修改成功',1000,'middle');
					exec("topics_page", "updateTopicName('"+topicId+"','"+newTopicName+"')");
				}else{
					costomToast('话题名字修改失败,可能是包含非法字符或服务器异常',1000,'middle');
				}
			},
			error : function(data, textStatus) {
				costomToast(data+' ____  '+textStatus,2000,'middle');
			}
		});
	}
	
	function markLink2MytopicSuccess(topictitle_belinked,recommended_pid){
			var info ="["+topictitle_belinked+"]成功接入当前话题.";		
			costomToast(info, 1000, "middle");
			var targetDetail = $("[senderMsgId = '"+recommended_pid+"']");//定位发言内容的元素.在senderimg元素上也有这个属性,但没有包含进来.不知为什么.xu 2015.11.17
			//console.log("recommended_pid="+recommended_pid);
			console.log(targetDetail.html());
			targetDetail.unbind('click');//取消点击.//不知怎么,把detail的事件也取消了.可能是因为是同一个事件.
			//targetDetail.find(".plus-logo").remove();//删掉原来的加号.
			targetDetail.find(".plus-logo").attr("src","image/yes-20x20.png");//删掉原来的加号.借用原来的css.
			//targetDetail.append($("<img class='yes-logo' src='image/yes-20x20.png' />")); //append一个对号元素.
			//targetPlusLogo.attr("src","image/yes-20x20.png");
	}
			
	function click2RequestMyTopicList(){//merge和新窗中直接移入都是先请求我的话题列表.显示列表时再根据页面情况区别加上不同的点击方法.
			$("#e-lib .mytopiclist").attr("page","1");
			request_mytopiclist(1,10);
	}
				
	function adjustInputFrameHeight(){
			//console.log("进入一般对话页的adjustInputFrameHeight方法.");
			//console.log("先看看:inputframe宽度="+$("#inputframe").width());
			document.getElementById("inputbox").style.width = $("#inputframe").width() - 68 + "px";		//自适应调整输入框的宽度,因为右边有提交按钮图片.xu8.24
			//console.log("减去68,调整之后的: 'inputbox'宽度="+document.getElementById("inputbox").style.width);
		
			//console.log("先看看inputframe的offset="+$("#inputframe").offset().top);
			document.getElementById("dialog_box").style.height = $("#inputframe").offset().top - 37 + "px";	//自适应调整对话框的高度.
			//console.log("调整之后的dialog_box高度="+document.getElementById("dialog_box").style.height);
	}


	function updateNickname(name){
		userName = name;
	}


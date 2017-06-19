function wsConnect() {
    execRoot("checkIfWSOnline4Signal()");
}

//叶夷   2016.06.15  将从服务端的标签显示出来
function responseToCPRequest(CP_list) {//显示从服务器获得的话题列表:    这段代码出现在旧版本，因版本错乱出现在这里
	//$("#loadinganimation").remove();
	$("#showatloaded").show();
	//console.log("进到空白页");
	
	//console.log("测试 ： "+JSON.stringify(CP_list));
	var cpList=CP_list.cp_wrap;
	for(var i=0;i<cpList.length;i++){
		appendElement(i,cpList,CP_list);//叶夷   2016.06.16  如果直接将此方法中的代码放在此循环中，click()方法只会作用在循环最后的标签上，目前不知道原因？
	}
}

//叶夷   2016.06.16  通过服务器返回的标签添加到页面的方法
function appendElement(i,cpList,CP_list){
	var cp_container=$("#cp-container");
	var cp_node = $("<div></div>").attr("class", "cp").attr("id", "cpid"+(i+1));
	var cp=cpList[i];
	cp_node.append("<span>"+cp.cptext+"</span>");
	//console.log("测试： "+i);
	cp_node.click(function(){
		//console.log("测试点击1:"+i);
		//点击每个显示的标签，标为选中，向后台发送选中请求。已选中的再点一次，标记取消，向后台发送请求
		chooseOneCP(cp_node,cp,CP_list);
		//cp_code.css("background-color","#FF0000");
	});
	cp_container.append(cp_node);
}

//叶夷   2016.06.16  点击每个显示的标签，标为选中，向后台发送选中请求。已选中的再点一次，标记取消，向后台发送请求
function chooseOneCP(cp_node,cp,CP_list){
	var userId=CP_list.uid.toString();
	var cpid=cp.cpid;
	var currentRequestedCPPage=CP_list.startpoint;
	//console.log("测试1 ： "+typeof(userId));
	if(cp_node.css("background-color")=="rgba(0, 0, 0, 0)"){//选中
		console.log(cp_node.attr("id")+"-> 选中状态");
		cp_node.css("background-color","#f00");//目前只是改变背景颜色为红色
		sendSelectCP(userId,cpid,currentRequestedCPPage);
	}else{//取消
		console.log(cp_node.attr("id")+"-> 取消状态");
		cp_node.css("background-color","rgba(0, 0, 0, 0)");
		sendUnSelectCP(userId,cpid,currentRequestedCPPage);
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

/*start：叶夷     2017年3月20日
 * 将修改昵称代码转移到home_page_web.js中
 */
//function alterNickname() {
//	api.prompt({
//		buttons : ['确定', '取消'],
//		title : '请输入新昵称:',
//		text : userName
//	}, function(ret, err) {
//		if (ret.buttonIndex == 1) {
//			var newNickname = ret.text;
//			userName = newNickname;
//            var pageParam = {
//                "uid" : userId,
//                "newNickname" : userName
//            };
//            execRoot("requestAlterNickname("+JSON.stringify(pageParam)+")");
//		}
//	});
//}
/*end:叶夷*/


////==========================================以下为头像更换js代码======================================================
//		function alterUserimage() {
//			$("#account").hide();
//			$("#ImageBox").show();
//			$("#disableLayer").show();
//			$("#imghead").attr("src", userImg);
//		}
//
//		/*
//		 本地预览选中图片
//		 */
//		function previewImage(file) {
//			if (!validate_edit_logo(file)) {//验证文件格式
//				return;
//			}
//			var MAXWIDTH = 170;
//			var MAXHEIGHT = 170;
//			var div = document.getElementById('preview');
//			if (file.files && file.files[0]) {
//				div.innerHTML = '<img id=imghead>';
//				var img = document.getElementById('imghead');
//				img.onload = function() {
//					var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
//					img.width = rect.width;
//					img.height = rect.height;
//					img.style.marginLeft = rect.left + 'px';
//					img.style.marginTop = rect.top + 'px';
//				}
//				var reader = new FileReader();
//				reader.onload = function(evt) {
//					img.src = evt.target.result;
//				}
//				reader.readAsDataURL(file.files[0]);
//			} else {
//				var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
//				file.select();
//				var src = document.selection.createRange().text;
//				div.innerHTML = '<img id=imghead>';
//				var img = document.getElementById('imghead');
//				img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
//				var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
//				status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
//				div.innerHTML = "<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;margin-left:" + rect.left + "px;" + sFilter + src + "\"'></div>";
//			}
//			$("#upload").show();
//		}
//
//		/*
//		 验证文件格式
//		 */
//		function validate_edit_logo(file) {
//			$("#upload").attr("disabled", false);
//			if (!/.(gif|jpg|jpeg|png)$/.test($("#file").val())) {
//				toast("图片类型必须是.gif,jpeg,jpg,png中的一种");
//				$("#upload").attr("disabled", true);
//				return false;
//			}
//			return true;
//		}
//
//		/*
//		 设置图片显示大小
//		 */
//		function clacImgZoomParam(maxWidth, maxHeight, width, height) {
//			var param = {
//				top : 0,
//				left : 0,
//				width : width,
//				height : height
//			};
//			if (width > maxWidth || height > maxHeight) {
//				rateWidth = width / maxWidth;
//				rateHeight = height / maxHeight;
//				if (rateWidth > rateHeight) {
//					param.width = maxWidth;
//					param.height = Math.round(height / rateWidth);
//				} else {
//					param.width = Math.round(width / rateHeight);
//					param.height = maxHeight;
//				}
//			}
//			param.left = Math.round((maxWidth - param.width) / 2);
//			param.top = Math.round((maxHeight - param.height) / 2);
//			return param;
//		}
//
//		/*
//		 将选中图片上传到服务器
//		 */
//		function upload() {
//			var formData = new FormData();
//			formData.append('userid', userId);
//			formData.append('file', $('#file')[0].files[0]);
//			$.ajax({
//				url : "http://"+domain+"/xunta-web/upload", //server script to process data
//				type : 'POST',
//				beforeSend : beforeSendHandler,
//				data : formData,
//				dataType : 'JSON',
//				timeout : 5000,
//				cache : false,
//				contentType : false,
//				processData : false
//			}).done(function(ret) {
//				afterSuccessAlterUserImage(ret);
//			}).fail(function(ret) {
//				toast("传输失败，请检查网络");
//			});
//		}
//
//		function afterSuccessAlterUserImage(ret){
//			toast(ret.msg);
//			userImg = ret.image_url+"?"+ new Date().getTime();
//			$("#userImg").attr("src", userImg);
//			//$("#topic_img").attr("src", userImg);
//			//document.getElementById("userImg").src=userImg;
//			console.log($("#userImg").src);
//			console.log("头像上传成功后,打印一下返回的数据,应该有一个image_url的项和值,如果没有需要调整:"+JSON.stringify(ret));
//			这一步需要测试: window.localStorage.setItem('image', userImg);
//			//这个方法需要创建,并且测试: setCookie("image",userImage);
//		}
//
//		function beforeSendHandler() {
//			console.log("beforesend");
//		}
//
//		/*
//		关闭头像更改窗口
//		*/
//		function closeImageBox() {
//			$("#imghead").attr("width",170);
//			$("#imghead").attr("height",170);
//			$("#upload").hide();
//			$("#ImageBox").hide();
//			$("#disableLayer").hide();
//		}

/*end:叶夷*/




function closeSearch(){
	document.getElementById("_keywords").value="";
	$("#search-list-container").hide();
	$("#search_list").empty();
}




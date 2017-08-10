function wsConnect() {
	execRoot("checkIfWSOnline4Signal()");
}

// 叶夷 2017.06.15 将从服务端的标签显示出来
function responseToCPRequest(CP_list) {// 显示从服务器获得的话题列表: 这段代码出现在旧版本，因版本错乱出现在这里
	// 叶夷 2017.07.11 等请求cp返回之后再请求用户匹配缩略表
	// requestTopMatchedUsers(userId,requestTopMUNum);

	// $("#loadinganimation").remove();
	$("#showatloaded").show();
	// console.log("进到空白页");

	// console.log("测试 ： "+JSON.stringify(CP_list));
	var cpList = CP_list.cp_wrap;
	// 定义cp动画开始之前的位置
	for (var i = 0; i < cpList.length; i++) {
		appendElement(i, cpList, CP_list);// 叶夷 2016.06.16
		// 如果直接将此方法中的代码放在此循环中，click()方法只会作用在循环最后的标签上，目前不知道原因？
	}

	// 定义好位置之后开始动画,参数是需要动画的个数
	startAnimate(cpList.length);
	$("#request_cp").show();
}

// 叶夷 2017.06.16 通过服务器返回的标签添加到页面的方法
function appendElement(i, cpList, CP_list) {
	// 叶夷 2017.06.20 控制cp的大小和字体颜色
	var cp_width = 60;
	var cp_height = 60;
	var cp_color = "black";

	var cp_container = $("#cp-container");
	var cp = cpList[i];

	var cp_node = $("<div></div>").attr("class", "cp").attr("id",
			"cpid" + cp.cpid);// 外圆div
	var cp_innode = $("<div></div>").attr("class", "incp");// 内圆div
	cp_node.append(cp_innode);
	// var cp_text="<div
	// style='width:"+cp_width+"px;height:"+cp_height+"px;color:"+cp_color+";'>"+cp.cptext+"</div>";
	var cp_text = $("<div></div>")/* .text(cp.cptext) */;// 文字div

	// 先随机cptext 字体的大小
	var cpTextSize = Math.random() * 8 + 12;
	cpTextSize = parseInt(cpTextSize);
	// 先随机内圆 div的大小
	var cpInNodeWidth = Math.random() * 40 + 40;
	cpInNodeWidth = parseInt(cpInNodeWidth);

	cp_innode.css("height", cpInNodeWidth);
	cp_innode.css("width", cpInNodeWidth);
	// 调用字体大小匹配圆大小的方法
	calCircle(cp_text, cpTextSize, cp.cptext, cp_node, cp_innode);

	cp_innode.append(cp_text);

	// console.log("测试： "+i);
	cp_node.click(function() {
		// console.log("测试点击1:"+i);
		// 点击每个显示的标签，标为选中，向后台发送选中请求。已选中的再点一次，标记取消，向后台发送请求
		chooseOneCP(cp_node, cp);
		// cp_code.css("background-color","#FF0000");
	});

	cp_container.append(cp_node);
	cpAnimationLocation(cp_node);
}

var minCPSize = 40;// 最小内圆的大小
var maxCPSize = 80;// 最大内圆的大小
var minCPTextSize = 12;// cp文字大小的最小值
var maxCPTextSize = 20;// cp文字大小的最大值
var maxCPTextNumber = 9;// cp文字最大的数量

// 叶夷 2017.06.30
// cp圆的大小与文字匹配,在分级的情况下计算相应文字的面积，然后计算圆的面积(这里还没想好怎么做：然后比较内圆大小，如果内圆不能装下文字，则扩大外圆)
function calCircle(cp_text, cpTextSize, cpText, cp_node, cp_innode) {// 传入的参数是：cp文字div,cp文字大小，cp文字，外圆div，内圆div
	var cpTextLength = length(cpText);

	// 控制cp文字的大小
	if (cpTextSize > maxCPTextSize) {
		cpTextSize = 20;
	} else if (cpTextSize < minCPTextSize) {
		cpTextSize = 12;
	}

	// 控制内圆div的大小
	var cpInNodeWidth = cp_innode.width();// 内圆div的宽
	// var cpInNodeHeight=cp_innode.height();//内圆div的高
	if (cpInNodeWidth < minCPSize) {
		cpInNodeWidth = minCPSize;
	} else if (cpTextSize > maxCPSize) {
		cpInNodeWidth = maxCPSize;
	}

	var cpTextWidth;// cp文字 div的宽
	var cpTextHeight;// cp文字 div的高
	if (cpTextLength > maxCPTextNumber) {// 控制cp文字显示的个数
		cpText = subString(cpText, maxCPTextNumber, true);// 为true就是字符截断之后加上"..."
		cpTextLength = maxCPTextNumber + 1;
	}
	// 分级列出文字的情况，求出cp文字 div的宽和高
	// 1-3个字为一行
	if (cpTextLength <= 3) {
		cpTextWidth = cpTextSize * cpTextLength;
		cpTextHeight = cpTextSize + 5;
	} else if (cpTextLength <= 10 && cpTextLength > 3) {// 4-10个字为两行
		if (cpTextLength % 2 == 0) {
			cpTextWidth = cpTextSize * (cpTextLength / 2);
		} else {
			cpTextWidth = cpTextSize * (cpTextLength / 2 + 1);
		}
		cpTextHeight = cpTextSize * 2 + (6 * 2);
	}
	// 将cp文字div的大小设置
	cp_text.css("height", cpTextHeight + "px");
	cp_text.css("width", cpTextWidth + "px");
	cp_text.css("font-size", cpTextSize);
	cp_text.text(cpText);

	// 计算cp div的斜边的大小，即容纳其外圆的直径
	var hypotenuse = parseInt(Math.sqrt(Math.pow(cpTextHeight, 2)
			+ Math.pow(cpTextWidth, 2))) + 1;
	// 为了使文字居中，计算文字div 的top
	var cpTextTop;
	var cpTextLeft;

	// 将内圆的width与cp div比较，如果内圆能装下cp div则外圆和内圆差不多大，如果装不下则外圆扩大
	if (cpInNodeWidth > hypotenuse) {// 内圆能装下cp div则外圆和内圆差不多大
		cp_node.css("height", cpInNodeWidth + "px");
		cp_node.css("width", cpInNodeWidth + "px");
	} else {// 如果装不下则外圆扩大,内圆也需要调整位置
		cp_node.css("height", hypotenuse + "px");
		cp_node.css("width", hypotenuse + "px");

		// 内圆位置调整
		var cpInNodeTop = (hypotenuse - cpInNodeWidth) / 2;
		cp_innode.css("top", cpInNodeTop);
		cp_innode.css("left", cpInNodeTop);

	}
	cpTextTop = (cpInNodeWidth - cpTextHeight) / 2;
	cpTextLeft = (cpInNodeWidth - cpTextWidth) / 2;
	cp_text.css("top", cpTextTop);
	cp_text.css("left", cpTextLeft);
}

// 叶夷 2017.06.30 判断字符串长度，中文=英文的两倍
function length(cpText) {
	var len = 0;
	for (var i = 0; i < cpText.length; i++) {
		if (cpText.charCodeAt(i) > 127 || cpText.charCodeAt(i) == 94
				|| (cpText.charCodeAt(i) >= 38 && cpText.charCodeAt(i) <= 57)) {
			len++;
		} else {
			len += 0.5;
		}
	}
	return len;
}

// 叶夷 2017.06.30 中英文不同情况的字符串截取，中文=英文的两倍
function subString(str, len, hasDot) {
	var newLength = 0;
	var newStr = "";
	var chineseRegex = /[^\x00-\xff]/g;
	var singleChar = "";
	var strLength = str.replace(chineseRegex, "**").length;
	for (var i = 0; i < strLength; i++) {
		singleChar = str.charAt(i).toString();
		if (singleChar.match(chineseRegex) != null) {
			newLength++;
		} else {
			newLength += 0.5;
		}
		if (newLength > len) {
			break;
		}
		newStr += singleChar;
	}

	if (hasDot && strLength > len) {
		newStr += "...";
	}
	return newStr;
}

var cpValue = new Array();// 定义一个数组，将可见屏幕的所有标签的left和top值存入数组中，这样可以直接对比

function CP(cpNode, cpLeft, cpRight, cpTop, cpBottom) {// 定义一个cp类
	var obj = new Object();
	obj.cpNode = cpNode;
	obj.cpLeft = cpLeft;// 用来判断轨迹范围,最后定位上升cp的动画位置
	obj.cpRight = cpRight;// 用来判断轨迹范围
	obj.cpTop = cpTop;// 用来排序，在已存在的cp内，寻找最低；在要上升的cp轨迹内，寻找最高；最后定位上升cp的动画位置
	obj.cpBottom = cpBottom;
	obj.getCpNode = function() {
		return this.cpNode;
	};
	obj.getCpLeft = function() {
		return this.cpLeft;
	};
	obj.getCpRight = function() {
		return this.cpRight;
	};
	obj.getCpTop = function() {
		return this.cpTop;
	};
	obj.getCpBottom = function() {
		return this.cpBottom;
	};
	return obj;
}

// 叶夷 2017.06.27 实现圆切面的上升动画效果
function cpAnimationLocation(cp_node) {
	var cp_container = $("#cp-container");// 装标签的容器
	var cpWidth = cp_node.width();// 要上升的标签宽
	var cpHeight = cp_node.height();// 要上升的标签高
	var containerWidth = cp_container.width();// 装cp容器的宽度，即扫描轨迹的x轴的总数

	var top = -1;// 用来和不同轨迹对比，将数值最大的赋值给top
	var left = 0;//

	// 1.遍历装cp容器的宽度,每次+1px
	for (var start = 0; start <= containerWidth - cpWidth; start++) {// start是要上升的cp的left的值，所以终点必须空出上升cp的width

		// 2.从便利开始获得上升cp的圆心坐标和半径，以cp_container的左下点为(0,0)
		var cpRadius = cpWidth / 2;// 半径就是要上升的cp的宽除以2
		var cpX = start + cpRadius;// 一开始圆心的x为start+cpRadius
		var cpY = 0;// 一开始圆心的y为0

		// 3.划分出这次start要上升的圆的上升轨迹左右范围
		var cpLeft = start;
		var cpRight = start + cpWidth;

		// 用两个数组容器来装轨迹内已经存在的cp中两个最低的圆
		var cpTwo = new Array();

		// 4.遍历所有已经存在的cp，判断哪些cp在这条轨迹范围内
		for (var j = 0; j < cpValue.length; j++) {// 遍历已经存在的所有cp

			var cpObj = cpValue[j];
			var cpNode = cpObj.getCpNode();
			var cpLeftValue = cpObj.getCpLeft();// 获得已有cp的最左边边界值
			var cpRightValue = cpObj.getCpRight();// 获得已有cp的最右边边界值
			var cpTopValue = cpObj.getCpTop();// 获得已有cp的最上边边界值
			var cpBottomValue = cpObj.getCpBottom();// 获得已有cp的最下边边界值

			var nowCpRadius = (cpRightValue - cpLeftValue) / 2;// 现有cp的半径
			var nowCpX = cpLeftValue + nowCpRadius;// 现有cp的圆心x周

			if (Math.abs(nowCpX - cpX) < (nowCpRadius + cpRadius)) {// 如果现有cp的x轴-上升cp的x轴<两者半径的和，则表示两圆相交,表示存在的圆在这个轨道内
				cpTwo.push(new CP(cpNode, cpLeftValue, cpRightValue,
						cpTopValue, cpBottomValue));
			}
		}

		cpTwo.sort(function(a, b) {
			return b.getCpBottom() - a.getCpBottom();// bottom值越大越低，要从大到小排序
		});

		var maxTop;
		// var cpFirstTangencyTop;
		// var cpSecondTangencyTop;
		var isOverLay = false;// 判断是否重叠
		if (cpTwo.length > 0) {
			// 5.拿出轨迹内cp最低的圆,即cpTwo数组中的第一个
			var cpFirstObj = cpTwo[0];
			if (cpTwo.length != null) {
				// 6.计算与cpFirstObj能够相切时的位置
				maxTop = calCPTangencyTop(cpFirstObj, cpRadius, cpX);// 可以上升的Top值
				for (var k = 0; k < cpTwo.length; k++) {
					var cpSecondObj = cpTwo[k];
					cpY = maxTop + cpRadius;// 上升点模拟轨迹中最高点的y轴点

					var cpLeftValue = cpSecondObj.getCpLeft();
					var cpTopValue = cpSecondObj.getCpTop();
					var cpRightValue = cpSecondObj.getCpRight();
					var nowCpRadius = (cpRightValue - cpLeftValue) / 2;// 第二个最低点半径
					var nowCpX = cpLeftValue + nowCpRadius;// 第二个最低点的圆心x轴
					var nowCpY = cpTopValue + nowCpRadius;// 第二个最低点的圆心y轴

					if (Math.sqrt(Math.pow((cpX - nowCpX), 2)
							+ Math.pow((cpY - nowCpY), 2)) < (cpRadius + nowCpRadius)) {// 如果与第一个最低点相切的时候与第二个最低点重合
						isOverLay = true;
						break;
					}
				}
			}
		} else {
			maxTop = 0;
		}

		if (isOverLay) {
			continue;
		}

		if (top == -1) {// 如果一开始=-1，则top直接赋值
			top = maxTop;
		} else {
			if (top > maxTop) {
				top = maxTop;
				left = cpLeft;
				right = cpRight;
			}
		}
	}
	var right = left + cpWidth;
	var bottom = top + cpHeight;
	cpValue.push(new CP(cp_node.attr("id"), left, right, top, bottom));
	cp_container.height(bottom);
}

// 叶夷 2017.06.28 定义好位置之后开始动画,参数是需要动画的个数
function startAnimate(length) {
	for (var j = cpValue.length - 1; j > cpValue.length - length - 1; j--) {
		var cp_nodeId = cpValue[j].getCpNode();
		var cp_node = $("#" + cp_nodeId);
		var cp_start = $("#cp-container").height();// 每次从一批标签的最后开始上升
		var left = cpValue[j].getCpLeft();
		var top = cpValue[j].getCpTop();
		cp_node.css("top", cp_start + "px");
		cp_node.css("left", left + "px");

		var second = Math.random() * 2 + 2;
		second = parseInt(second);
		cp_node.animate({
			top : top + "px"
		}, {
			duration : second * 1000
		});
	}
}

// 计算与圆相切时的top值
function calCPTangencyTop(cpObj, cpRadius, cpX) {
	// 6.计算与cpFirstObj能够相切时的位置
	var cpObjNode = cpObj.getCpNode();
	var cpObjRadius = $("#" + cpObjNode).width() / 2;// 已有cp的半径
	var cpObjLeftValue = cpObj.getCpLeft();// 获得已有cp的最左边边界值
	var cpObjTopValue = cpObj.getCpTop();
	var cpObjX = cpObjLeftValue + cpObjRadius;// 圆心的x轴
	var cpObjY = cpObjTopValue + cpObjRadius;// 圆心的y轴

	// 上升的cp在轨迹内可以与其相切的y值
	var cpTangencyY = cpObjY
			+ Math.sqrt(Math.pow((cpRadius + cpObjRadius), 2)
					- Math.pow((cpX - cpObjX), 2));
	var cpTangencyTop = cpTangencyY - cpRadius + 1;// 可以上升的Top值
	return parseInt(cpTangencyTop);
}

// 叶夷 2017.06.16 点击每个显示的标签，标为选中，向后台发送选中请求。已选中的再点一次，标记取消，向后台发送请求
function chooseOneCP(cp_node, cp) {
	var cpid = cp.cpid;
	var text=cp.cptext;
	chooseCP(cp_node,cpid,text);
}

function chooseCP(cp_node,cpid,text){
	console.log(cp_node.attr("id") +":"+text+ "-> 选中状态");
	sendSelectCP(userId, cpid,text);
	cp_node.unbind();
}

//叶夷  2017.08.08 选中的标签添加到我的标签框中
function showSelectTag(data){
	var cpid=data.cpid;
	var text=data.cptext;
	addMyCp(cpid,text);
}

function addMyCp(cpid,text){
	var myTagContainer=$("#mytag-container");
	var myTag = $("<div onclick='ShowUnSelectCP("+cpid+")'></div>").attr("class", "mytag").attr("id", "mytag"+cpid).text(text);
	myTagContainer.append(myTag);
	
	var myTagTextLength = length(text);
	var myTagWidth=myTagTextLength*16+10;
	myTag.css("width", myTagWidth+"px");
	$("#cpid"+cpid).css("opacity", "0.2");// 目前只是改变背景颜色为红色
	
	document.getElementById('mytag-container').scrollTop = document.getElementById('mytag-container').scrollHeight;
}

//叶夷  2017.08.08 取消选中的标签
function ShowUnSelectCP(cpid){
	var cp_node=$("#cpid"+cpid);
	console.log(cpid + "-> 取消选择");
	cp_node.css("opacity", "1");
	$("#mytag"+cpid).remove();
	sendUnSelectCP(userId, cpid);
	
	//将取消选择的标签重新绑定点击事件
	cp_node.click(function() {
		chooseCP(cp_node,cpid);
	});
	
}

/**
 * 注销功能，跳转到登录页面，修改本地文件logOff标识
 */
function logOff() {
	clearLocalstoreUserInfo();
	execRoot("deleteCookie()");
	execRoot("hideIndexLogInfo()");
	execRoot("initLastTopicTime()");
	execRoot("showLogin()");
	execRoot("clearTopicsPageOpenMark()");
	execRoot("clearCurrentPageId()");// 在所有页面都关掉后,这个不清楚,会使toast等功能出现大量报错.
	closeAllPages2Index(); // xu 2016.4.9
}

function clearLocalstoreUserInfo() {
	localStorage.clear();
}

// 进入聊天页，别人的uid和我的uid都需要
function enterDialogPage() {
	// var topictitle = $("#" + topicid + " .topictitle").attr("title");
	// topictitle = specialLettersCoding(topictitle);
	var toUserName;
	if (userName === "婚礼司仪涛哥") {
		toUserName = "汉良";
		toUserId = "804622010041896960";
	} else {
		toUserName = "婚礼司仪涛哥";
		toUserId = "745600342770716672";
	}

	var pageParam = {
		"toUserId" : toUserId,
		"toUserName" : toUserName,// 这里是为了测试
		// "toUserImage" : "",
		"userid" : userId,
		"userName" : userName,
		"userImage" : userImg,
		"server_domain" : domain,
		"userAgent" : userAgent,
		"topicPageSign" : "yes"
	};
	console.log("enterDialogPage toUserId=" + toUserId + "|toUserName="
			+ toUserName);
	// openWin(topicid,'dialog_page/dialog_page.html',JSON.stringify(pageParam));
	openWin(toUserId, 'dialog_page/dialog_page.html', JSON.stringify(pageParam));
}

// 2017.07.26 叶夷 进入聊天列表页，需要我的id
function EnterdialogList() {
	var pageParam = {
		"userid" : userId,
		"userName" : userName,
		"userImage" : userImg,
		"server_domain" : domain,
		"adminName" : adminName,
		"adminImageurl" : adminImageurl,
		"userAgent" : userAgent,
		"topicPageSign" : "yes"
	};
	console.log("enterDialogListPage userId=" + userId);
	openWin('dialoglist_page', 'dialoglist_page/dialoglist_page.html', JSON
			.stringify(pageParam));
}

//2017.08.07 叶夷 进入匹配人列表详细信息页，需要UserId
function enterMatchUsersPage(){
	var pageParam = {
			"userid" : userId,
			"userName" : userName,
			"userImage" : userImg,
			"server_domain" : domain,
			"adminName" : adminName,
			"adminImageurl" : adminImageurl,
			"userAgent" : userAgent,
			"topicPageSign" : "yes"
		};
		console.log("enterMatchUsersPage userId=" + userId);
		openWin('matchUsers_page', 'matchUsers_page/matchUsers_page.html', JSON
				.stringify(pageParam));
}

function closeSearch() {
	document.getElementById("_keywords").value = "";
	$("#search-list-container").hide();
	$("#search_list").empty();
}

// 2017.07.04 叶夷 建立一个匹配人列表所需要的数据类，用来模拟数据
function MatchPeople(mpId, mpImg) {// 有匹配人的ID，匹配人的头像图片
	var obj = new Object();
	obj.mpId = mpId;
	obj.mpImg = mpImg;
	obj.getMpId = function() {
		return this.mpId;
	};
	obj.getMpImg = function() {
		return this.mpImg;
	};
	return obj;
}

// 2017.07.07 叶夷 如何解决匹配人交换位置动画还没完成又有新的匹配人排名顺序进来
// 1.一个队列，用来装后台发来的匹配人的数组，如果有新数据，先判断动画有没有运行完，如果运行完，则直接进入程序运行，如果没有运行完则将新数据放入队列中
// 2.匹配人交换位置动画运行完毕现将自己这份数据在队列中删除，然后查看队列里面有没数据，有则接着运行,没有则运行完毕
var muDataQueue = new Array();
var circleEnd = true;// 判断动画是否运行完

// 2017.07.07 叶夷 这是用户刚开始打开网页的时候请求的后端返回的匹配人列表
function responseTopMatchedUsers(muData) {
	var matchedUserArr = muData.matched_user_arr;// 获得后台发送的匹配人排名信息数组
	showMatchPeople(matchedUserArr);// 显示匹配人列表
}

// 2017.07.07 叶夷 匹配用户改变
function push_matched_user(newMuData) {
	var newMatchedUserArr = newMuData.new_user_arr;// 获得后台发送的匹配人排名信息数组
	// 如果有新数据，先判断动画有没有运行完
	if (circleEnd) {// 如果运行完，则直接进入程序运行
		showMatchPeople(newMatchedUserArr);
	} else {// 如果没有运行完则将新数据放入队列中
		mpDataQueue.push(newMatchedUserArr);
	}
}

//2017.07.04 叶夷 模拟数据的产生 
function addMPData(){ 
	var newMatchedUserArr=new Array();//装后台发来的匹配人 
	var mpId=new Array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15);//模拟的匹配人ID 
	var mpImg=new Array("#FFFF00","#FF0000","#0000CD","#20B2AA","#228B22","#FFD39B","#551A8B","#54FF9F",
						"#68838B","#8B3A3A","#FF7256","#FF6347","#FF34B3","#EEC900","#000000");//模拟的匹配人头像，目前用颜色代替
	for(var i=0;i<10;i++){ 
		var temp=parseInt(Math.random()*15); 
		var exist=false;//不存在 
		if(newMatchedUserArr.length!=0){ 
			for(var j=0;j<newMatchedUserArr.length;j++){
				if(mpId[temp]==newMatchedUserArr[j].getMpId()){ 
					exist=true;//存在
					break; 
				} 
			} 
		}
		if(!exist){ 
			newMatchedUserArr.push(new MatchPeople(mpId[temp],mpImg[temp]));
		}else{ 
			i--; 
		} 
	}
  
	//如果有新数据，先判断动画有没有运行完 
	if(circleEnd){//如果运行完，则直接进入程序运行
		showMatchPeople(newMatchedUserArr); 
	}else{//如果没有运行完则将新数据放入队列中
		muDataQueue.push(newMatchedUserArr); 
	} 
}

 

var muNowData = new Array();// 前台目前显示的匹配人列表排名
// 2017.07.04 叶夷 显示匹配人列表，没有数据的时候先用模拟数据
function showMatchPeople(matchedUserArr) {// 传入的参数为：所需的匹配人列表数据(且排好了顺序)
	var mu_container = $("#match_users");// 获得装匹配人列表的容器；
	var muContainerWidth = mu_container.width();

	if (muNowData.length == 0) {// 如果是用户一开始上线，匹配人列表没有
		for (var i = 0; i < matchedUserArr.length; i++) {
			 var muId=matchedUserArr[i].getMpId();//获得匹配人列表的匹配人id,这是测试数据版
			//var muId = matchedUserArr[i].userid;// 获得匹配人列表的匹配人id
			var mu = $("<div></div>").attr("class", "mu").attr("id", +muId);
			 var muImg=matchedUserArr[i].getMpImg();//获得匹配人列表的匹配人头像,这是测试版数据
			//var muImg = matchedUserArr[i].img_src;// 获得匹配人列表的匹配人头像
			 mu.css("background-color",muImg);//这是测试版数据
			//mu.css("background", muImg);
			mu_container.append(mu);
			var muNowDataWidth = mu.width();
			var muLeft = ((muContainerWidth / matchedUserArr.length)
					- muNowDataWidth + muNowDataWidth)
					* i;// 这是每个头像之间的间隔
			mu.css("left", muLeft + "px");
			muNowData.push(mu);
			
			//点击事件
			mu.click(function() {
				//进入聊天页
				enterDialogPage();
			});
		}
	} else {// 用户在操作过程中匹配人列表发生改变
		var i = 0;

		// 2017.07.05 叶夷 一一对比之后开始将排名改变的用户动画
		circleAnimation(i, matchedUserArr);
	}
}
var aniSecond = 2;// 动画的速度，即距离/秒数，37px/s
var isTimeOut = 0;// 判断是否延时，让排名改变需要动画时才延时，isTimeOut=1,如果排名没有改变不需要延时，isTimeOut=0;

// 2017.07.05 叶夷 一一对比之后开始将排名改变的用户动画
function circleAnimation(i, matchedUserArr) {
	var muserid = matchedUserArr[i].userid;// 这是匹配人id
	// var muserid=matchedUserArr[i].getMpId();//这是匹配人id,这是测试版数据

	// var muserimg=matchedUserArr[i].getMpImg();//这是匹配人头像,这是测试数据
	var muserimg = matchedUserArr[i].img_src;// 这是匹配人头像

	if (muserid != muNowData[i].attr("id")) {// 排名改变
		circleEnd = false;// 只要动画开始执行则动画没有完成
		isTimeOut = 1;// 让排名改变需要动画时才延时

		var exist = false;// 表示后台传来的数据是新数据
		var muNowPosition;// 表示如果从后台新来的数据在前台存在但是排名有所改变时前台存在的排名
		for (var j = i; j < muNowData.length; j++) {// 遍历现有的头像
			if (muserid == muNowData[j].attr("id")) {
				exist = true;// 表示后台传来的数据不是新数据，已经存在
				muNowPosition = j;
				break;
			}
		}
		if (exist) {// 存在,则原有位置的mp缩小，其左边的且没超过新排名名次的mp向右移动，原有位置的mp缩小之后移动到该有的位置
			// 1.需要变换位置的mp缩小
			var changeMu = muNowData[muNowPosition];// 需要移动的mp
			var moveLeft = muNowData[i].css("left");// 需要向左移动的目的地的位置,在这个位置移动之前先保存下来
			animateForSize(changeMu, 10, aniSecond * 0.3);// 缩小

			// 2.首先判断在新排名和原有位置的mp之间的匹配人,这些匹配人移动
			for (var k = i; k < muNowPosition; k++) {
				var moveMu = muNowData[k];// 需要移动的mp
				var moveEndLeft = muNowData[k + 1].css("left");// 移动的目的地，
				// 即下一个mp的位置
				animateForLeft(moveMu, moveEndLeft, aniSecond);
			}

			// 3.需要变换位置的mp向左移动
			animateForLeft(changeMu, moveLeft, aniSecond * 0.4);

			// 4.需要变换位置的mp到了位置之后再变大
			animateForSize(changeMu, 30, aniSecond * 0.3);// 扩大
			// alert("动画完成了");

			// 5.所有位置移动之后mpNowData数组的位置也要更新
			var temp = muNowData[muNowPosition];// 临时位置，用来保存
			for (var k = muNowPosition; k >= i; k--) {
				if (k == i) {
					muNowData[k] = temp;
				} else {
					muNowData[k] = muNowData[k - 1];
				}
			}
		} else {// 不存在
			// 2017.07.06 叶夷
			// 1.将页面不存在的mp
			var mu_container = $("#match_users");
			var newMu = $("<div></div>").attr("class", "mu")
					.attr("id", muserid);
			mu_container.append(newMu);// 产生一个新的mp
			
			//点击事件
			newMu.click(function() {
				//进入聊天页
				enterDialogPage();
			});
			
			newMu.css("background", muserimg);
			// newMu.css("background-color",muserimg);//这是测试数据
			// 2.将新的mp定位最右端位置且大小为10;
			var newStartMuLeft = mu_container.width();
			newMu.css("left", newStartMuLeft);
			newMu.css("width", "10px");
			newMu.css("height", "10px");
			// 向左移动
			var newMuLeft = muNowData[i].css("left");
			animateForLeft(newMu, newMuLeft, aniSecond * 0.7);

			var muNowPositionNewNotExist;// 这个位置的前端匹配人在新排名里不存在
			// 3.获得现有mp中应该去除的排名，则在新排名中没有的mp,且将它缩小
			for (var index = i; index < muNowData.length; index++) {
				var exist = false;// 表示在前端的数据中在新排名里面没有
				for (var j = i; j < matchedUserArr.length; j++) {
					// if(muNowData[index].attr("id")==matchedUserArr[j].getMpId()){//表示在前端的数据中在新排名里面有,这是测试版
					if (muNowData[index].attr("id") == matchedUserArr[j].userid) {// 表示在前端的数据中在新排名里面有
						exist = true;
						break;
					}
				}
				if (!exist) {
					muNowPositionNewNotExist = index;
					break;
				}
			}
			animateForSize(muNowData[muNowPositionNewNotExist], 0,
					aniSecond * 0.4);// 缩小

			// 4.将新的mp位置与现有mp中应该去除的排名位置之间的mp向右移
			for (var k = i; k < muNowPositionNewNotExist; k++) {
				var moveMu = muNowData[k];// 需要移动的mp
				var moveEndLeft = muNowData[k + 1].css("left");// 移动的目的地，
				// 即下一个mp的位置
				animateForLeft(moveMu, moveEndLeft, aniSecond * 0.4);
			}

			// 5.新的mp变大
			animateForSize(newMu, 30, aniSecond * 0.3);// 扩大

			// 6.所有位置移动之后mpNowData数组的位置也要更新
			for (var k = muNowPositionNewNotExist; k >= i; k--) {
				if (k == i) {
					muNowData[k] = newMu;
				} else {
					muNowData[k] = muNowData[k - 1];
				}
			}

		}
	}

	// 这里是为了做延时操作
	i += 1;
	if (i >= matchedUserArr.length) {
		// alert("一次排名整个调换动画完毕");
		// 匹配人交换位置动画运行完毕现将自己这份数据在队列中删除
		removeByValue(muDataQueue, matchedUserArr);
		// 然后查看队列里面有没数据，有则接着运行,没有则运行完毕
		if (muDataQueue.length > 0) {// 有则接着运行
			showMatchPeople(muDataQueue[0]);
		} else {// 没有则运行完毕
			circleEnd = true;
		}

		return;
	} else {
		timeOutSuccess = setTimeout(function() {
			circleAnimation(i, matchedUserArr);
		}, (aniSecond + 1) * 1000 * isTimeOut);
	}
	isTimeOut = 0;// 是否延时调整回最初状态;
}

// 匹配人头像移动,向右或者向左
function animateForLeft(muDiv, muLeft, second) {// 移动的物体，移动的目的地，移动的时间
	muDiv.animate({
		left : muLeft
	}, second * 1000);
}

// 匹配人头像缩小或者放大
function animateForSize(muDiv, muSize, second) {// 移动的物体，变化的大小，移动的时间
	muDiv.animate({
		width : muSize + "px",
		height : muSize + "px"
	}, second * 1000);
}

// 删除数组元素的方法,为了动画完成之后将动画完成的数据在队列里删除
function removeByValue(arr, val) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == val) {
			arr.splice(i, 1);
			break;
		}
	}
}

// 弹出添加标签框
function addTag() {
	var _obj = $("#showatloaded");
	var _h = 100;
	var _w = _obj.width() - 80;
	var contextresult = [];
	contextresult.push('<div id="entrytag">');
	contextresult
			.push("<p class='addtag-div'><input type='text' class='tag-name' id='pop_tagName' onporpertychange='showSearchTag()' oninput='showSearchTag()' onkeypress='if(event.keyCode==13){Javascript:searchToAddTag();}'></p>");
	contextresult
			.push('<div class="btn-div" onclick="searchToAddTag()">添加</div>');
	contextresult.push('</div>');
	contextresult
			.push('<div class="searchtag_suggest" id="gov_search_suggest"></div>');
	alertWin(contextresult.join(''), "添加新的标签", _w, _h);
}

function showSearchTag() {
	aData.splice(0,aData.length);//清空数组
	//清空div中所有的子元素
	var childList = document.getElementById('gov_search_suggest').childNodes;
	for(var i=0,len=childList.length;i<len;i++){
	    document.getElementById('gov_search_suggest').removeChild(childList[0]);
	}
	var input_value = $("#pop_tagName").val();//获得输入框的值
	responseSearchTag(input_value);//通过输入框获得匹配的数据
}

function searchTagData(id,text){
	var obj = new Object();
	obj.id= id;
	obj.text= text;
	obj.getId = function() {
		return this.id;
	};
	obj.getText = function() {
		return this.text;
	};
	return obj;
}

var aData = [];
//通过输入框获得匹配的数据
function sendKeyWordToBack(input_value,data) {
	var suggestWrap = $('#gov_search_suggest');
	
	for(var i in data){
		aData.push(searchTagData(data[i].id,data[i].text));
	}
	
	//获得的搜索结果循环
	for(var data in aData){
		searchTag(suggestWrap,aData[data]);
	}
	
	//输入框为空的话，结果不显示
	if(input_value!="" && aData.length!=0){
		$("#htmlObj").css("height","200px");
		suggestWrap.show();
	}else{
		$("#htmlObj").css("height","100px");
		suggestWrap.hide();
	}
}

function searchTag(suggestWrap,data){
	var cpid=data.id;
	var text=data.text;
	
	var searchtag = $("<div></div>")/*.attr("id","searchtag" + data)*/.text(text);// 文字div
	suggestWrap.append(searchtag);
	
	//点击事件
	searchtag.click(function() {
		//点击搜索项之后将数据放入输入框中
		$("#pop_tagName").val(text);
		$("#htmlObj").css("height","100px");
		suggestWrap.hide();
	});
}

function showMyCp(datas){
	var myTagContainer=$("#mytag-container");
	for(var i in datas){
		var cpid=datas[i].cp_id;
		var text=datas[i].text;
		/*var myTag = $("<div onclick='ShowUnSelectCP("+cpid+")'></div>").attr("class", "mytag").attr("id", "mytag"+cpid).text(text);
		myTagContainer.append(myTag);*/
		addMyCp(cpid,text);
	}
	
	//加号位置
	var addTagImg=$("#addtagimg");
	var addWidth=addTagImg.css("width");
	var addHeight=addTagImg.css("height");
	
	var myTagContainerWidth=myTagContainer.css("width");
	var myTagContainerHeight=myTagContainer.css("height");
	
	var addMarginTop=parseInt(myTagContainerHeight)-parseInt(addHeight);
	var addMarginLeft=parseInt(myTagContainerWidth)-parseInt(addWidth);
	
	addTagImg.css("margin-top",addMarginTop+"px");
	addTagImg.css("margin-left",addMarginLeft+"px");
}

//2017.08.09  叶夷  添加标签之后的显示
function addCpShow(data){
	var suggestWrap=$("#gov_search_suggest")
	
	var cpid=data.msg.insertId;
	var mgs2=data.msg2;//判断是否重复添加
	if(mgs2==undefined){
    	console.log("添加标签成功");
    		//添加标签框回复原样
    	toast_popup("添加标签成功",2500);
	}else{
		cpid=data.msg[0].id;
		console.log("选中标签成功");
		toast_popup("选中标签成功",2500);
	}
	sendSelectCP(userId, cpid);
	$("#htmlObj").css("height","100px");
	suggestWrap.hide();
}

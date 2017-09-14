function wsConnect() {
	execRoot("checkIfWSOnline4Signal()");
}

//2017.09.13 叶夷  定义一个数组装哪几个圆相交
var intersetCPArray=new Array();

// 叶夷 2017.06.15 将从服务端的标签显示出来
function responseToCPRequest(CP_list) {// 显示从服务器获得的话题列表: 这段代码出现在旧版本，因版本错乱出现在这里
	// 叶夷 2017.07.11 等请求cp返回之后再请求用户匹配缩略表
	/*if(firstRequestTopMatchedUsers==true){
		requestTopMatchedUsers(userId,requestTopMUNum);
	}*/

	$("#showatloaded").show();//首页开始显示
	
	//获得一批推荐标签数据进行位置，大小和动画的设置
	var cpList = CP_list.cp_wrap;
	var notRepeatCpCount=0;//不重复的可以上升的cp个数
	
	//2017.09.13 叶夷  判断每一批请求相交的次数和哪几个圆相交
	var intersetCount=parseInt(Math.random()*2+1);//相交次数随机为1，2,3
	for(var count=1;count<=intersetCount;count++){
		intersetCPArray.push(parseInt(Math.random()*cpList.length));
	}
	
	for (var i = 0; i < cpList.length; i++) {
		var cp = cpList[i];//每个推荐标签
		var cpid=cp.cpid;//每个推荐标签id
		
		//加上一个过滤，前端出现过的cp不应该再出现
		var isRepeat=false;
		for(var j in cpValue){
			if(cpValue[j].getCpNode()==("cpid"+cpid)){//出现过
				console.log("cpid->"+cpid+" 标签重复出现")
				isRepeat=true;
				break;
			}
		}
		if(isRepeat==true){//cp重复出现则下一个
			continue;
		}else{//不是重复的cp则下一步
			notRepeatCpCount++;
			appendElement(i,cpid,cp);// 叶夷 2017.06.16
			// 如果直接将此方法中的代码放在此循环中，click()方法只会作用在循环最后的标签上，目前不知道原因？
		}
	}

	//一批标签个别相交之后数据清空
	intersetCPArray.splice(0,intersetCPArray.length);  
	
	// 定义好位置之后开始动画,参数是需要动画的不重复的可以上升的cp个数
	startAnimate(notRepeatCpCount);
	//推荐标签动画开始之后再将"请求下一批"的按钮显现
	$("#request_cp").show();
}

//叶夷 2017.06.16 通过服务器返回的标签添加到页面的方法
//i表示一批推荐标签的第几个标签
function appendElement(i, cpid,cp) {
	var cp_container = $("#cp-container");//装推荐标签的容器
	
	// 先随机推荐标签字体的大小，在这里留一个可以控制字体大小的入口
	var cpTextSize = Math.random() * 8 + 12;
	cpTextSize = parseInt(cpTextSize);
	
	var cp_node = $("<div></div>").attr("class", "cp").attr("id",
			"cpid" + cpid);// 外圆div
	var cp_innode = $("<div></div>").attr("class", "incp");// 内圆div
	cp_node.append(cp_innode);
	var cp_text = $("<div></div>");// 文字div
	cp_innode.append(cp_text);
	
	//2017.09.13  叶夷   在标签处再增加一个外圆，用来控制圆与圆之间的距离
	var cpNodeByDistance=$("<div></div>").attr("class", "outcp").attr("id","outcpid" + cpid);
	cpNodeByDistance.append(cp_node);
	
	
	// 先随机内圆 div的大小,在这里留一个可以控制内圆div大小的入口
	var cpInNodeWidth = Math.random() * 40 + 40;
	cpInNodeWidth = parseInt(cpInNodeWidth);
	cp_innode.css("height", cpInNodeWidth);
	cp_innode.css("width", cpInNodeWidth);
	
	//这是cp的选择人数
//	var selectTagNum =cp.howmanypeople_selected;
	var selectTagNum =parseInt(Math.random()*999)+1;
	
	//将标签的文字设置为字母和数字，为了测试匹配文字和数字和原型
	//calCircle(cp_text, cpTextSize, "CaraDelev...", cp_node, cp_innode);
	// 调用字体大小匹配圆大小的方法
	calCircle(i,cp_text, cpTextSize, cp.cptext, cp_node, cp_innode,selectTagNum,cpNodeByDistance);
	
	cpTestArray.push(CPTestObj(cpid, cp.cptext));//2017.09.14  叶夷    用来装页面存在过的cpid,为了性能测试
	
	cp_node.click(function() {
		// 点击每个显示的标签，标为选中，向后台发送选中请求。已选中的再点一次，标记取消，向后台发送请求
		chooseOneCP(cp_node,cp);
	});
	
	//标签圆大小确定之后将标签放在标签容器中
	cp_container.append(cpNodeByDistance);
	
	//标签大小设置之后将设置标签动画的轨迹且将前端出现过的标签位置全部保存下来
	//cpAnimationLocation(cp_container,cp_node);
	cpAnimationLocation(cp_container,cpNodeByDistance);
}

var minCPSize = 40;// 最小内圆的大小
var maxCPSize = 80;// 最大内圆的大小
var minCPTextSize = 12;// cp文字大小的最小值
var maxCPTextSize = 20;// cp文字大小的最大值
var maxCPTextNumber = 9;// cp文字最大的数量

//控制范围的方法
function sizeInMaxAndMin(size,max,min){
	var size;
	if (size > max) {
		size = max;
	} else if (size < min) {
		size = min;
	}
	return size;
}

// 叶夷 2017.06.30
// cp圆的大小与文字匹配,在分级的情况下计算相应文字的面积，然后计算圆的面积(这里还没想好怎么做：然后比较内圆大小，如果内圆不能装下文字，则扩大外圆)
//传入的参数是：cp文字div, cp文字大小，cp文字，外圆div，内圆div,再加上一个圆（用来判断标签之前的距离）
function calCircle(i,cp_text, cpTextSize, cpText, cp_node, cp_innode,selectTagNum,cpNodeByDistance) {
	//获得cp文字字符的长度
	var cpTextLength = length(cpText);

	// 控制cp文字的大小,范围在最小和最大之间
	cpTextSize=sizeInMaxAndMin(cpTextSize,maxCPTextSize,minCPTextSize);

	// 控制内圆div的大小,范围在最小和最大之间
	var cpInNodeWidth = cp_innode.width();// 内圆div的宽
	cpInNodeWidth=sizeInMaxAndMin(cpInNodeWidth,maxCPSize,minCPSize);

	// 控制cp文字显示的个数,超过最大个数则截断且加上"..."
	if (cpTextLength > maxCPTextNumber) {
		//cpText = subString(cpText, maxCPTextNumber, true);// 为true就是字符截断之后加上"..."
		cpText = cpText.substring(0,maxCPTextNumber)+"...";// 字符截断之后加上"..."
		cpTextLength = maxCPTextNumber + 1;
	}
	
	var cpTextWidth;// cp文字 div的宽
	var cpTextHeight;// cp文字 div的高
	
	// 分级列出文字的情况，求出cp文字 div的宽和高
	// 1-3个字为一行  //标签内容全为数字或者字母的情况，则为一行
	if (cpTextLength <= 3 || (isLetterOrNumber(cpText)==true)) {
		cpTextWidth = cpTextSize * cpTextLength;
		cpTextHeight = cpTextSize + 5;
	} else if (cpTextLength <= 10 && cpTextLength > 3) {// 4-10个字为两行
		if (cpTextLength % 2 == 0) {
			cpTextWidth = cpTextSize * (cpTextLength / 2);
		} else {
			cpTextWidth = cpTextSize * (cpTextLength / 2 + 1);
		}
		cpTextHeight = cpTextSize * 2 + (6 * 2);
		
		//分行情况下减小行之间的间距
		var cpTextLineHeight=cpTextHeight/2-3;
		cp_text.css("line-height", cpTextLineHeight + "px");
	}
	
	// 将cp文字div的大小设置
	cp_text.css("height", cpTextHeight + "px");
	cp_text.css("width", cpTextWidth + "px");
	cp_text.css("font-size", cpTextSize);
	cp_text.text(cpText);
	
	// 计算cp div的斜边的大小，即容纳其外圆的直径
	var hypotenuse = parseInt(Math.sqrt(Math.pow(cpTextHeight, 2)
			+ Math.pow(cpTextWidth, 2))) + 1;
	
	/*//2017.08.14 叶夷  加上标签的选择人数
	var selectTagNumNode;
	if(selectTagNum>0){
		selectTagNumNode= $("<div></div>").attr("class", "selectTagNum").text(selectTagNum);
		cp_node.append(selectTagNumNode);
		
		selectTagNumNode.css("font-size",cpTextSize+"px");
		selectTagNumNode.css("height", (cpTextSize+5) + "px");
		//加上了标签的选择人数外圆的大小增大
		if (cpInNodeWidth > hypotenuse){
			cpInNodeWidth=cpInNodeWidth+cpTextSize+5;
		}else{
			hypotenuse=hypotenuse+cpTextSize+5;
		}
	}*/
	
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
		var cpInNodeTop = (hypotenuse - cpInNodeWidth) / 2-1;
		cp_innode.css("top", cpInNodeTop);
		cp_innode.css("left", cpInNodeTop);

	}
	//文字位置调整
	cpTextTop = (cpInNodeWidth - cpTextHeight) / 2;
	cpTextLeft = (cpInNodeWidth - cpTextWidth) / 2;
	cp_text.css("top", cpTextTop);
	cp_text.css("left", cpTextLeft);
	
	//2017.09.13  叶夷    判断标签之前的距离，需要获得cp_node的大小，然后再加上一个随即距离则是最外面圆的大小
	var cpNodeWidth=cp_node.width();
	var randowDistance=cpNodeWidth*0.55;//这是标签之间的随机距离,根据自身的大小判断，再加上个别相交
	var isInterset=false;;
	for(var count=0;count<=intersetCPArray.length;count++){
		var intersetCP=intersetCPArray[count];
		if(i==intersetCP){
			isInterset=true;
			break;
		}
	}
	if(isInterset){
		randowDistance=-(cpNodeWidth*0.3);
	}
	
	var cpNodeByDistanceWidth=cpNodeWidth+randowDistance;
	cpNodeByDistance.css("width",cpNodeByDistanceWidth+"px");
	cpNodeByDistance.css("height",cpNodeByDistanceWidth+"px");
	
	//2017.09.13  叶夷    标签再加上一个圆之后居中
	if(cpNodeByDistanceWidth>cpNodeWidth){
		var cpNodeTop=parseInt((cpNodeByDistanceWidth-cpNodeWidth)/2);
		cp_node.css("top", cpNodeTop+"px");
		cp_node.css("left", cpNodeTop+"px");
	}
}

//叶夷 2017.08.22 判断标签是否全为数字或者字母
function isLetterOrNumber(cpText) {
	var isLetterOrNumber=true;
	var cpLength=cpText.length;
	for (var i = 0; i <cpLength; i++) {
		if ((cpText.charCodeAt(i) >=97 && cpText.charCodeAt(i) <=122)//小写字母
				|| (cpText.charCodeAt(i) >= 48 && cpText.charCodeAt(i) <= 57)//数字
				|| (cpText.charCodeAt(i) >= 65 && cpText.charCodeAt(i) <= 90)) {//大写字母
			isLetterOrNumber=true;
		} else {
			isLetterOrNumber=false;
			break;
		}
	}
	return isLetterOrNumber;
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
/**定义一个cp类  cpid,cp位置left，cp位置right...*/
function CP(cpNode, cpLeft, cpRight, cpTop, cpBottom) {
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

// 叶夷 2017.06.27 实现圆切面的上升动画效果,cp_container是装所有推荐标签的容器，cp_node是一个推荐标签
function cpAnimationLocation(cp_container,cp_node) {
	var cpWidth = cp_node.width();// 要上升的标签宽
	var cpHeight = cp_node.height();// 要上升的标签高
	var containerWidth = cp_container.width();// 装cp容器的宽度，即扫描轨迹的x轴的总数

	var top = -1;// 标签的top,用来和不同轨迹对比，将数值最大的赋值给top,可以知道标签可上升的最大高度
	var left = 0;// 得到标签可上升的最大高度时left位置

	// 1.遍历装cp容器的宽度,每次+1px
	// start是要上升的cp的left的值，所以终点必须空出上升cp的width
	var startLength=cp_node.find(".cp").width();
	if(startLength<cpWidth){
		startLength=cpWidth;
	}
	for (var start = 10; start <= containerWidth - startLength-10; start++) {
		// 2.从开始获得上升cp的圆心坐标和半径，以cp_container的左下点为(0,0)
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
			var cpObj = cpValue[j];//存在的cp
			var cpNode = cpObj.getCpNode();//存在的cpid
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
		// bottom值越大越低，要从大到小排序，获得轨迹内已经存在的cp中两个最低的圆
		cpTwo.sort(function(a, b) {
			return b.getCpBottom() - a.getCpBottom();
		});

		var maxTop;//可以上升的Top值
		var isOverLay = false;// 判断是否重叠
		if (cpTwo.length > 0) {
			// 5.拿出轨迹内cp最低的圆,即cpTwo数组中的第一个
			var cpFirstObj = cpTwo[0];
			// 6.计算与cpFirstObj能够相切时的位置,cpRadius是上升的cp半径，cpX是上升的cp圆心的x值
			maxTop = calCPTangencyTop(cpFirstObj, cpRadius, cpX);// 在不和轨迹中最低点重合的情况下可以上升的Top值
			//遍历轨迹中所有的圆，一旦会跟标的圆重合，则这条轨迹放弃
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
	
	var right,bottom;
	right = left + cpWidth;
	bottom = top + cpHeight;
	cpValue.push(new CP(cp_node.attr("id"), left, right, top, bottom));
	//cp容器的高度调整
	cp_container.height(bottom);
}

/**叶夷 2017.06.28 定义好位置之后开始动画,参数是需要动画的个数*/
function startAnimate(length) {
	for (var j = cpValue.length - 1; j > cpValue.length - length - 1; j--) {//只需要从需要动画的cp个数开始上升，已经在前端的cp不动
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

// 计算与圆相切时的top值，上升轨迹下最低的标签,cpRadius是上升的cp半径，cpX是上升的cp圆心的x值
function calCPTangencyTop(cpObj, cpRadius, cpX) {
	// 6.计算与cpFirstObj能够相切时的位置
	var cpObjNode = cpObj.getCpNode();
	//console.log("测试4："+cpObjNode);
	var cpObjRadius = $("#" + cpObjNode).width() / 2;// 已有cp的半径
	var cpObjLeftValue = cpObj.getCpLeft();// 获得已有cp的最左边边界值
	var cpObjTopValue = cpObj.getCpTop();
	var cpObjX = cpObjLeftValue + cpObjRadius;// 圆心的x轴
	var cpObjY = cpObjTopValue + cpObjRadius;// 圆心的y轴
	//console.log("测试 3："+cpObjY+"->"+cpRadius+"->"+cpObjRadius+"->"+cpX+"->"+cpObjX);
	//371.5->34->46.5->195->113.5
	
	// 上升的cp在轨迹内可以与其相切的y值
	var cpTangencyY = cpObjY
			+ parseInt(Math.sqrt(parseInt(Math.pow((cpRadius + cpObjRadius), 2))
					- parseInt(Math.pow((cpX - cpObjX), 2))));
	var cpTangencyTop = cpTangencyY - cpRadius + 1;// 可以上升的Top值
	return parseInt(cpTangencyTop);
}

// 叶夷 2017.06.16 点击每个显示的标签，标为选中，向后台发送选中请求。已选中的再点一次，标记取消，向后台发送请求
function chooseOneCP(cp_node,cp) {
	var cpid = cp.cpid;
	var text=cp.cptext;
	chooseCP(cp_node,cpid,text);
}

function chooseCP(cp_node,cpid,text){
	console.log(cpid +":"+text+ "-> 选中状态");
	
	cp_node.unbind();//不可点击
	showSelectTag(cpid,text);
	sendSelectCP(userId, cpid,text);
}

//叶夷  2017.08.08 选中的标签添加到我的标签框中
function showSelectTag(cpid,text){
	//var cpid=data.cpid;
	//var text=data.cptext;
	//2017.09.14  叶夷  为了性能测试将选择标签的显示控制在4行以内
	if(lineNumber<=3){
		addMyCp(cpid,text);
		//2017.08.29   叶夷    选择标签加上动画效果，标签上升到“我的标签”容器中
		var myTag=$("#mytag"+cpid);
		var animateCp=$("#outcpid"+cpid).clone();
		if(animateCp.length>0){//这是点击选中添加标签
			$("#showatloaded").append(animateCp);
			//var animateCpStartTop=parseInt($("#top-container").height())+parseInt(animateCp.css("top"))+10;
			//console.log("测试："+$("#cp-show").scrollTop());
			var animateCpStartTop=parseInt($("#top-container").height())+animateCp.offset().top-$("#cp-show").scrollTop()+10;
			animateCp.css("top",animateCpStartTop);
			var animateCpEndTop=myTag.offset().top;
			var animateCpEndLeft=myTag.offset().left;
			myTag.hide();
			animateCp.animate({
				left:animateCpEndLeft+"px",
				top : animateCpEndTop+"px"
			}, {
				duration :1000
			});
			timeOutSuccess = setTimeout(function() {
				animateCp.remove();
				myTag.show();
				$("#cpid"+cpid).css("opacity", "0.2");//推荐标签变暗
				$("#cpid"+cpid).css("cursor", "auto");//点击小手不见
			},1000);
		}
		
		console.log("选中标签成功");
		toast_popup("选中标签成功",2500);
	}else{
		toast_popup("标签选择超过限制",2500);
	}
}

//判断选择过的标签有多少行，从而判断选择过标签的框的height
var lineNumber=2;

function addMyCp(cpid,text){
	var myTagContainer=$("#mytag-container");
	var myTag = $("<div></div>").attr("class", "mytag").attr("id", "mytag"+cpid).text(text);
	myTagContainer.append(myTag);
	
	myTag.click(function(){
		sendUnSelectCP(cpid);
	});
	
	var myTagTextLength = length(text);
	var myTagTextSize = parseInt(myTag.css("font-size"))+1;
	var myTagWidth=myTagTextLength*myTagTextSize+20;
	var myTagHeight=myTagTextSize*2-4;
	
	//每个我选择的标签的大小适配
	myTag.css("width", myTagWidth+"px");
	myTag.css("height", myTagHeight+"px");
	myTag.css("line-height", myTagHeight+"px");
	
	//随时在我的标签后面加上“+”
	$("#addtag").remove();
	var addTag=$("<div style='width:"+(myTagTextSize+20)+"px;height:"+myTagHeight+"px;line-height:"+myTagHeight+"px;' onclick='addTag()'></div>").attr("class","mytag add").attr("id","addtag").text("+");
	myTagContainer.append(addTag);
	
	//装我选择的标签的容器高度适配，一开是只需要能显示两行我选择的标签的高度,并且不同屏幕的大小随着我的标签框的高度的变化其他框的高度也要发生变化
	var myTagMarginTop=parseInt(myTag.css("margin-top"));
	
	//通过添加标签按钮是否超过容器的高度，超过则将容器扩大一行
	var topContainerHeight=$("#top-container").height();
	//console.log("测试:"+$("#addtag").offset().top);
	var addTagBottom=$("#addtag").offset().top+myTagHeight;
	if((topContainerHeight-addTagBottom)<0){//超过空间
		++lineNumber;
	}
	
	var myTagContainerHeight;
	if(lineNumber<=2){//小于两行
		myTagContainerHeight=myTagHeight*2+myTagMarginTop*3;
	}else{
		myTagContainerHeight=(myTagHeight+myTagMarginTop)*lineNumber+10;
	}
	
	//我的标签框高度改变了之后影响其他部分的高度
	myTagContainerHeightChange(myTagContainer,myTagContainerHeight);
}
/**
 * 我的标签框高度改变了之后影响其他部分的高度
 * @param myTagContainer   我的标签框
 * @param headerContainerHeight  改变的高度
 */
function myTagContainerHeightChange(myTagContainer,myTagContainerHeight){
	var headerContainerHeight=parseInt($("#header-container").css("height"));
	$("#header-container").css("height",headerContainerHeight+"px");
	myTagContainer.css("height",myTagContainerHeight+"px");
	$("#top-container").css("height",(headerContainerHeight+myTagContainerHeight+20)+"px");
	var showatloadedHeight=parseInt($("#showatloaded").css("height"));
	var tagContaiderTop=parseInt($("#tag-container").css("top"));
	$("#tag-container").css("height",(showatloadedHeight-headerContainerHeight-myTagContainerHeight-tagContaiderTop)+"px");
}

//叶夷  2017.08.08 取消选中的标签
function showUnSelectCP(data){
	var addtag=$("#addtag");
	//获得点击取消选择标签时位置变化之前的添加标签的top值
	var addTagBottom1=addtag.offset().top
	
	var cpid=data.cpid;
	var cp_node=$("#cpid"+cpid);
	var text=cp_node.find(".incp").text();
	console.log(cpid + "-> 取消选择");
	cp_node.css("opacity", "1");
	cp_node.css("cursor", "pointer");
	$("#mytag"+cpid).remove();
	
	//取消的时候将高度还原
	//获得点击取消选择标签时位置变化之后的添加标签的top值
	var addTagBottom2=addtag.offset().top
	var myTagMarginTop=parseInt(addtag.css("margin-top"));
	var myTagHeight=addtag.height();
	var tagChangeHeight=myTagHeight+myTagMarginTop;
	var myTagContainerHeight;
	if(lineNumber<=2){//小于两行
		myTagContainerHeight=myTagHeight*2+myTagMarginTop*3;
	}else{
		if(addTagBottom1-addTagBottom2>=tagChangeHeight){//已经少了一行
			--lineNumber;
		}
		myTagContainerHeight=(myTagHeight+myTagMarginTop)*lineNumber+10;
	}
	var addTagBottom=addtag.offset().top+addtag.height()-$("#header-container").height();
	//我的标签框高度改变了之后影响其他部分的高度
	myTagContainerHeightChange($("#mytag-container"),myTagContainerHeight);
	
	//将取消选择的标签重新绑定点击事件
	cp_node.click(function() {
		chooseCP(cp_node,cpid,text);
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
var muDataQueue = new Array();//mpDataQueue
var circleEnd = true;// 判断动画是否运行完

//2017.07.04 叶夷 模拟数据的产生 
function addMPData(){ 
	var newMatchedUserArr=new Array();//装后台发来的匹配人 
	var mpId=new Array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15);//模拟的匹配人ID 
	var mpImg=new Array("http://q.qlogo.cn/qqapp/1104713537/3F9C443766C40F04801FD0FECD24DF07/40",
						"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_669143375538163712/jpg/image",
						"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_671612515800715264/jpg/image",
						"http://q.qlogo.cn/qqapp/1104713537/5610B8A29AD893CB93284098C11549C8/40",
						"http://42.121.136.225:8888/user-pic2.jpg",
						"http://q.qlogo.cn/qqapp/1104713537/9DB80ECB26EB4571E6F176543D4DEFD4/40",
						"http://q.qlogo.cn/qqapp/1104713537/2CD480E191D757CFF15536FC6B655176/40",
						"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_708988162394951680/jpg/image",
						"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_670182701776637952/jpg/image",
						"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_720907019216883712/jpg/image",
						"http://qzapp.qlogo.cn/qzapp/101100198/B7EFA63630DFBA0132869E384E00D1E3/50",
						"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_728576337777922048/jpg/image",
						"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_791931253833207808/jpeg/image",
						"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_840229151767138304/jpg/image",
						"http://www.mxunta.so:80/xunta-web/useravatar/thumb_img_767240700042547200/jpg/image");//模拟的匹配人头像，目前用颜色代替
	
	//判断是实时改变的匹配人头像还是一开始请求的匹配人头像
	if(muNowData.length!=10){//一开始请求的匹配人头像
		for(var j=0;j<15;j++){
			newMatchedUserArr.push(new MatchPeople(mpId[j],mpImg[j]));
		}
	}else{//是实时改变的匹配人头像
		var temp=parseInt(Math.random()*15);
		for(var i=0;i<15;i++){
			newMatchedUserArr.push(new MatchPeople(mpId[temp],mpImg[temp]));
			temp++;
			if(temp==15){
				temp=0;
			}
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
	if (muNowData.length == 0) {// 如果是用户一开始上线，匹配人列表没有
		//2017.09.06  叶夷     matchedUserArr.length改成现有的匹配人div的数量，因为匹配人数量有可能比这个数量少,会导致后面的对比产生null异常
		var muLength=$(".mu").length;
		for (var i = 0; i < muLength; i++) {
			muAddImg(i,matchedUserArr);
		}
	} else {// 用户在操作过程中匹配人列表发生改变
		var i = 0;

		// 2017.07.05 叶夷 一一对比之后开始将排名改变的用户动画
		circleAnimation(i, matchedUserArr);
	}
}

//2017.08.23 叶夷  将匹配人div加上头像图片
function muAddImg(i,matchedUserArr){
	var muNode;
	if(matchedUserArr[i]!=null){
		muNode=$("#mu"+(i+1));//这是已经放在页面的匹配人头像div
		
		var muId=matchedUserArr[i].getMpId();//获得匹配人列表的匹配人id,这是测试数据版
		//var muId = matchedUserArr[i].userid;// 获得匹配人列表的匹配人id
		 
		var muImg=matchedUserArr[i].getMpImg();//获得匹配人列表的匹配人头像,这是测试版数据
		//var muImg = matchedUserArr[i].img_src;// 获得匹配人列表的匹配人头像
		//var muUserName=matchedUserArr[i].username;
		
		var muWidth=muNode.css("width");
		var muNodeImg=$("<img src='"+muImg+"'/>").css("width",muWidth).css("height",muWidth);
		muNode.append(muNodeImg);
		muNode.attr("id","mu"+muId);
		//点击事件
		muNode.click(function() {
			//进入聊天页
			enterDialogPage(muId,muUserName);
			//addMPData();//测试匹配人动画
		});
	}else{
		muNode=$(".mu").eq(i);
	}
	
	muNowData.push(muNode);
	
	//2017.09.13  叶夷    将匹配人随机放置且不能相交
	
}

//2017.08.23 叶夷  生成一个新的匹配人div
function muDiv(id,muImg,muUserName,top,left){
	var muNode=$("<div></div>").attr("id","mu"+id).attr("class","mu");//这是页面的匹配人头像div
	var muNodeImg=$("<img src='"+muImg+"' style='width:0px;height:0px;'/>");
	muNode.append(muNodeImg);
	$(".header-container").append(muNode);
	muNode.css("top",top);
	muNode.css("left",left);
	muNode.css("width","0px");
	muNode.css("height","0px");
	
	//点击事件
	muNode.click(function() {
		//进入聊天页
		enterDialogPage(id,muUserName);
		//addMPData();//测试匹配人动画
	});
}

//2017.08.23 叶夷 在新排名和原有位置的mp之间的匹配人,这些匹配人移动
function muMove(i,muNowPosition){
	for (var k = i; k < muNowPosition; k++) {
		var moveMu = muNowData[k];// 需要移动的mp
		var moveEndLeft = muNowData[k + 1].css("left");// 移动的目的地，
		var moveEndTop = muNowData[k + 1].css("top");
		var moveEndWidth = muNowData[k + 1].css("width");
		// 即下一个mp的位置
		animateForMu(moveMu, moveEndLeft,moveEndTop, aniSecond* 0.4);
		animateForSize(moveMu, moveEndWidth, aniSecond * 0.4);// 大小也改变
	}
}

//2017.08.23 叶夷   所有位置移动之后mpNowData数组的位置也要更新
function mpNowDataUpdate(muNowPosition,temp,i){
	for (var k = muNowPosition; k >= i; k--) {
		if (k == i) {
			muNowData[k] = temp;
		} else {
			muNowData[k] = muNowData[k - 1];
		}
	}
}

//2017.08.24 叶夷   需要变换位置的mp向左移动,这里为了实现曲线移动，可以一个圆一个圆的位置移动
function muCurveMove(i,muNowPosition,changeMu){
	for (var k = muNowPosition; k >i; k--) {
		var moveEndLeft = muNowData[k - 1].css("left");// 移动的目的地，
		var moveEndTop = muNowData[k - 1].css("top");
		animateForMu(changeMu, moveEndLeft,moveEndTop,  aniSecond* 0.4/(muNowPosition-i) );
	}
}

//2017.08.24 叶夷 获得现有mp中应该去除的排名，则在新排名中没有的mp
function getMuNowPositionNewNotExist(i,matchedUserArr){
	var muNowPositionNewNotExist;// 这个位置的前端匹配人在新排名里不存在
	// 3.获得现有mp中应该去除的排名，则在新排名中没有的mp,且将它缩小
	for (var index = i; index < muNowData.length; index++) {
		var exist = false;// 表示在前端的数据中在新排名里面没有
		for (var j = i; j < matchedUserArr.length; j++) {
			if(muNowData[index].attr("id")==matchedUserArr[j].getMpId()){//表示在前端的数据中在新排名里面有,这是测试版
			//if (muNowData[index].attr("id") == matchedUserArr[j].userid) {// 表示在前端的数据中在新排名里面有
				exist = true;
				break;
			}
		}
		if (!exist) {
			muNowPositionNewNotExist = index;
			break;
		}
	}
	return muNowPositionNewNotExist;
}

var aniSecond = 2;// 动画的速度，即距离/秒数，37px/s
var isTimeOut = 0;// 判断是否延时，让排名改变需要动画时才延时，isTimeOut=1,如果排名没有改变不需要延时，isTimeOut=0;

// 2017.07.05 叶夷 一一对比之后开始将排名改变的用户动画
function circleAnimation(i, matchedUserArr) {
	//var muserid = matchedUserArr[i].userid;// 这是匹配人id
	var muserid=matchedUserArr[i].getMpId();//这是匹配人id,这是测试版数据

	var muserimg=matchedUserArr[i].getMpImg();//这是匹配人头像,这是测试数据
	//var muserimg = matchedUserArr[i].img_src;// 这是匹配人头像
	//var muUserName=matchedUserArr[i].username;

	if (("mu"+muserid) != muNowData[i].attr("id")) {// 排名改变
		circleEnd = false;// 只要动画开始执行则动画没有完成
		isTimeOut = 1;// 让排名改变需要动画时才延时

		var exist = false;// 表示后台传来的数据是新数据
		var muNowPosition;// 表示如果从后台新来的数据在前台存在但是排名有所改变时前台存在的排名
		for (var j = i; j < muNowData.length; j++) {// 遍历现有的头像
			if (("mu"+muserid) == muNowData[j].attr("id")) {
				exist = true;// 表示后台传来的数据不是新数据，已经存在
				muNowPosition = j;
				break;
			}
		}
		
		//发生变化的排名的参数
		var moveLeft = muNowData[i].css("left");// 需要向左移动的目的地的位置,在这个位置移动之前先保存下来
		var moveTop = muNowData[i].css("top");
		var moveWidth = muNowData[i].css("width");
		
		if (exist) {// 存在,则原有位置的mp缩小，其左边的且没超过新排名名次的mp向右移动，原有位置的mp缩小之后移动到该有的位置
			// 1.需要变换位置的mp缩小
			var changeMu = muNowData[muNowPosition];// 需要移动的mp
			
			//animateForSize(changeMu, 10, aniSecond * 0.3);// 缩小

			// 2.首先判断在新排名和原有位置的mp之间的匹配人,这些匹配人移动
			muMove(i,muNowPosition);

			// 3.需要变换位置的mp向左移动,这里为了实现曲线移动，可以一个圆一个圆的位置移动
			muCurveMove(i,muNowPosition,changeMu);
			
			// 4.需要变换位置的mp到了位置之后再变大
			animateForSize(changeMu, moveWidth, aniSecond * 0.4);// 扩大

			// 5.所有位置移动之后mpNowData数组的位置也要更新
			var temp = muNowData[muNowPosition];// 临时位置，用来保存
			mpNowDataUpdate(muNowPosition,temp,i);
			
		} else {// 不存在
			// 2017.07.06 叶夷
			// 1.将页面不存在的mp
			muDiv(muserid,muserimg,muUserName,moveTop,moveLeft);
			var newMu=$("#mu"+muserid);

			// 2.获得现有mp中应该去除的排名，则在新排名中没有的mp,且将它缩小
			var muNowPositionNewNotExist=getMuNowPositionNewNotExist(i,matchedUserArr);// 这个位置的前端匹配人在新排名里不存在
			/*animateForSize(muNowData[muNowPositionNewNotExist], 0,
					aniSecond * 0.4);// 缩小*/			
			//缩小之后，匹配人在前端界面中删除
			$("#"+muNowData[muNowPositionNewNotExist].attr("id")).remove();

			// 3.将新的mp位置与现有mp中应该去除的排名位置之间的mp向右移
			muMove(i,muNowPositionNewNotExist);

			// 4.新的mp变大
			animateForSize(newMu, moveWidth, aniSecond * 0.4);// 扩大

			// 5.所有位置移动之后mpNowData数组的位置也要更新
			mpNowDataUpdate(muNowPositionNewNotExist,newMu,i);
		}
	}

	i += 1;
	// 这里是为了做一次动画延时操作和解决每批匹配人变化的动画不丢失
	timeOutAndMuDataQueue(i,matchedUserArr);
}

//2017.08.24 叶夷   这里是为了做一次动画延时操作和解决每批匹配人变化的动画不丢失
function timeOutAndMuDataQueue(i,matchedUserArr){
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
		}, aniSecond  * 1000 * isTimeOut);
	}
	isTimeOut = 0;// 是否延时调整回最初状态;
}

// 匹配人头像移动,即改变top和left值
function animateForMu(muDiv, muLeft,muTop, second) {// 移动的物体，移动的目的地，移动的时间
	muDiv.animate({
		left : muLeft,
		top : muTop
	}, second * 1000);
}

// 匹配人头像缩小或者放大
function animateForSize(muDiv, muSize, second) {// 移动的物体，变化的大小，移动的时间
	muDiv.css("width",muSize);
	muDiv.css("height",muSize);
	muDiv.find("img").animate({
		width : muSize,
		height : muSize
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
}

//2017.08.09  叶夷  添加标签之后的显示
function addCpShow(data){
	var suggestWrap=$("#gov_search_suggest")
	
	var cpid=data.msg.insertId;
	var mgs2=data.msg2;//判断是否重复添加
	var text = $("#pop_tagName").val();
	
	if(mgs2==undefined){//添加的标签不存在
		showSelectTag(cpid,text);
		sendSelectCP(userId,cpid,text);
    	console.log("添加标签成功");
    	toast_popup("添加标签成功",2500);
    	closePop();//添加标签框关掉
	}else{//添加的标签存在
		cpid=data.msg[0].id;
		sendIfSelectedCP(userId,cpid);
	}
	$("#htmlObj").css("height","100px");
	suggestWrap.hide();
}

function unreadMsg(){
	var unreadParent=$("#enterdialogList");
	if (unreadParent.find('.unread').length==0) {//如果没有未读消息,则加上一个1;
		var unreadNum = $("<div></div>").attr("class", "unread").text("1");
		unreadParent.append(unreadNum);
	} else {//如果已有未读消息,则加上1:
		var num = unreadParent.find('.unread').text();
		num++;
		unreadParent.find('.unread').text(num);
	}
}

function showUnreadNum(){
	var unreadNum=parseInt(Math.random() * 10) ;
	if(unreadNum>0){
		var unreadParent=$("#enterdialogList");
		var unreadNum = $("<div></div>").attr("class", "unread").text("1");
		unreadParent.append(unreadNum);
	}
}

//2017.08.23 叶夷   匹配人位置根据屏幕调整
function showMatchedUsers(){
	//如今的装匹配人的宽高
	var headerContainerHeight=parseInt($(".header-container").css("height"));
	var headerContainerWidth=parseInt($(".header-container").css("width"));
	
	//用来对比的装匹配人的宽高
	var contrastWidth=375;
	var contrastHeight=129.59;
	
	//放大或缩小的比例
	var proportionWidth=headerContainerWidth/contrastWidth;
	var proportionHeight=headerContainerHeight/contrastHeight;
	
	for(var i=1;i<=15;i++){
		var muNode=$("#mu"+i);
		var newMuTop=parseInt(muNode.css("top"));
		var newMuLeft=parseInt(muNode.css("left"));
		var newMuWidth=parseInt(muNode.css("width"));
		
		var changeMuTop=newMuTop*proportionHeight;
		var changeMuLeft=newMuLeft*proportionWidth;
		var changeMuWidth=newMuWidth*proportionWidth;
		
		muNode.css("top",changeMuTop+"px");
		muNode.css("left",changeMuLeft+"px");
		muNode.css("width",changeMuWidth+"px");
		muNode.css("height",changeMuWidth+"px");
	}
}

/**
 * 2017.09.11  叶夷   cp选择失败，加上感叹号重新选择
 */
function sendSelectedCPFail(cpid,text){
	//1.在我的标签上加感叹号
	var mytag=$("#mytag"+cpid);
	var myTagFaildImg=$("<img />").attr("src", "../image/acclaim-50x173.png").attr("class","myTagFail");
	mytag.append(myTagFaildImg);
	
	//2.将我的标签的点击事件绑定为选择标签
	mytag.unbind();
	var cp_node=$("#cpid"+cpid);
	mytag.click(function(){
		chooseCP(cp_node,cpid,text);
	});
}

/**
 * 2017.09.11  叶夷   cp选择成功，绑定上取消点击标签的点击事件
 */
function myTagAgainBindingClick(cpid){
	var mytag=$("#mytag"+cpid);
	myTagFail=mytag.find(".myTagFail");
	if(myTagFail.length>0){//只有选择标签出错时
		myTagFail.remove();
		mytag.click(function(){
			sendUnSelectCP(cpid);
		});
	}
}

/**
 * 2017.09.14  叶夷   "选中标签"性能测试
 */
var cpTestArray=new Array();//用来装页面存在过的cpid
function testSelectTag(){
	if(cpTestArray.length>0){
		for(var i in cpTestArray){
			var cpid=cpTestArray[i].getCpid();
			var text=cpTestArray[i].getText();
			//var cp_node=$("cpid"+cpid);
			sendSelectCP(userId, cpid,text);
		}
	}
	cpTestArray.splice(0,cpTestArray.length);
	requestCP(userId,requestCPNum,(requestCPNum*(currentRequestedCPPage++)));
	
	timeOutSuccess = setTimeout(function() {
		testSelectTag();
	},1000);
}
function CPTestObj(cpid, text) {
	var obj = new Object();
	obj.cpid = cpid;
	obj.text = text;
	obj.getCpid = function() {
		return this.cpid;
	};
	obj.getText = function() {
		return this.text;
	};
	return obj;
}
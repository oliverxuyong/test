function wsConnect() {
	execRoot("checkIfWSOnline4Signal()");
}

// 2017.09.13 叶夷 定义一个数组装哪几个圆相交
var intersetCPArray=new Array();
// 2017.10.17 叶夷  用一个变量表示标签是否请求成功,true为成功，false为不成功
var requestCPSuccese=false;

// 叶夷 2017.06.15 将从服务端的标签显示出来
function responseToCPRequest(CP_list) {// 显示从服务器获得的话题列表: 这段代码出现在旧版本，因版本错乱出现在这里
	// 叶夷 2017.07.11 等请求cp返回之后再请求用户匹配缩略表
	 if(firstRequestTopMatchedUsers==true){
		 requestTopMatchedUsers(userId,requestTopMUNum); 
		 //addMPData();
	 }
	 
	$("#showatloaded").show();// 首页开始显示
	
	// 获得一批推荐标签数据进行位置，大小和动画的设置
	var cpList = CP_list.cp_wrap;
	var notRepeatCpCount=0;// 不重复的可以上升的cp个数
	
	// 2017.09.13 叶夷 判断每一批请求相交的次数和哪几个圆相交
	var intersetCount=parseInt(Math.random()*2+1);// 相交次数随机为1，2,3
	for(var count=1;count<=intersetCount;count++){
		intersetCPArray.push(parseInt(Math.random()*cpList.length));
	}
	
	for (var i = 0; i < cpList.length; i++) {
		var cp = cpList[i];// 每个推荐标签
		var cpid=cp.cpid;// 每个推荐标签id
		
		// 加上一个过滤，前端出现过的cp不应该再出现
		var isRepeat=false;
		for(var j in cpValue){
			if(cpValue[j].getCpNode()==("outcpid"+cpid)){// 出现过
				console.log("cpid->"+cpid+" 标签重复出现")
				isRepeat=true;
				break;
			}
		}
		if(isRepeat==true){// cp重复出现则下一个
			continue;
		}else{// 不是重复的cp则下一步
			notRepeatCpCount++;
			appendElement(i,cpid,cp);// 叶夷 2017.06.16
			// 如果直接将此方法中的代码放在此循环中，click()方法只会作用在循环最后的标签上，目前不知道原因？
		}
	}
	
	requestCPSuccese=true;//表示标签请求成功，下面的滑倒底部的方法才可以执行请求下一批标签

	// 判断是否测试
	if(startTest){
		testSelectTag();
	}
	
	// 一批标签个别相交之后数据清空
	//intersetCPArray.splice(0,intersetCPArray.length);  
	
	// 定义好位置之后开始动画,参数是需要动画的不重复的可以上升的cp个数
	startAnimate(notRepeatCpCount);
	// 推荐标签动画开始之后再将"请求下一批"的按钮显现
	$("#request_cp").show();
	$("#request_cp").html("<div>+</div><div>更多标签</div>");
	
	//进入聊天列表显示
	$("#enterdialogList").show();
	//推荐标签遮住滑动条显示
	/*$("#background-rightbar").show();
	//调整滚动条宽度
	console.log("测试2："+document.getElementById("cp-show").offsetWidth
			+" "+document.getElementById("cp-show").scrollWidth);
	var scollWidth=document.getElementById("cp-show").offsetWidth-document.getElementById("cp-show").scrollWidth+2;
	if(scollWidth>2){
		$("#background-rightbar").css("width",scollWidth);
	}*/
	//$("#background-rightbar-mytag").css("width",scollWidth);
}

//2017.10.12 叶夷   标签的完整文字内容,cpid为键，文字为值
var fullTextArray=new Array();

// 叶夷 2017.06.16 通过服务器返回的标签添加到页面的方法
// i表示一批推荐标签的第几个标签
function appendElement(i, cpid,cp) {
	var cp_container = $("#cp-container");// 装推荐标签的容器
	
	// 这是cp的选择人数
	var selectTagNum =cp.howmanypeople_selected;
	//var selectTagNum =parseInt(Math.random()*999)+1;
	
	// 先随机推荐标签字体的大小，在这里留一个可以控制字体大小的入口
	/*var cpTextSize = Math.random() * 8 + 12;
	cpTextSize = parseInt(cpTextSize);*/
	var cpTextSize =controlSize(selectTagNum,maxCPTextSize,minCPTextSize);
	
	var cp_node = $("<div></div>").attr("class", "cp").attr("id",
			"cpid" + cpid);// 外圆div
	var cp_innode = $("<div></div>").attr("class", "incp");// 内圆div
	cp_node.append(cp_innode);
	var cp_text = $("<div></div>");// 文字div
	cp_innode.append(cp_text);
	
	//将选择人数放入标签中
	var selectTagNumText=selectTagNum;
	if(selectTagNum>999){
		selectTagNumText=999+"+";
	}
	var selectTagNumNode= $("<div></div>").attr("class",
	"mytag-selectednumber").attr("id","selectTagNum"+cpid).text(selectTagNumText); 
	cp_node.append(selectTagNumNode);
	
	// 2017.09.13 叶夷 在标签处再增加一个外圆，用来控制圆与圆之间的距离
	var cpNodeByDistance=$("<div></div>").attr("class", "outcp").attr("id","outcpid" + cpid);
	cpNodeByDistance.append(cp_node);
	
	
	// 先随机内圆 div的大小,在这里留一个可以控制内圆div大小的入口
	//var cpInNodeWidth = Math.random() * 40 + 40;
	//cpInNodeWidth = parseInt(cpInNodeWidth);
	var cpInNodeWidth =controlSize(selectTagNum,maxCPSize,minCPSize);
	cp_innode.css("height", cpInNodeWidth);
	cp_innode.css("width", cpInNodeWidth);
	
	//判断是否需要相交
	var isInterset=false;;
	for(var count=0;count<=intersetCPArray.length;count++){
		var intersetCP=intersetCPArray[count];
		if(i==intersetCP){
			isInterset=true;
			intersetCPArray[count]=cpid;
			break;
		}
	}
	//标签文字完整内容保存
	fullTextArray[cpid]=cp.cptext;
	// 测试字数超过九个字的显示
	//calCircle(cp_text, cpTextSize, "今天上海很冷要多穿衣服", cp_node, cp_innode,selectTagNum,cpNodeByDistance,selectTagNumNode,isInterset);
	// 调用字体大小匹配圆大小的方法
	calCircle(cp_text, cpTextSize, cp.cptext, cp_node, cp_innode,cpInNodeWidth,selectTagNum,cpNodeByDistance,selectTagNumNode,isInterset);
	
	cpTestArray.push(CPTestObj(cpid, cp.cptext));// 2017.09.14 叶夷
													// 用来装页面存在过的cpid,为了性能测试
	
	cp_innode.click(function() {
		// 点击每个显示的标签，标为选中，向后台发送选中请求。已选中的再点一次，标记取消，向后台发送请求
		chooseOneCP(cp_node,cp);
	});
	
	// 标签圆大小确定之后将标签放在标签容器中
	cp_container.append(cpNodeByDistance);
	
	// 标签大小设置之后将设置标签动画的轨迹且将前端出现过的标签位置全部保存下来
	// cpAnimationLocation(cp_container,cp_node);
	cpAnimationLocation(cp_container,cpNodeByDistance,cpValue);
}

var minCPSize = $("body").width()/8;// 最小内圆的大小
var maxCPSize = 100;// 最大内圆的大小
var minCPTextSize = 12;// cp文字大小的最小值
var maxCPTextSize = 20;// cp文字大小的最大值
var maxCPTextNumber = 9;// cp文字最大的数量
var maxselectTagNum = 10;// 影响标签大小的选择人数最小的数量
var minselectTagNum = 1;// 影响标签大小的选择人数最大的数量
/**叶夷  2017.10.10  控制文字大小和内圆大小的方法*/
function controlSize(selectTagNum,maxSize,minSize){
	//2017.10.20 给选择人数加上范围的限制
	if(selectTagNum>maxselectTagNum){
		selectTagNum=maxselectTagNum;
	}
	
	var sectionSize=maxSize-minSize;//大小的范围
	var sectionSelectTagNum=maxselectTagNum-minselectTagNum;//选择人数的范围
	var space=sectionSelectTagNum/sectionSize;//这是选择人数和大小范围之间的比例
	var endSize=selectTagNum/space+minSize;//这是最终的大小
	return endSize;
}

// 控制范围的方法
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
// 传入的参数是：cp文字div, cp文字大小，cp文字，外圆div，内圆div,选择的人数，再加上一个圆div（用来判断标签之前的距离）,选择人数div,判断是否相交
function calCircle(cp_text, cpTextSize, cpText, cp_node, cp_innode,cpInNodeWidth,selectTagNum,cpNodeByDistance,selectTagNumNode,isInterset) {
	// 获得cp文字字符的长度
	var cpTextLength = length(cpText);

	// 控制cp文字显示的个数,超过最大个数则截断且加上"..."
	if (cpTextLength > maxCPTextNumber) {
		// cpText = subString(cpText, maxCPTextNumber, true);//
		// 为true就是字符截断之后加上"..."
		cpText = cpText.substring(0,maxCPTextNumber)+"...";// 字符截断之后加上"..."
		cpTextLength = maxCPTextNumber + 1;
	}
	
	//限制了文字内容和长度之后对圆进行大小计算
	cpInNodeWidth=calCircle1(cp_text, cpTextLength,cpTextSize, cpText, cp_node, cp_innode,cpInNodeWidth,selectTagNum,cpNodeByDistance,selectTagNumNode,isInterset);
	return cpInNodeWidth;
}

function calCircle1(cp_text, cpTextLength,cpTextSize, cpText, cp_node, cp_innode,cpInNodeWidth,selectTagNum,cpNodeByDistance,selectTagNumNode,isInterset){
	//var cpInNodeWidth = cp_innode.width();// 内圆div的宽
	var cpTextWidth;// cp文字 div的宽
	var cpTextHeight;// cp文字 div的高
	
	cpTextSize=parseInt(cpTextSize);
	
	// 分级列出文字的情况，求出cp文字 div的宽和高
	// 1-3个字为一行 //标签内容全为数字或者字母的情况，则为一行
	if (cpTextLength <= 3 || (isLetterOrNumber(cpText)==true)) {
		cpTextWidth = cpTextSize * cpTextLength;
		cpTextHeight = parseInt(cpTextSize) + 5;
	} else if (cpTextLength > 3) {// 4-10个字为两行
		if (cpTextLength % 2 == 0) {
			cpTextWidth = cpTextSize * (cpTextLength / 2);
		} else {
			cpTextWidth = cpTextSize * (cpTextLength / 2 + 1);
		}
		cpTextHeight = cpTextSize * 2 + (6 * 2);
		
		// 分行情况下减小行之间的间距
		/*var cpTextLineHeight=cpTextHeight/2-3;
		cp_text.css("line-height", cpTextLineHeight + "px");*/
	}
	
	// 将cp文字div的大小设置
	cp_text.css("height", cpTextHeight + "px");
	cp_text.css("width", cpTextWidth + "px");
	cp_text.css("font-size", cpTextSize);
	cp_text.text(cpText);
	
	// 计算cp div的斜边的大小，即容纳其外圆的直径
	/*console.log("测试："+Math.pow(cpTextHeight, 2)+" "+Math.pow(cpTextWidth, 2)
			+" "+Math.sqrt(Math.pow(cpTextHeight, 2)+ Math.pow(cpTextWidth, 2)));*/
	var hypotenuse = parseInt(Math.sqrt(Math.pow(cpTextHeight, 2)
			+ Math.pow(cpTextWidth, 2))) + 1;
	
	//2017.08.14 叶夷 加上标签的选择人数 
	selectTagNumNode.css("font-size",cpTextSize+"px");
	selectTagNumNode.css("height", (cpTextSize+5) + "px");
	selectTagNumNode.css("line-height", (cpTextSize+5) + "px");
	//加上了标签的选择人数外圆的大小增大,标签选择人数已经放在右上角，所以内圆大小不用增加选择人数的空间
	/*if (cpInNodeWidth > hypotenuse){
		cpInNodeWidth=parseInt(cpInNodeWidth)+parseInt(cpTextSize)+2; 
		cp_innode.css("height", cpInNodeWidth);
		cp_innode.css("width", cpInNodeWidth);
	}else{
		hypotenuse=parseInt(hypotenuse)+parseInt(cpTextSize)+5; 
	}*/
	if(selectTagNum<=0){
		selectTagNumNode.hide();
	}else{
		selectTagNumNode.show();
	}
	
	// 为了使文字居中，计算文字div 的top
	var cpTextTop;
	var cpTextLeft;

	// 将内圆的width与cp div比较，如果内圆能装下cp div则外圆和内圆差不多大，如果装不下则外圆扩大
	if (cpInNodeWidth > hypotenuse) {// 内圆能装下cp div则外圆和内圆差不多大
		cp_node.css("height", cpInNodeWidth + "px");
		cp_node.css("width", cpInNodeWidth + "px");
		cp_innode.css("top", 0);
		cp_innode.css("left", 0);
	} else {// 如果装不下则外圆扩大,内圆也需要调整位置
		cp_node.css("height", hypotenuse + "px");
		cp_node.css("width", hypotenuse + "px");

		// 内圆位置调整
		var cpInNodeTop = (hypotenuse - cpInNodeWidth) / 2-1;
		cp_innode.css("top", cpInNodeTop);
		cp_innode.css("left", cpInNodeTop);
		
		//外圆比内圆大的时候top值需要改变
		var selectTagNumNodeTop=((hypotenuse - cpInNodeWidth)-(cpTextSize+5))/2;
		selectTagNumNode.css("top", selectTagNumNodeTop + "px");
	}
	// 文字位置调整
	cpTextTop = (cpInNodeWidth - cpTextHeight) / 2;
	cpTextLeft = (cpInNodeWidth - cpTextWidth) / 2;
	cp_text.css("top", cpTextTop);
	cp_text.css("left", cpTextLeft);
	
	// 2017.09.13 叶夷 判断标签之前的距离，需要获得cp_node的大小，然后再加上一个随即距离则是最外面圆的大小
	var randowDistance=cpInNodeWidth*0.25;// 先按内圆计算,这是标签之间的随机距离,根据自身的大小判断，再加上个别相交
	//var randowDistance=10;
	/*if(isInterset){
		randowDistance=-(cpNodeWidth*0.3);
	}*/
	var cpNodeWidth=cp_node.width();
	var cpNodeByDistanceWidth=cpNodeWidth+randowDistance;
	cpNodeByDistance.css("width",cpNodeByDistanceWidth+"px");
	cpNodeByDistance.css("height",cpNodeByDistanceWidth+"px");
	
	//选择标签的位置也要改变
	selectTagNumNode.css("left", (cpNodeWidth/5*3) + "px");
	
	// 2017.09.13 叶夷 标签再加上一个圆之后居中
	if(cpNodeByDistanceWidth>cpNodeWidth){
		var cpNodeTop=parseInt((cpNodeByDistanceWidth-cpNodeWidth)/2);
		cp_node.css("top", cpNodeTop+"px");
		cp_node.css("left", cpNodeTop+"px");
	}
	
	var yesItem=cp_node.find(".yesItem");
	var noItem=cp_node.find(".noItem");
	if(yesItem.length<=0 || noItem.length<=0){
		yesItem=$("<div></div>").attr("class","yesItem").text("收了");//收下按钮
		noItem=$("<div></div>").attr("class","noItem").text("消失");//消失按钮
		cp_node.append(yesItem).append(noItem);
	}
	
	return cpInNodeWidth;//这里返回是为了得到标签选择人数变化时的内圆大小
}

//保存每一个变化人数的数据
var selectDataArray=new Array();
//查看是否执行完的变量,true为执行完，false是为执行完
var selectNumChangeOver=true;
/**
 * 叶夷  2017.10.12 在选择人数变化时查看前端是否执行完，如果没有则先保存
 */
function pushSelectCpPresent(data){
	if(selectNumChangeOver){
		selectNumChangeOver=false;
		startPushSelectCpPresent(data)
	}else{
		selectDataArray.push(data);
	}
}

function addMyTagSelectTagNum(myTagSelectNumber,selectTagNumText){
	if(myTagSelectNumber.length>0){
		myTagSelectNumber.text(selectTagNumText);
	}else{
		myTagSelectNumber=$("<div></div>").attr("class","mytag-selectednumber").text(selectTagNumText);
		myTagNode.append(selectTagNumText);
	}
	myTagSelectNumber.show();
	myTagSelectNumber.css("right","2px");
	//过一秒之后消失
	timeOutSuccess = setTimeout(function() {
		myTagSelectNumber.hide();
	},5000);
}

//选择人数变化是推荐标签的位置需要调整，所以新建一个数组
var cpValueForSelectNum=new Array();
/**
 * 2017.10.11  叶夷   
 * 当前展示的cp中有用户新选中某个cp
 */
function startPushSelectCpPresent(data){
	var cpid=data.cpid;
	
	//测试版本的cpid
	/*var selectTagNumNodes=$(".selectTagNum");
	var temp=parseInt(Math.random()*selectTagNumNodes.length);
	var cpid=selectTagNumNodes.eq(temp).attr("id");*/
	
	var selectTagNum =data.howmanypeople_selected;
	//var selectTagNum =parseInt(Math.random()*999)+1;//测试版本
	//var selectTagNum=999;
	
	//2017.10.17 叶夷   在我的标签中也要将选择人数改变
	var myTagNode=$("#mytag"+cpid);
	if(myTagNode.length>0){
		selectTagNum=selectTagNum-1;
		var selectTagNumText=selectTagNum;
		var myTagSelectNumber=myTagNode.find(".mytag-selectednumber");//这是先查看我的标签是否有选择人数
		if(selectTagNumText>999){
			addMyTagSelectTagNum(myTagSelectNumber,(selectTagNumText+"+"));
		}else if(selectTagNumText>0){
			addMyTagSelectTagNum(myTagSelectNumber,selectTagNumText);
		}
	}else{
		var selectTagNumNode=$("#selectTagNum"+cpid);
		//var selectTagNumNode=$("#"+cpid);//测试版本
		var nowSelectTagNum=selectTagNumNode.text();
		var selectTagNumText=selectTagNum;
		if(selectTagNum>999){
			selectTagNumText=999+"+";
			selectTagNumNode.text(selectTagNumText);
			selectTagNumNode.show();
		}else if(selectTagNum<=0){
			selectTagNumNode.hide();
		}else{
			selectTagNumNode.text(selectTagNumText);
			selectTagNumNode.show();
		}
	
		cpid=cpid.replace(/[^0-9]/ig,"");//测试版本需要
	
		//判断这个标签是否是需要相交的圆
		var isInterset=false;;
		for(var count=0;count<=intersetCPArray.length;count++){
			var intersetCP=intersetCPArray[count];
			if(cpid==intersetCP){
				isInterset=true;
				break;
			}
		}
	
		//接下来是标签的大小改变
		var cpNodeByDistance=$("#outcpid"+cpid);
		var cp_node=$("#cpid"+cpid);
		var cp_innode=cp_node.find(".incp");
		var cp_text=cp_innode.find("div");
		var cpText=cp_text.text();
		var cpTextSize =controlSize(selectTagNum,maxCPTextSize,minCPTextSize);
		var cpInNodeWidth =controlSize(selectTagNum,maxCPSize,minCPSize);
		var cpNodeByDistanceOldWidth=cpNodeByDistance.width();//保存大小改变之前的标签
	
		//传入的参数是：cp文字div, cp文字大小，cp文字，外圆div，内圆div,选择的人数，再加上一个圆div（用来判断标签之前的距离）,选择人数div,判断是否相交
		cpInNodeWidth=calCircle(cp_text, cpTextSize, cpText, cp_node, cp_innode,cpInNodeWidth,selectTagNum,cpNodeByDistance,selectTagNumNode,isInterset);
		cp_innode.animate({
			width : cpInNodeWidth+"px",
			height : cpInNodeWidth+"px"
		}, 1000);
	
		//如果标签扩大，计算出扩大的width
		var changeWidth;
		if(cpNodeByDistance.width()>cpNodeByDistanceOldWidth){
			changeWidth=cpNodeByDistance.width()-cpNodeByDistanceOldWidth;
		}
	
		//位置重新计算,left值不改变，然后通过中心点进行排序，通过中心点最高的标签开始，如果相切只会往下移动，left值不改变
		var cp_container = $("#cp-container");// 装推荐标签的容器
	
		//2.然后通过中心点进行排序
		cpValue.sort(function(a,b){
			var aX=((a.cpBottom-a.cpTop)/2)+a.cpBottom;
			var bX=((b.cpBottom-b.cpTop)/2)+b.cpBottom;
			return aX-bX;
		});
	
		//测试代码
		/*for(var a=0;a<cpValue.length;a++){
			console.log("测试："+cpValue[a].cpNode+"->"+(((cpValue[a].cpBottom-cpValue[a].cpTop)/2)+cpValue[a].cpBottom));
		}*/
	
		cpValueForSelectNum.splice(0, cpValueForSelectNum.length);
		//通过中心点最高的标签开始，如果相切只会往下移动，left值不改变
		for (var index= 0; index < cpValue.length; index++) {
			var cpObj = cpValue[index];// 存在的cp
			var cpNodeID =cpObj.cpNode;// 存在的cpid
			var cpLeft = cpObj.cpLeft;// 获得已有cp的最左边边界值
			var cpRight = cpObj.cpRight;
			var cpTop,cpBottom;
		
			//判断放大之后是否会超过边界
			var right=cpLeft+cpRadius*2;
			if(right>cp_container.width()){
				cpLeft=cpLeft-changeWidth;
			}
		
			var cpRadius;
			var cpid1=cpNodeID.replace(/[^0-9]/ig,"");
			if(cpid==cpid1){
				cpRadius=$("#outcpid"+cpid).width()/2
			}else{
				cpRadius=(cpRight-cpLeft)/2;
			}
			var cpX = cpLeft + cpRadius;// 一开始圆心的x为start+cpRadius
			var cpY = cp_container.height();//从下往上单轨迹扫描
			// 1.遍历装cp容器的宽度,每次+1px
			// start是要上升的cp的left的值，所以终点必须空出上升cp的width
			for (;cpY>=cpRadius; cpY--) {
				var isOverLay = false;// 判断是否重叠,false为不重叠
				// 4.遍历所有已经存在的cp，判断哪些cp在这条轨迹范围内
				for (var j = 0; j < cpValueForSelectNum.length; j++) {// 遍历已经存在的所有cp
					var cpObj = cpValueForSelectNum[j];// 存在的cp
					var cpNode = cpObj.getCpNode();// 存在的cpid
					if(cpNodeID!=cpNode){
						var cpLeftValue = cpObj.cpLeft;// 获得已有cp的最左边边界值
						var cpRightValue = cpObj.cpRight;// 获得已有cp的最右边边界值
						var cpTopValue = cpObj.cpTop;// 获得已有cp的最上边边界值
						var cpBottomValue = cpObj.cpBottom;// 获得已有cp的最下边边界值

						var nowCpRadius = (cpRightValue - cpLeftValue) / 2;// 现有cp的半径
						var nowCpX = cpLeftValue + nowCpRadius;// 现有cp的圆心x周
						var nowCpY = cpTopValue + nowCpRadius;

						//console.log("")
						//console.log("测试1："+cpX+" "+nowCpX+" "+cpY+" "+nowCpY+" "+cpRadius+" "+nowCpRadius);
						//console.log("测试2："+(Math.sqrt(Math.pow((cpX - nowCpX), 2)
						//		+ Math.pow((cpY - nowCpY), 2)))+"->"+(cpRadius + nowCpRadius))
						if (Math.sqrt(Math.pow((cpX - nowCpX), 2)
							+ Math.pow((cpY - nowCpY), 2)) <= (cpRadius + nowCpRadius)) {// 一旦相切则停止
							isOverLay = true;
							break;
						}
					}
				}
				if (isOverLay) {//一旦不相交
					break;
				}
			}
			//console.log("测试3："+cpY);
			cpTop=cpY-cpRadius;
			bottom = cpTop +cpRadius*2;
			right=cpLeft+cpRadius*2;
			cpValueForSelectNum.push(new CP(cpNodeID, cpLeft, right, cpTop, bottom));
			// cp容器的高度调整
			cp_container.height(bottom+maxCPSize);
		}
		cpValue= [].concat(cpValueForSelectNum);
	
		//开始动画
		for (var j = 0; j < cpValue.length; j++) {// 只需要从需要动画的cp个数开始上升，已经在前端的cp不动
			var cp_nodeId = cpValue[j].getCpNode();
			var cp_node = $("#" + cp_nodeId);
			var left = cpValue[j].getCpLeft();
			var top = cpValue[j].getCpTop();

			cp_node.animate({
				top : top + "px",
				left:left+"px"
			}, {
				duration :1000
			});
		}
	}
	
	//判断动画是否执行完
	timeOutSuccess=setTimeout(function(){
		ifSelectNumChangeOver(data);
	},1000);
}

function ifSelectNumChangeOver(data){
	if(selectDataArray.length>0){
		removeByValue(selectDataArray, data);
		startPushSelectCpPresent(selectDataArray[0]);
	}else{
		selectNumChangeOver=true;
	}
}

// 叶夷 2017.08.22 判断标签是否全为数字或者字母
function isLetterOrNumber(cpText) {
	var isLetterOrNumber=true;
	var cpLength=cpText.length;
	for (var i = 0; i <cpLength; i++) {
		if ((cpText.charCodeAt(i) >=97 && cpText.charCodeAt(i) <=122)// 小写字母
				|| (cpText.charCodeAt(i) >= 48 && cpText.charCodeAt(i) <= 57)// 数字
				|| (cpText.charCodeAt(i) >= 65 && cpText.charCodeAt(i) <= 90)) {// 大写字母
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
/** 定义一个cp类 cpid,cp位置left，cp位置right... */
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
function cpAnimationLocation(cp_container,cp_node,cpValueArray) {
	var cpWidth = cp_node.width();// 要上升的标签宽
	var cpHeight = cp_node.height();// 要上升的标签高
	var containerWidth = cp_container.width();// 装cp容器的宽度，即扫描轨迹的x轴的总数

	var top = -1;// 标签的top,用来和不同轨迹对比，将数值最大的赋值给top,可以知道标签可上升的最大高度
	var left = 0;// 得到标签可上升的最大高度时left位置

	//将cpValueArray排序，取最下面的10个标签
	var cpValueSortArray;
	if(cpValueArray.length>=20){
		cpValueSortArray=cpValueArray.slice((cpValueArray.length-20),cpValueArray.length);
	}else{
		cpValueSortArray=cpValueArray.slice(0,cpValueArray.length);
	}
	cpValueSortArray.sort(function(a, b) {
		return b.getCpBottom() - a.getCpBottom();
	});
	
	//2017.11.10 叶夷，为了测试推荐标签位置错误,查看是否已经存在的标签没有记录下来
	console.log("测试已经存在的标签是否成功取最下面10个且保存下来:cpValueSortArray.length="+cpValueSortArray.length);
	log2root("测试已经存在的标签是否成功取最下面10个且保存下来:cpValueSortArray.length="+cpValueSortArray.length);
	
	// 1.遍历装cp容器的宽度,每次+1px
	// start是要上升的cp的left的值，所以终点必须空出上升cp的width
	var startLength=cp_node.find(".cp").width();
	if(startLength<cpWidth){
		startLength=cpWidth;
	}
	for (var start = 0; start <= containerWidth - startLength; start++) {
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
		for (var j = 0; j < cpValueSortArray.length; j++) {// 遍历已经存在的所有cp
			if(j>=10){//只遍历最下面10个
				break;
			}
			var cpObj = cpValueSortArray[j];// 存在的cp
			var cpNode = cpObj.getCpNode();// 存在的cpid
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

		var maxTop;// 可以上升的Top值
		var isOverLay = false;// 判断是否重叠
		if (cpTwo.length > 0) {
			// 5.拿出轨迹内cp最低的圆,即cpTwo数组中的第一个
			var cpFirstObj = cpTwo[0];
			// 6.计算与cpFirstObj能够相切时的位置,cpRadius是上升的cp半径，cpX是上升的cp圆心的x值
			maxTop = calCPTangencyTop(cpFirstObj, cpRadius, cpX);// 在不和轨迹中最低点重合的情况下可以上升的Top值
			// 遍历轨迹中所有的圆，一旦会跟标的圆重合，则这条轨迹放弃
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
	cpValueArray.push(new CP(cp_node.attr("id"), left, right, top, bottom));
	
	// cp容器的高度调整
	cp_container.height(bottom);
}

/** 叶夷 2017.06.28 定义好位置之后开始动画,参数是需要动画的个数 */
function startAnimate(length) {
	for (var j = cpValue.length - 1; j > cpValue.length - length - 1; j--) {// 只需要从需要动画的cp个数开始上升，已经在前端的cp不动
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
	// console.log("测试4："+cpObjNode);
	var cpObjRadius = $("#" + cpObjNode).width() / 2;// 已有cp的半径
	var cpObjLeftValue = cpObj.getCpLeft();// 获得已有cp的最左边边界值
	var cpObjTopValue = cpObj.getCpTop();
	var cpObjX = cpObjLeftValue + cpObjRadius;// 圆心的x轴
	var cpObjY = cpObjTopValue + cpObjRadius;// 圆心的y轴
	// console.log("测试
	// 3："+cpObjY+"->"+cpRadius+"->"+cpObjRadius+"->"+cpX+"->"+cpObjX);
	// 371.5->34->46.5->195->113.5
	
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
	
	//cp选择之前先放大实现“收了”和“消失”的功能，再进行选择
	//1.先将需要的div放入
	/*var selectItemNode=$("<div></div>").attr("class","selectItem");//这是放选项的div
	cp_node.append(selectItemNode);*/
	
	var yesItem=cp_node.find(".yesItem");
	var noItem=cp_node.find(".noItem");
	if(yesItem.css("display")=='none' && noItem.css("display")=='none'){
		/*yesItem=$("<div></div>").attr("class","yesItem").text("收了");//收下按钮
		noItem=$("<div></div>").attr("class","noItem").text("消失");//消失按钮
		cp_node.append(yesItem).append(noItem);*/
		//2.设置字体，目前设置为和标签文字的字体一样大
		var cpNodeByDistance=$("#outcpid"+cpid);
		
		//防止变大之后标签超出边界，先保存变化之前的圆left值和top值
		var cpNodeByDistanceOldWidth=cpNodeByDistance.width();
		var cpNodeByDistanceOldLeft=parseInt(cpNodeByDistance.css("left").replace(/[^0-9]/ig,""));
		var cpNodeByDistanceOldTop=parseInt(cpNodeByDistance.css("top").replace(/[^0-9]/ig,""));
		
		var cp_innode=cp_node.find(".incp");
		var cpInNodeWidth=parseInt(maxCPSize+10);//内圆大小扩大，目前给一个固定值，比最大圆大一点
		cp_innode.css("height", cpInNodeWidth);
		cp_innode.css("width", cpInNodeWidth); 
		var cp_text=cp_innode.find("div");
		var cpTextSize=cp_text.css("font-size").replace(/[^0-9]/ig,"");
		var cpText=fullTextArray[cpid];
		var cpTextLength=cpText.length;
		var selectTagNumNode=$("#selectTagNum"+cpid);
		var selectTagNum=selectTagNumNode.text();
		yesItem.css("font-size",cpTextSize+"px");
		noItem.css("font-size",cpTextSize+"px");
		//3.改变整个标签的大小
		//cp文字div, cp文字长度,cp文字大小，cp文字，外圆div，内圆div,内圆div大小,选择的人数，再加上一个圆div（用来判断标签之前的距离）,选择人数div,判断是否相交
		calCircle1(cp_text, cpTextLength,cpTextSize, cpText, cp_node, cp_innode,cpInNodeWidth,selectTagNum,cpNodeByDistance,selectTagNumNode,"");
		cp_innode.css("background-color","rgba(247,247,247,0.4)");
		cp_innode.css("z-index","104");
		
		//变大之后的标签如果超过边宽则left改变
		var cp_container = $("#cp-container");// 装推荐标签的容器
		var cpNodeByDistanceWidth=parseInt(cpNodeByDistance.width());
		if((cpNodeByDistanceWidth+cpNodeByDistanceOldLeft)>cp_container.width()){
			var changeWidth=cpNodeByDistanceWidth-cpNodeByDistanceOldWidth;
			var cpNodeByDistanceLeft=cpNodeByDistanceOldLeft-changeWidth;
			cpNodeByDistance.css("left",cpNodeByDistanceLeft);
		}
		
		//变大之后的标签如果超过屏幕的高则top改变
		var cpNodeByDistanceOffsetTop=cpNodeByDistance.offset().top;
		var cpNodeByDistanceOffsetBottom=cpNodeByDistanceOffsetTop+cpNodeByDistanceWidth;
		var showAtLoadedHeight=$("#showatloaded").height();
		if(cpNodeByDistanceOffsetBottom>showAtLoadedHeight){
			var cpNodeByDistanceTop=cpNodeByDistanceOldTop-(cpNodeByDistanceOffsetBottom-showAtLoadedHeight);
			cpNodeByDistance.css("top",cpNodeByDistanceTop);
		}
		
		yesItem.show();
		yesItem.css("z-index","104");
		noItem.show();
		//var noItemLeft=cp_node.width()-cpTextSize*2;
		//noItem.css("left",noItemLeft);
		noItem.css("z-index","104");
		//遮盖层
		var coverDiv=$(".cover");
		if(coverDiv.length<=0){
			coverDiv=$("<div></div>").attr("class","cover");
			cp_node.append(coverDiv);
			coverDiv.css("width",$(window).width());
			coverDiv.css("height",$(window).height());
		}
		//console.log("测试："+coverDiv.data("events")["click"]); 
		coverDiv.click(function(){
			cp_innode.css("z-index","");
			yesItem.hide();
			noItem.hide();
			yesItem.unbind();
			noItem.unbind();
			//cp_node.unbind();
			cpNodeByDistance.css("left",cpNodeByDistanceOldLeft+"px");
			cpNodeByDistance.css("top",cpNodeByDistanceOldTop+"px");
			//恢复成原来大小再选择
			cpInNodeWidth =controlSize(selectTagNum,maxCPSize,minCPSize);
			cp_innode.css("height", cpInNodeWidth);
			cp_innode.css("width", cpInNodeWidth);
			cp_innode.css("background-color","rgba(255,255,255,0.3)");
			//cp_innode.css("opacity","0.3");
			calCircle(cp_text, cpTextSize, cpText, cp_node, cp_innode,cpInNodeWidth,selectTagNum,cpNodeByDistance,selectTagNumNode,"");
			$(".cover").unbind();
			$(".cover").remove();
			
			//event.stopPropagation();阻止事件冒泡。
			//这是为了防止选中标签之后取消再次点击时，点击cover，cover删除之后cp_node的点击事件又再次触发
			//这里初步估计是因为点击事件冒泡，导致cover外层的div被触发了
			//但是无法解释第一次点击标签时，点击cover，事件没有冒泡的原因?
			event.stopPropagation();
		});
		
		//绑定点击事件
		yesItem.click(function() {
			/*var $events =cp_node.find(".yesItem").data("events");
			if( $events && $events["click"] ){
				console.log("yesItem绑定");
			}else{
				console.log("yesItem未绑定");
			}*/
			
			//取消点击事件，为了防止多次绑定点击事件
			$(".cover").unbind();
			yesItem.unbind();
			noItem.unbind();
			cp_node.unbind();
			
			cp_innode.css("z-index","");
			$(".cover").remove();
			yesItem.hide();
			noItem.hide();
			
			cpNodeByDistance.css("left",cpNodeByDistanceOldLeft+"px");
			//恢复成原来大小再选择
			cpInNodeWidth =controlSize(selectTagNum,maxCPSize,minCPSize);
			cp_innode.css("height", cpInNodeWidth);
			cp_innode.css("width", cpInNodeWidth);
			cp_innode.css("background-color","rgba(255,255,255,0.3)");
			//cp_innode.css("opacity","0.3");
			calCircle(cp_text, cpTextSize, cpText, cp_node, cp_innode,cpInNodeWidth,selectTagNum,cpNodeByDistance,selectTagNumNode,"");
			chooseCP(cp_innode,cpid,text,"P");
		});
		
		noItem.click(function() {
			cp_innode.css("z-index","");
			$(".cover").unbind();
			$(".cover").remove();
			cpNodeByDistance.css("left",cpNodeByDistanceOldLeft+"px");
			//现变小
			cp_innode.animate({
				width : 0,
				height : 0
			}, 1000,function() {
				cpNodeByDistance.remove();
		    });
			
			//位置重新计算,left值不改变，然后通过中心点进行排序，通过中心点最高的标签开始，如果相切只会往下移动，left值不改变
			
			//先删除要消失的div
			for (var i = 0; i < cpValue.length; i++) {
				if (cpValue[i].cpNode.replace(/[^0-9]/ig,"") == cpid) {
					cpValue.splice(i, 1);
				}
			}
			
			//2.然后通过中心点进行排序
			cpValue.sort(function(a,b){
				var aX=((a.cpBottom-a.cpTop)/2)+a.cpBottom;
				var bX=((b.cpBottom-b.cpTop)/2)+b.cpBottom;
		        return aX-bX;
		       });
			
			//测试代码
			/*for(var a=0;a<cpValue.length;a++){
				console.log("测试："+cpValue[a].cpNode+"->"+(((cpValue[a].cpBottom-cpValue[a].cpTop)/2)+cpValue[a].cpBottom));
			}*/
			
			cpValueForSelectNum.splice(0, cpValueForSelectNum.length);
			//通过中心点最高的标签开始，如果相切只会往下移动，left值不改变
			for (var index= 0; index < cpValue.length; index++) {
				var cpObj = cpValue[index];// 存在的cp
				var cpNodeID =cpObj.cpNode;// 存在的cpid
				var cpLeft = cpObj.cpLeft;// 获得已有cp的最左边边界值
				var cpRight = cpObj.cpRight;
				var cpTop,cpBottom;
				
				var cpRadius;
				var cpid1=cpNodeID.replace(/[^0-9]/ig,"");
				if(cpid==cpid1){
					cpRadius=$("#outcpid"+cpid).width()/2
				}else{
					cpRadius=(cpRight-cpLeft)/2;
				}
				var cpX = cpLeft + cpRadius;// 一开始圆心的x为start+cpRadius
				var cpY = cp_container.height();//从下往上单轨迹扫描
				// 1.遍历装cp容器的宽度,每次+1px
				// start是要上升的cp的left的值，所以终点必须空出上升cp的width
				for (;cpY>=cpRadius; cpY--) {
					var isOverLay = false;// 判断是否重叠,false为不重叠
					// 4.遍历所有已经存在的cp，判断哪些cp在这条轨迹范围内
					for (var j = 0; j < cpValueForSelectNum.length; j++) {// 遍历已经存在的所有cp
						var cpObj = cpValueForSelectNum[j];// 存在的cp
						var cpNode = cpObj.getCpNode();// 存在的cpid
						if(cpNodeID!=cpNode){
							var cpLeftValue = cpObj.cpLeft;// 获得已有cp的最左边边界值
							var cpRightValue = cpObj.cpRight;// 获得已有cp的最右边边界值
							var cpTopValue = cpObj.cpTop;// 获得已有cp的最上边边界值
							var cpBottomValue = cpObj.cpBottom;// 获得已有cp的最下边边界值

							var nowCpRadius = (cpRightValue - cpLeftValue) / 2;// 现有cp的半径
							var nowCpX = cpLeftValue + nowCpRadius;// 现有cp的圆心x周
							var nowCpY = cpTopValue + nowCpRadius;

							//console.log("")
							//console.log("测试1："+cpX+" "+nowCpX+" "+cpY+" "+nowCpY+" "+cpRadius+" "+nowCpRadius);
							//console.log("测试2："+(Math.sqrt(Math.pow((cpX - nowCpX), 2)
							//		+ Math.pow((cpY - nowCpY), 2)))+"->"+(cpRadius + nowCpRadius))
							if (Math.sqrt(Math.pow((cpX - nowCpX), 2)
									+ Math.pow((cpY - nowCpY), 2)) <= (cpRadius + nowCpRadius)) {// 一旦相切则停止
								isOverLay = true;
								break;
							}
						}
					}
					if (isOverLay) {//一旦不相交
						break;
					}
				}
				//console.log("测试3："+cpY);
				cpTop=cpY-cpRadius;
				bottom = cpTop +cpRadius*2;
				right=cpLeft+cpRadius*2;
				cpValueForSelectNum.push(new CP(cpNodeID, cpLeft, right, cpTop, bottom));
				// cp容器的高度调整
				cp_container.height(bottom+maxCPSize);
			}
			cpValue= [].concat(cpValueForSelectNum);
			
			//开始动画
			for (var j = 0; j < cpValue.length; j++) {// 只需要从需要动画的cp个数开始上升，已经在前端的cp不动
				var cp_nodeId = cpValue[j].getCpNode();
				var cp_node = $("#" + cp_nodeId);
				var left = cpValue[j].getCpLeft();
				var top = cpValue[j].getCpTop();

				cp_node.animate({
					top : top + "px",
					left:left+"px"
				}, {
					duration :1000
				});
			}
			
			chooseCP(cp_innode,cpid,text,"N");
		});
	}
}

function chooseCP(cp_innode,cpid,text,property){
	console.log(cpid +":"+text+ "-> 选中状态");
	
	if(property=="N"){
		sendSelectCP(userId, cpid,text, property);
	}else{
			if(cp_innode!=null){
				cp_innode.unbind();// 不可点击
			}
			showSelectTag(cpid,text);
			sendSelectCP(userId, cpid,text, property);
	}
}

// 叶夷 2017.08.08 选中的标签添加到我的标签框中
function showSelectTag(cpid,text){
	// var cpid=data.cpid;
	// var text=data.cptext;
	
	addMyCp(cpid,text);
	// 2017.08.29 叶夷 选择标签加上动画效果，标签上升到“我的标签”容器中
	var myTag=$("#mytag"+cpid);
	var animateCp=$("#outcpid"+cpid).clone();
	if(animateCp.length>0){// 这是点击选中添加标签
		$("#showatloaded").append(animateCp);
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
			$("#cpid"+cpid).css("opacity", "0.2");// 推荐标签变暗
			$("#cpid"+cpid).css("cursor", "auto");// 点击小手不见
		},1000);
	}
		
	console.log("选中标签成功");
	toast_popup("选中标签成功",2500);
}

function addMyCp(cpid,text,selected_user_num){
	// 2017.09.14 叶夷 为了性能测试将选择标签的显示控制在3行以内
		var myTagContainer=$("#mytag-container");
		var myTag = $("<div></div>").attr("class", "mytag").attr("id", "mytag"+cpid).text(text);
		var sampleMyTagFontSize = $("#samplemytag").css("font-size");
		myTag.css("font-size",sampleMyTagFontSize);
		myTagContainer.append(myTag);
	
		myTag.click(function(){
			unSelectCP(cpid);
		});
		
		// 随时在我的标签后面加上“+”
		$("#addtag").remove();
		//var addTag=$("<div style='width:"+(myTagTextSize+20)+"px;height:"+myTagHeight+"px;line-height:"+(myTagHeight-5)+"px;' onclick='addTag()'></div>").attr("class","mytag add").attr("id","addtag").text("+");
		var addTag=$("<div onclick='addTag()'></div>").attr("class","mytag add").attr("id","addtag");
		addTag.css("height", $("#samplemytag").css("height"));
		myTagContainer.append(addTag);
	
		// 装我选择的标签的容器高度适配，一开是只需要能显示两行我选择的标签的高度,并且不同屏幕的大小随着我的标签框的高度的变化其他框的高度也要发生变化
		//var myTagMarginTop=parseInt(myTag.css("margin-top"));
		/*var myTagContainerHeight=myTagHeight*3+myTagMarginTop*7;
		// 我的标签框高度改变了之后影响其他部分的高度
		myTagContainerHeightChange(myTagContainer,myTagContainerHeight);*/
		
		//这是为了测试我的标签加上选择人数是否好看
		var selectTagNumText=selected_user_num;
		
		//2017.10.24 叶夷  我的标签选择人数需要减1，减去自己
		selectTagNumText=selectTagNumText-1;
		
		var myTagNode=$("#mytag"+cpid);
		var myTagSelectNumber=myTagNode.find(".mytag-selectednumber");//这是先查看我的标签是否有选择人数
		if(myTagSelectNumber==undefined){
			myTagSelectNumber.text(selectTagNumText);
		}else{
			myTagSelectNumber=$("<div></div>").attr("class","mytag-selectednumber").text(selectTagNumText);
			myTagNode.append(myTagSelectNumber);
		}
		myTagSelectNumber.hide();
		//end
		
		//调整滚动条宽度
		/*console.log("测试1："+document.getElementById("mytag-container").offsetWidth+
				" "+document.getElementById("mytag-container").scrollWidth);*/
		/*var scollWidth=document.getElementById("mytag-container").offsetWidth-document.getElementById("mytag-container").scrollWidth+2;
		if(scollWidth>2){
			$("#background-rightbar-mytag").css("width",scollWidth);
		}
		
		//将图片放在我的标签框右边遮住滑动条
		$("#background-rightbar-mytag").show();
		$("#background-rightbar-mytag").css("height",myTagContainerHeight);*/
		
		//滚动条直接滑倒底部
		myTagContainer.scrollTop( myTagContainer[0].scrollHeight );
}


/**
 * 我的标签框高度改变了之后影响其他部分的高度
 * 
 * @param myTagContainer
 *            我的标签框
 * @param headerContainerHeight
 *            改变的高度
 */
/*
function myTagContainerHeightChange(myTagContainer,myTagContainerHeight){
	var headerContainerHeight=parseInt($("#header-container").css("height"));
	$("#header-container").css("height",headerContainerHeight+"px");
	myTagContainer.css("height",myTagContainerHeight+"px");
	$("#top-container").css("height",(headerContainerHeight+myTagContainerHeight+10)+"px");
	var showatloadedHeight=parseInt($("#showatloaded").css("height"));
	//var tagContaiderTop=parseInt($("#tag-container").css("top"));
	$("#tag-container").css("height",(showatloadedHeight-headerContainerHeight-myTagContainerHeight-10)+"px");
	//console.log("测试："+showatloadedHeight+" "+headerContainerHeight+" "+myTagContainerHeight+" "+tagContaiderTop);
}*/


function setTagContainerHeight(){
	var headerContainerHeight=$("#header-container").outerHeight(true);
	//$("#header-container").css("height",headerContainerHeight+"px");
	//myTagContainer.css("height",myTagContainerHeight+"px");
	var myTagContainerHeight = $("#mytag-container").outerHeight(true);
	$("#top-container").css("height",(headerContainerHeight+myTagContainerHeight)+8+"px");
	//var showatloadedHeight = $("#showatloaded").outerHeight(true);
	
	//var tagContaiderTop=parseInt($("#tag-container").css("top"));
	
	
	//$("#tag-container").css("height",(showatloadedHeight-headerContainerHeight-myTagContainerHeight-10)+"px");
	//console.log("测试："+showatloadedHeight+" "+headerContainerHeight+" "+myTagContainerHeight+" "+tagContaiderTop);
}




//2017.10.20 叶夷  在取消标签发送给后台之前
function unSelectCP(cpid){
	var myTag=$("#mytag"+cpid);
	
	//取消选择我的标签先放大出现"x"和选择人数再消失
	var myTagHeight=myTag.height();
	myTag.css("z-index",104);
	var myTagSelectNumberNode=myTag.find(".mytag-selectednumber");
	var myTagSelectNumberText=parseInt(myTagSelectNumberNode.text());
	if(myTagSelectNumberText>0){
		myTagSelectNumberNode.show();
		myTagSelectNumberNode.css("right","2px");
	}
	
	//出现"x"
	var unSelectCPNode=$(".unSelectCPNode");
	if(unSelectCPNode.length<=0){
		unSelectCPNode=$("<div></div>").attr("class","unSelectCPNode").text("x");
		myTag.append(unSelectCPNode);
		unSelectCPNode.css("z-index",105);
	}
	
	//加上一块黑布
	var coverDiv=$(".cover");
	if(coverDiv.length<=0){
		coverDiv=$("<div></div>").attr("class","cover");
		$("#mytag-container").append(coverDiv);
		coverDiv.css("width",$(window).width());
		coverDiv.css("height",$(window).height());
		coverDiv.css("z-index",103);
		coverDiv.click(function(){
			unSelectCPNode.remove();
			myTag.css("height",myTagHeight+"px");
			myTag.css("z-index","");
			myTagSelectNumberNode.hide();
			$(".cover").unbind();
			$(".cover").remove();
		});
		//点击"x"才取消选择
		unSelectCPNode.click(function() {
			myTag.unbind();
			sendUnSelectCP(cpid);
			$(".cover").unbind();
			$(".cover").remove();
		});
	}
}


// 叶夷 2017.08.08 取消选中的标签
function showUnSelectCP(data){
	var addtag=$("#addtag");
	// 获得点击取消选择标签时位置变化之前的添加标签的top值
	var addTagBottom1=addtag.offset().top
	
	var cpid=data.cpid;
	var myTag=$("#mytag"+cpid);
	
	//点击"x"才取消选择
		var cp_node=$("#cpid"+cpid);
		
		var text=cp_node.find(".incp").text();
		console.log(cpid + "-> 取消选择");
		cp_node.css("opacity", "1");
		cp_node.css("cursor", "pointer");
		myTag.remove();
		
		// 取消的时候将高度还原
		// 获得点击取消选择标签时位置变化之后的添加标签的top值
		//var addTagBottom2=addtag.offset().top
		//var myTagMarginTop=parseInt(addtag.css("margin-top"));
		//var myTagHeight=addtag.height();
		//var tagChangeHeight=myTagHeight+myTagMarginTop;
		//var myTagContainerHeight=myTagHeight*3+myTagMarginTop*7;
		//var addTagBottom=addtag.offset().top+addtag.height()-$("#header-container").height();
		// 我的标签框高度改变了之后影响其他部分的高度
		//myTagContainerHeightChange($("#mytag-container"),myTagContainerHeight);
		
		/*var $events =cp_node.data("events");
		if( $events && $events["click"] ){
			console.log("yesItem绑定");
		}else{
			console.log("yesItem未绑定");
		}*/
		
		// 将取消选择的标签重新绑定点击事件
		cp_node.click(function() {
			//chooseCP(cp_node,cpid,text);
			chooseOneCP(cp_node,{cpid:cpid,cptext:text});
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
function MatchPeople(userid, img_src) {// 有匹配人的ID，匹配人的头像图片
	var obj = new Object();
	obj.userid = userid;
	obj.img_src = img_src;
	return obj;
}

// 2017.07.07 叶夷 如何解决匹配人交换位置动画还没完成又有新的匹配人排名顺序进来
// 1.一个队列，用来装后台发来的匹配人的数组，如果有新数据，先判断动画有没有运行完，如果运行完，则直接进入程序运行，如果没有运行完则将新数据放入队列中
// 2.匹配人交换位置动画运行完毕现将自己这份数据在队列中删除，然后查看队列里面有没数据，有则接着运行,没有则运行完毕
var muDataQueue = new Array();// mpDataQueue
var circleEnd = true;// 判断动画是否运行完

// 2017.07.04 叶夷 模拟数据的产生
/*function addMPData(){ 
	var newMatchedUserArr=new Array();// 装后台发来的匹配人
	var mpId=new Array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15);// 模拟的匹配人ID
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
						"http://www.mxunta.so:80/xunta-web/useravatar/thumb_img_767240700042547200/jpg/image");// 模拟的匹配人头像，目前用颜色代替
	
	// 判断是实时改变的匹配人头像还是一开始请求的匹配人头像
	if(muNowData.length==0){// 一开始请求的匹配人头像
		var length=15;
		for(var j=0;j<length;j++){
			newMatchedUserArr.push(new MatchPeople(mpId[j],mpImg[j]));
		}
	}else{// 是实时改变的匹配人头像
		var temp=parseInt(Math.random()*14)+1;
		//var temp=14;
		//只是测试固定新排名
		//var length=parseInt(Math.random()*3)+11;
		var length=15;
		for(var i=0;i<length;i++){
			newMatchedUserArr.push(new MatchPeople(mpId[temp],mpImg[temp]));
			temp++;
			if(temp==15){
				temp=0;
			}
		}
	}
	
	// 如果有新数据，先判断动画有没有运行完
	if(circleEnd){// 如果运行完，则直接进入程序运行
		showMatchPeople(newMatchedUserArr); 
	}else{// 如果没有运行完则将新数据放入队列中
		muDataQueue.push(newMatchedUserArr); 
	} 
}*/

var aniSecond=3;//秒数
/**前台目前显示的匹配人列表排名*/
var muNowData = new Array();
var muChangeData=new Array();//这是排名改变之后新的muNowData的数据
// 2017.07.04 叶夷 显示匹配人列表，没有数据的时候先用模拟数据
function showMatchPeople(matchedUserArr) {// 传入的参数为：所需的匹配人列表数据(且排好了顺序)
	if (muNowData.length == 0) {// 如果是用户一开始上线，匹配人列表没有
		
		//测试数据，先固定下来
		/*muNowData.push(muPosition(1,393.5, 102, 36,"http://q.qlogo.cn/qqapp/1104713537/3F9C443766C40F04801FD0FECD24DF07/40"));
		muNowData.push(muPosition(2,461.9375, 85.375, 33.6,"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_669143375538163712/jpg/image"));
		muNowData.push(muPosition(3,324.4375,130.875, 31.5,"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_671612515800715264/jpg/image"));
		muNowData.push(muPosition(4,322.9375,50.375, 29.5,"http://q.qlogo.cn/qqapp/1104713537/5610B8A29AD893CB93284098C11549C8/40"));
		muNowData.push(muPosition(5,441.0625,143.5, 27,"http://42.121.136.225:8888/user-pic2.jpg"));
		muNowData.push(muPosition(6,494.5,134, 25,"http://q.qlogo.cn/qqapp/1104713537/9DB80ECB26EB4571E6F176543D4DEFD4/40"));
		muNowData.push(muPosition(7,372.5,33, 23,"http://q.qlogo.cn/qqapp/1104713537/2CD480E191D757CFF15536FC6B655176/40"));
		muNowData.push(muPosition(8,371.5,155, 21,"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_708988162394951680/jpg/image"));
		muNowData.push(muPosition(9,449,29.5, 18.5,"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_670182701776637952/jpg/image"));
		muNowData.push(muPosition(10,498.5,46, 18,"http://www.xunta.so:80/xunta-web/useravatar/thumb_img_720907019216883712/jpg/image"));
		muNowData.push(muPosition(11,399.5, 102, 17.5,"http://q.qlogo.cn/qqapp/1104713537/3F9C443766C40F04801FD0FECD24DF07/40"));
		muNowData.push(muPosition(12,459.9, 67.3, 17,"http://q.qlogo.cn/qqapp/1104713537/3F9C443766C40F04801FD0FECD24DF07/40"));
		muNowData.push(muPosition(13,324.4, 118.8, 16.5,"http://q.qlogo.cn/qqapp/1104713537/3F9C443766C40F04801FD0FECD24DF07/40"));
		muNowData.push(muPosition(14,471.9,129.3, 16,"http://q.qlogo.cn/qqapp/1104713537/3F9C443766C40F04801FD0FECD24DF07/40"));
		muNowData.push(muPosition(15,321, 48.5, 15.5,"http://q.qlogo.cn/qqapp/1104713537/3F9C443766C40F04801FD0FECD24DF07/40"));*/
		
		/*// 2017.09.06 叶夷
		// matchedUserArr.length改成现有的匹配人div的数量，因为匹配人数量有可能比这个数量少,会导致后面的对比产生null异常
		for (var i = 0; i < matchedUserArr.length; i++) {
			//var muNode=$("#mutemp"+(i+1));// 这是已经放在页面的匹配人头像div
			
			//这是测试
			var muNodeWidth=muNode.width();
			var radius=muNodeWidth/2;// 这是半径
			var x=muNowData[i].x;
			var y=muNowData[i].y;
			var muNodeTop=y-radius;
			var muNodeLeft=x-radius;
			muNode.css("top",muNodeTop);
			muNode.css("left",muNodeLeft);
			
			setMUPosition(i,matchedUserArr);//位置计算好
			//log2root("muNowData的长度:"+muNowData.length);//为了解决出现位置没地放所报的错
			//log2root("是否有一个圆会跟别的圆相交，重新再计算: "+intersect+" "+startMatchUserCount);
			if(intersect && startMatchUserCount<=100){//只要有一个圆不是跟所有圆都不想交，则重新再来,避免出现偶然的相交情况
				//避免出现刚开始的时候匹配人的圆出现重复出现的情况，将前端页面匹配圆删除
				
				console.log("有一个圆会跟别的圆相交，重新再计算");
				//log2root("有一个圆会跟别的圆相交，重新再计算");
				muNowData.splice(0, muNowData.length);
				//$(".mu").find("img").remove();
				for (var i = 0; i < matchedUserArr.length; i++) {
					setMUPosition(i,matchedUserArr);//位置计算好
				}
				break;
			}
		}*/
		
		//接下来就是遍历匹配人改变后的数组，将相交的匹配圆一点点移动
		for(var c=0;c<notIntersectCount;c++){
			//2017.11.06 叶夷  将匹配人初始化状态更改为使用排斥力算法
			muChangeData=[].concat(muNowData);
			
			if(c==0){
				getMuChangeData(matchedUserArr,true);
			}else{
				getMuChangeData(matchedUserArr,false);//排名改变后的匹配人重新装在数组muChangeData中，方便下面的位置整体位置变换
			}
			setPositionAndNotIntersect();
			muChangeDataIfIntersect();//判断是否相交
			
			//排名改变之后就将改变的数组数值复制到muNowData中，再清空muChangeData
			muNowData=[].concat(muChangeData);
			muChangeData.splice(0, muChangeData.length);
			averageForChangeX.splice(0, averageForChangeX.length);
			averageForChangeY.splice(0, averageForChangeY.length);
			log2root("匹配圆初始化第"+(c+1)+"次"+"->intersect="+intersect);
			console.log("匹配圆初始化第"+(c+1)+"次");
			if(!intersect){
				break;
			}
		}
		
		/*//log2root("圆计算好之后放入");
		for (var i = 0; i < matchedUserArr.length; i++) {
			muAddImg(i,matchedUserArr,true);
		}*/
	} else{
		
		//测试
		/*muChangeData=[].concat(muNowData);
		getMuChangeData(matchedUserArr);//排名改变后的匹配人重新装在数组muChangeData中，方便下面的位置整体位置变换
		setPositionAndNotIntersect();*/
		
		circleEnd = false;//动画开始
		
		//判断是否相交的次数
		for(var c=0;c<notIntersectCount;c++){
			muChangeData=[].concat(muNowData);
			if(c==0){
				getMuChangeData(matchedUserArr,true);
			}else{
				getMuChangeData(matchedUserArr,false);//排名改变后的匹配人重新装在数组muChangeData中，方便下面的位置整体位置变换
			}
			//接下来就是遍历匹配人改变后的数组，将相交的匹配圆一点点移动
			changeCount=0;
			while(true){
				var allOver=setPositionAndNotIntersect();
				if(allOver || (changeCount>maxChangeCount)){
					break;
				}
				++changeCount;
				log2root("匹配圆变化是否相交 第"+(c+1)+"次  ->排名改变第"+changeCount+"次循环");
				console.log("匹配圆变化是否相交 第"+(c+1)+"次  ->排名改变第"+changeCount+"次循环");
			}
			muChangeDataIfIntersect();//判断是否相交
			//排名改变之后就将改变的数组数值复制到muNowData中，再清空muChangeData
			muNowData=[].concat(muChangeData);
			muChangeData.splice(0, muChangeData.length);
			averageForChangeX.splice(0, averageForChangeX.length);
			averageForChangeY.splice(0, averageForChangeY.length);
			log2root("匹配圆变化是否相交 第"+(c+1)+"次");
			console.log("匹配圆变化是否相交 第"+(c+1)+"次");
			if(!intersect){//不相交
				break;
			}
			muNowData.splice(0, muNowData.length);
		}
		
		for(var j=0;j<muNowData.length;j++){//开始移动
			var oneMuData=muNowData[j];
			var radius=oneMuData.radius;
			var muDiv=$("#mu"+oneMuData.userid);
			
			var moveWidth=radius*2;
			animateForSize(muDiv, moveWidth, aniSecond * 0.4);// 扩大
			var endX=oneMuData.x;
			var endY=oneMuData.y;
			var muNodeTop=endY-radius;
			var muNodeLeft=endX-radius;
			animateForMu(muDiv, muNodeLeft,muNodeTop, aniSecond * 0.4);
		}
		//这是为了解决排名改变还没有计算完新的排名又出现的问题
		timeOutSuccess=setTimeout(function(){
			muDataQueueEnd(matchedUserArr);
		},aniSecond * 0.4);
	}
}

/**2017.11.06 叶夷  判断muChangeData中的圆是否相交*/
function muChangeDataIfIntersect(){
	for(var a=0;a<muChangeData.length;a++){
		var id=muChangeData[a].userid;
		var x=muChangeData[a].x;
		var y=muChangeData[a].y;
		var radius=muChangeData[a].radius;
		intersect=isIntersect(id,x,y,radius,muChangeData);
		if(intersect){// 相交
			break;
		}
	}
}


function muDataQueueEnd(matchedUserArr){
	removeByValue(muDataQueue, matchedUserArr);
	// 然后查看队列里面有没数据，有则接着运行,没有则运行完毕
	if (muDataQueue.length > 0) {// 有则接着运行
		showMatchPeople(muDataQueue[0]);
	} else {// 没有则运行完毕
		circleEnd = true;
	}
}

//排名改变后的匹配人重新装在数组muChangeData中，方便下面的位置整体位置变换，后面的判断是判断是否为第一次判段相交
//true代码第一次判断相交页面需要加上匹配圆div，如果不是则不需要
function getMuChangeData(matchedUserArr,isFirstIntersect){
	//将muNowData的数据和改变的排名数据计算之后获得新的muNewData，即下面的muNewData
	for(var i = 0; i < matchedUserArr.length; i++){//将排名改变的数据遍历
		var muserid = matchedUserArr[i].userid;// 这是匹配人id

		var muserimg = matchedUserArr[i].img_src;// 这是匹配人头像
		// var muUserName=matchedUserArr[i].username;
		//这里是判断一开始的时候匹配用户没有满的情况
		if(i>muChangeData.length-1){
			setMUPosition(i,matchedUserArr);
			if(isFirstIntersect){
				muAddImg(i,matchedUserArr,true);
			}
			muChangeData=[].concat(muNowData);
		}
		var radius=muChangeData[i].radius;
			if (muserid != muChangeData[i].userid) {// 排名改变
				var exist = false;// 表示后台传来的数据是新数据
				var muNowPosition;// 表示如果从后台新来的数据在前台存在但是排名有所改变时前台存在的排名
				for (var j = i; j < muChangeData.length; j++) {// 遍历现有的头像
					if (muserid == muChangeData[j].userid) {
						exist = true;// 表示后台传来的数据不是新数据，已经存在
						muNowPosition = j;
						break;
					}
				}
				if (exist) {// 存在
					var temp=muChangeData[muNowPosition];//改变之前的数值
					var tempX=temp.x;
					var tempY=temp.y;
					var tempRadius=temp.radius;
					for (var k = muNowPosition; k >= i; k--) {
						if(k == i){
							var dValueRadius=radius-tempRadius;//这是radius变化的值
							
							//id和img是新排名位置的
							muChangeData[k].userid=muserid;
							muChangeData[k].img_src=muserimg;
							//r保持这个位置不变
							//x,y用改变之前的x,y结合r变化之后计算出来的x,y值
							muChangeData[k].x=tempX+dValueRadius;
							muChangeData[k].y=tempY+dValueRadius;
						}else{//这是被动后移的排名
							//id和img是k-1的
							muChangeData[k].userid= muChangeData[k - 1].userid;
							muChangeData[k].img_src= muChangeData[k - 1].img_src;
							
							//r保持这个位置不变
							//x,y用改变之前的x,y结合r变化之后计算出来的x,y值
							var dValueRadius= muChangeData[k].radius-muChangeData[k - 1].radius;//这是radius变化的值
							muChangeData[k].x=muChangeData[k - 1].x+dValueRadius;
							muChangeData[k].y=muChangeData[k - 1].y+dValueRadius;
						}
					}
				} else {// 不存在
					var muNowPositionNewNotExist=muChangeData.length-1;// 这个位置的前端匹配人在新排名里不存在
					// 3.获得现有mp中应该去除的排名，则在新排名中没有的mp,且将它缩小
					/*for (var index = i; index < muChangeData.length; index++) {
						var exist ;// 表示在前端的数据中在新排名里面没有
						for (var j = i; j < matchedUserArr.length; j++) {
							if(muChangeData[index].userid==matchedUserArr[j].userid){
								exist = true;
								break;
							}
						}
						if (!exist) {
							muNowPositionNewNotExist = index;
							break;
						}
					}*/
					var muDiv=$("#mu"+muChangeData[muNowPositionNewNotExist].userid);//这是需要去除的匹配人
					//muDiv.remove();
					animateForSize(muDiv, 0, aniSecond * 0.4);
					muAddImg(i,matchedUserArr,false);

					// 5.所有位置移动之后mpNowData数组的位置也要更新
					var temp=muChangeData[muNowPositionNewNotExist];//改变之前的数值
					var tempX=temp.x;
					var tempY=temp.y;
					var tempRadius=temp.radius;
					for (var k = muNowPositionNewNotExist; k >= i; k--) {
						if(k == i){//这是新的排名
							var dValueRadius=radius-tempRadius;//这是radius变化的值
							
							//id和图片是i的
							muChangeData[k].userid=muserid;
							muChangeData[k].img_src=muserimg;
							
							//r是K的
							//x,y是被删除位置的基础上结合r变化之后计算出来的x,y值
							muChangeData[k].x=tempX+dValueRadius;
							muChangeData[k].y=tempY+dValueRadius;
							
						}else{//这是被动后移的排名
							//id和img是k-1的
							muChangeData[k].userid= muChangeData[k - 1].userid;
							muChangeData[k].img_src= muChangeData[k - 1].img_src;
							
							//r保持这个位置不变
							//x,y用改变之前的x,y结合r变化之后计算出来的x,y值
							var dValueRadius= muChangeData[k].radius-muChangeData[k - 1].radius;//这是radius变化的值
							muChangeData[k].x=muChangeData[k - 1].x+dValueRadius;
							muChangeData[k].y=muChangeData[k - 1].y+dValueRadius;
						}
					}
				}
			}
		//console.log("测试这是第"+(i+1)+"次比较结果");
		/*for(var c = 0; c < muChangeData.length; c++){
			console.log(muChangeData[c].userid+" "+muChangeData[c].x+" "+muChangeData[c].y);
		}*/
	}
	
	//循环完了之后将muChangeData多余的删除，因为会出现匹配人减少的情况
	if(muChangeData.length>matchedUserArr.length){
		for(var removeIndex=matchedUserArr.length;removeIndex<muChangeData.length;removeIndex++){
			var removeMuDiv=$("#mu"+muChangeData[removeIndex].userid);
			//removeMuDiv.remove();
			animateForSize(removeMuDiv, 0, aniSecond * 0.4);
		}
		muChangeData.splice(matchedUserArr.length, muChangeData.length);
	}
}

var intersect=true;//判断是否跟所有的圆都不相交，true为相交，false为不相交
var matchUserContainerXStart,matchUserContainerXEnd,matchUserContainerYStart,matchUserContainerYEnd;//匹配人头像的范围
var startMatchUserCount=0;//一开始循环的次数
/**
 * 叶夷 2017.09.14 匹配人头像静态情况下的位置放置 1.随机找到一个(x,y)点，这个点必须在装匹配人列表的范围
 * 2.然后和存在的所有匹配人头像对比是否相交 3.如果相交则x++,x到达范围则y++,直到找到一个不会相交的点
 */
function setMUPosition(i,matchedUserArr){
	/*var muNodeWidth=muNode.width();
	var radius=muNodeWidth/2;// 这是半径
*/	
	var muId = matchedUserArr[i].userid;// 获得匹配人列表的匹配人id
	var muImg = matchedUserArr[i].img_src;// 获得匹配人列表的匹配人头像
	
	// 1.确定装匹配人列表的范围
	var headerContainer=$("#header-container");
	
	//定义radius
	var radius=setMatchUsersSize(i);
	
	setBorder(headerContainer,radius);
	// 1.1 在随机中设置几个特殊情况
	if(i<5 && i>0){
		var betweenX=(matchUserContainerXEnd-matchUserContainerXStart)/8;// 往中间靠拢的值
		var betweenY=(matchUserContainerYEnd-matchUserContainerYStart)/8;// 往中间靠拢的值
		matchUserContainerXStart=headerContainer.width()/2+radius+betweenX;// 开始位置往中间靠拢
		matchUserContainerXEnd=headerContainer.width()-radius-10-betweenX;
		matchUserContainerYStart=radius+5+betweenY;
		matchUserContainerYEnd=headerContainer.height()-radius-5-betweenY;
	}
	
	// 2.在范围内随机取点
	var x,y;
	x=parseInt(Math.random()*(matchUserContainerXEnd-matchUserContainerXStart))+matchUserContainerXStart;
	y=parseInt(Math.random()*(matchUserContainerYEnd-matchUserContainerYStart))+matchUserContainerYStart;
	
	var xMiddle,yMiddle;
	if(i==0){
		xMiddle=parseInt(matchUserContainerXEnd-matchUserContainerXStart)/2+matchUserContainerXStart;
		yMiddle=parseInt(matchUserContainerYEnd-matchUserContainerYStart)/2+matchUserContainerYStart; 
		x=parseInt(Math.random()*10)+(xMiddle-5);
		y=parseInt(Math.random()*10)+(yMiddle-5);
	}
	
	// 3.然后和存在的所有匹配人头像对比是否相交
	for(var j=matchUserContainerYStart;j<=matchUserContainerYEnd;j++){
		var isBreak=false;
		for(var i=matchUserContainerXStart;i<=matchUserContainerXEnd;i++){
			intersect=isIntersect(muId,x,y,radius,muNowData);
			if(!intersect){// 不相交
				muNowData.push(muPosition(muId,x, y, radius,muImg));
				isBreak=true;
				break;
			}
			++x;
			if(x>=matchUserContainerXEnd){
				x=matchUserContainerXStart;
			}
		}
		if(isBreak){
			break;
		}
		++y;
		if(y>=matchUserContainerYEnd){
			y=matchUserContainerYStart;
		}
	}
	
	if(intersect){
		muNowData.push(muPosition(muId,x, y, radius,muImg));
	}
	
	++startMatchUserCount;
	// 4.获得了不会相交的点之后,计算出top和left值
	/*var muNodeTop=y-radius;
	var muNodeLeft=x-radius;
	muNode.css("top",muNodeTop);
	muNode.css("left",muNodeLeft);*/
}

/**2017.11.02  叶夷  设置匹配圆的大小*/
function setMatchUsersSize(i){
	var bodyWidth=$("body").width();
	var radius;
	if(i==0){
		radius=bodyWidth*0.070;
	}else if(i==1){
		radius=bodyWidth*0.064;
	}else if(i==2){
		radius=bodyWidth*0.058;
	}else if(i==3){
		radius=bodyWidth*0.051;
	}else if(i==4){
		radius=bodyWidth*0.045;
	}else if(i==5){
		radius=bodyWidth*0.038;
	}else if(i==6){
		radius=bodyWidth*0.035;
	}else if(i==7){
		radius=bodyWidth*0.030;
	}else if(i==8){
		radius=bodyWidth*0.028;
	}else if(i==9){
		radius=bodyWidth*0.026;
	}else if(i==10){
		radius=bodyWidth*0.024;
	}else if(i==11){
		radius=bodyWidth*0.024;
	}else if(i==12){
		radius=bodyWidth*0.024;
	}else if(i==13){
		radius=bodyWidth*0.022;
	}else if(i==14){
		radius=bodyWidth*0.022;
	}else if(i==15){
		radius=bodyWidth*0.022;
	}else if(i==16){
		radius=bodyWidth*0.020;
	}else if(i==17){
		radius=bodyWidth*0.018;
	}else if(i==18){
		radius=bodyWidth*0.016;
	}else if(i==19){
		radius=bodyWidth*0.014;
	}
	return radius;
}

function setBorder(headerContainer,radius){
	matchUserContainerXStart=headerContainer.width()/2;// 从屏幕的二分之一开始
	matchUserContainerXEnd=headerContainer.width()-radius-5;// 到屏幕留出10的空隙结束
	matchUserContainerYStart=radius+5;// y轴从5开始，给留出一点空隙
	matchUserContainerYEnd=headerContainer.height()-radius-5;// y轴结束的范围给留出一点空隙
}
/**
 * 叶夷 2017.09.14 判断是否和其他匹配人相交，true相交，false不相交
 * notContrast,不用对比的点位置，没有的话就为空
 */
function isIntersect(id,x,y,radius,tempMuNowData){
	var flag=false;// 相交为true;不相交为false
	if(tempMuNowData.length>0){
		for(var index in tempMuNowData){
			var onePosition=tempMuNowData[index];
			var idForContrast=onePosition.userid;
			if(id!=idForContrast){
				var radiusForContrast=onePosition.radius;
				var xForContrast=onePosition.x;// 用来对比的x点
				var yForContrast=onePosition.y;// 用来对比的y点
				if(Math.sqrt(Math.pow((x- xForContrast), 2)
						+ Math.pow((y - yForContrast), 2)) < (radius + radiusForContrast-2)){// 三角形两条直角边的和的开平方<斜边，则相交，正好放在相切的位置
					flag=true;
					break;
				}
			}
		}
	}
	return flag;
}

/** 定义一个匹配人位置类 id,x,y,radius */
function muPosition(userid,x, y, radius, img_src) {
	var obj = new Object();
	obj.userid = userid;
	obj.x = x;
	obj.y = y;
	obj.radius = radius;
	obj.img_src = img_src;
	//obj.username = username;
	return obj;
}

/** 2017.08.23 叶夷 将匹配人div加上头像图片 */
function muAddImg(i,matchedUserArr,isFirst){
	if(matchedUserArr[i]!=null){
		var muId = matchedUserArr[i].userid;// 获得匹配人列表的匹配人id
		 
		var muImg = matchedUserArr[i].img_src;// 获得匹配人列表的匹配人头像
		var muUserName=matchedUserArr[i].username;
		
		var muNode=$("<div></div>").attr("class","mu").attr("id","mu"+muId);
		var muNodeImg=$("<img src="+muImg+" onerror="+"javascript:this.src='"+"http://42.121.136.225:8888/user-pic2.jpg"+"'>");
		muNode.append(muNodeImg);
		$("#header-container").append(muNode);
		
		var muNow=muNowData[i];
		var x=muNow.x;
		var y=muNow.y;
		var radius=muNow.radius;
		var muWidth;
		if(!isFirst){
			muWidth=0;
		}else{
			muWidth=radius*2;
		}
		var muNodeTop=y-radius;
		var muNodeLeft=x-radius;
		muNode.css("top",muNodeTop);
		muNode.css("left",muNodeLeft);
		muNode.css("width",muWidth);
		muNode.css("height",muWidth);
		
		var muImgWidth=muWidth-10;
		var muImgMargin=(muWidth-muImgWidth)/2;
		muNodeImg.css("margin-top",muImgMargin);
		muNodeImg.css("margin-left",muImgMargin);
		muNodeImg.css("width",muImgWidth);
		muNodeImg.css("height",muImgWidth);
		// 点击事件
		muNode.click(function() {
			// 进入聊天页
			enterDialogPage(muId,muUserName,muImg);
		});
	}
}

//2017.09.27 叶夷   如何能够让排名变化时位置循环能够停下来,求每n次之后x(和y)的位置的变化的平均值，当这个平均值<0.5的时候，则x(和y)的变化的绝对值减去1个像素,如果小于等于0,则循环停止
var n=30;//这是平均数的次数
var averageForChangeX=new Array();//x位置变化的平均值
var averageForChangeY=new Array();//y位置变化的平均值
var changeTotalX=0;//在n次之前累计的变化总数
var changeTotalY=0;
var changeCount=0;//这是循环变化的次数
var maxChangeCount=10;//这是最大的循环变化的次数,超过1000次则不需要再循环
var notIntersectCount=10;//判断不相交的最大次数

/**2017.09.26 叶夷 从一个匹配人开始，然后计算边框和其它匹配人共同作用的排斥力(排斥力即移动的距离，目前是距离的倒数*大小,即距离越近和质量越大，排斥力越大),知道这个距离在0~1之间，则算是平衡下来停下*/
function setPositionAndNotIntersect(){
	/*++changeCount;//判断次数
	
	//为了测试效果，现将大小更新
	for(var a=0;a<muChangeData.length;a++){
		var oneMuData=muChangeData[a];
		var radius=oneMuData.radius;
		var muDiv=$("#mu"+oneMuData.userid);
		var moveWidth=radius*2;
		//animateForSize(muDiv, moveWidth, aniSecond * 0.4);// 扩大
		muDiv.css("width",moveWidth);
		muDiv.css("height",moveWidth);
		var imgWidth=(parseInt(moveWidth)-10)+"px";
		muDiv.find("img").css("width",imgWidth);
		muDiv.find("img").css("height",imgWidth);
	}*/
	var headerContainerSize=100;//边的质量
	var moveMax;//移动的最大值(边界的时候为移动匹配圆的大小，对比别的匹配圆的时候是对比的匹配圆大小)：出现在几种情况1.距离为0~10个像素之间；2.距离为负数
	var moveMaxRange=2;//这是0以上像素的限制
	
	var allOver=true;//这里是判断所有匹配人是否互不相交
	for(var a=0;a<muChangeData.length;a++){
		//这是开始的匹配人中心点
		var oneMuData=muChangeData[a];
		var radius=oneMuData.radius;
		var muDiv=$("#mu"+oneMuData.userid);
		var moveWidth=radius*2;
		muDiv.css("background-color","red");
		
		//var allMoveX=0,allMoveY=0;//所有相交圆的总和
		//遍历所有的圆计算所有的圆(排除自己)形成的排斥力
		for(var index=0;index<muChangeData.length;index++){
			var oneForContrastMuData=muChangeData[index];
			if(oneMuData.userid!=oneForContrastMuData.userid){
				var x=oneMuData.x;
				var y=oneMuData.y;
				//改变颜色测试
				var muDivForContrast=$("#mu"+oneForContrastMuData.userid);
				muDivForContrast.css("background-color","aqua");
				
				var radiusForContrast=oneForContrastMuData.radius;
				var xForContrast=oneForContrastMuData.x;// 用来对比的x点
				var yForContrast=oneForContrastMuData.y;// 用来对比的y点
					
				var subtractX=x-xForContrast;//两个x相减
				var subtractY=y-yForContrast;//两个y相减
				//距离
				var actualDistance=parseInt(Math.sqrt(Math.pow((subtractX), 2)+ Math.pow((subtractY), 2)));//两圆心的距离
				var tangentDistance=radius + radiusForContrast;//两圆相切的距离
				var intersectionDistance=Math.abs(actualDistance-tangentDistance);
				
				var DM;
				var moveXForContrast,moveYForContrast;
				if(tangentDistance >= (actualDistance)){//相交
					//DM=radiusForContrast*2/20;
					DM=/*Math.cbrt(*/Math.sqrt(radiusForContrast*2+moveWidth)/2;//两圆大小相加的立方根
					moveXForContrast=DM/actualDistance*subtractX;
					moveYForContrast=DM/actualDistance*subtractY;
				}else if(actualDistance>100){
					moveXForContrast=0;
					moveYForContrast=0;
				}else{
					DM=1/Math.pow((intersectionDistance), 2)*Math.sqrt(radiusForContrast*2*moveWidth)/10;
					moveXForContrast=DM/actualDistance*subtractX;
					moveYForContrast=DM/actualDistance*subtractY;
					
					if(Math.abs(moveXForContrast)>moveMaxRange){
						moveXForContrast=(moveXForContrast>=0)?(moveXForContrast=moveMaxRange):(moveXForContrast=(-moveMaxRange));
					}
					if(Math.abs(moveYForContrast)>moveMaxRange){
						moveYForContrast=(moveYForContrast>=0)?(moveYForContrast=moveMaxRange):(moveYForContrast=(-moveMaxRange));
					}
				}
				
				//allMoveX=moveXForContrast;
				//allMoveY=moveYForContrast;
				
				updateXAndY(a,x,moveXForContrast,y,moveYForContrast,muDiv,radius);
				muDivForContrast.css("background-color","");
			}
		}
		
		var x=oneMuData.x;
		var y=oneMuData.y;
		var moveStartX=0,moveStartY=0,moveEndX=0,moveEndY=0;//每条边框产生的排斥力
		//边框的排斥力计算,边框的排斥力加大，在距离和质量的基础上再加上50%
		var headerContainer=$("#header-container");
		setBorder(headerContainer,radius);
		if(x<=matchUserContainerXStart){//出现在几种情况1.距离为0~10个像素之间；2.距离为负数
			//console.log("测试1："+Math.pow(27,1/3) );
			//console.log("测试2："+Math.cbrt(27));
			//moveStartX=Math.cbrt(headerContainerSize+moveWidth);
			moveStartX=Math.pow((headerContainerSize+moveWidth),1/3);
			//moveStartX=moveMaxRange*2;
		}else{
			moveStartX=1/Math.pow((x-matchUserContainerXStart), 3)*moveWidth*headerContainerSize;
			if(Math.abs(moveStartX)>moveMaxRange){
				moveStartX=moveStartX=moveMaxRange;
			}
		}
		if(x>=matchUserContainerXEnd){
			//moveEndX=-Math.cbrt(headerContainerSize+moveWidth);
			moveEndX=-Math.pow((headerContainerSize+moveWidth),1/3);
			//moveEndX=-moveMaxRange*2;
		}else{
			moveEndX=-1/Math.pow((x-matchUserContainerXEnd), 3)*moveWidth*headerContainerSize;
			if(Math.abs(moveEndX)>moveMaxRange){
				moveEndX=(-moveMaxRange);
			}
		}
		if(y<=matchUserContainerYStart){
			//moveStartY=Math.cbrt(headerContainerSize+moveWidth);
			moveStartY=Math.pow((headerContainerSize+moveWidth),1/3);
			//moveStartY=moveMaxRange*2;
		}else{
			moveStartY=1/Math.pow((y-matchUserContainerYStart),3)*moveWidth*headerContainerSize;
			if(Math.abs(moveStartY)>moveMaxRange){
				moveStartY=moveMaxRange;
			}
		}
		if(y>=matchUserContainerYEnd){
			//moveEndY=-Math.cbrt(headerContainerSize+moveWidth);
			moveEndY=-Math.pow((headerContainerSize+moveWidth),1/3);
			//moveEndY=-moveMaxRange*2;
		}else{
			moveEndY=-1/Math.pow((y-matchUserContainerYEnd), 3)*moveWidth*headerContainerSize;
			if(Math.abs(moveEndY)>moveMaxRange){
				moveEndY=(-moveMaxRange);
			}
		}
		
		var moveX,moveY;//边框移动的总和
		moveX=moveStartX+moveEndX;
		moveY=moveStartY+moveEndY;
		
		//先做平均判断再移动
		if(changeCount==n){//开始求平均数
			averageForChangeX[a]=changeTotalX/n;
			averageForChangeY[a]=changeTotalY/n;
		}else if(changeCount>n){//开始之后的平均数求法
			/*if(a==0){
				console.log("测试->第"+changeCount+"次循环->"+averageForChangeX[a]+"+"+moveX+"/"+n);
				console.log("测试->第"+changeCount+"次循环->"+averageForChangeY[a]+"+"+moveY+"/"+n);
			}
			*/
			averageForChangeX[a]=(averageForChangeX[a]*(n-1)+moveX)/n;
			averageForChangeY[a]=(averageForChangeY[a]*(n-1)+moveY)/n;
			/*if(a==0){
				console.log("测试->第"+changeCount+"次循环->"+averageForChangeX[a]+"+"+moveX+"/"+n);
				console.log("测试->第"+changeCount+"次循环->"+averageForChangeY[a]+"+"+moveY+"/"+n);
			}*/
			/*console.log("测试->第"+changeCount+"次循环->第"+a+"个匹配人平均数x:"+averageForChangeX[a]);
			console.log("测试->第"+changeCount+"次循环->第"+a+"个匹配人平均数y:"+averageForChangeY[a]);*/
		}else{//开始之前先累计变化总数
			changeTotalX=changeTotalX+moveX;
			changeTotalY=changeTotalY+moveY;
		}
		
		//如果平均值小于0.5,则减少移动距离
		var reduceDistance;//判断当前移动距离是否大于减少移动的距离
		if(averageForChangeX[a]<=2){
			/*reduceDistance=Math.abs(moveX)-2;
			if(reduceDistance>0){
				moveX=(moveX>=0)?(moveX-moveMaxRange):(moveX+moveMaxRange);
			}else{
				moveX=0;
			}*/
			//console.log("测试变化之前->平均移动距离："+allMoveX);
			moveX=moveX/3;
		}
		if(averageForChangeY[a]<=2){
			/*reduceDistance=Math.abs(moveY)-2;
			if(reduceDistance>0){
				moveY=(moveY>=0)?(moveY-moveMaxRange):(moveY+moveMaxRange);
			}else{
				moveY=0;
			}*/
			//console.log("测试变化之前->平均移动距离："+allMoveX);
			moveY=moveY/3;
		}
		/*if(a==0){
			console.log("测试->第"+changeCount+"次循环->第"+a+"个匹配人移动距离x："+moveX);
			console.log("测试->第"+changeCount+"次循环->第"+a+"个匹配人移动距离y："+moveY);
		}*/
		
		//移动测试
		updateXAndY(a,x,moveX,y,moveY,muDiv,radius);
		muDiv.css("background-color","");
		if(moveX<-1 || moveX>1 || moveY<-1 || moveY>1){
			allOver=false;
		}
	}
	
	return allOver;
	
	/*if(!allOver){
		timeOutSuccess = setTimeout(function() {
			setPositionAndNotIntersect();
			console.log("排名改变第"+changeCount+"次循环");
		},100);
	}else{
		return ;
	}*/
	
}

function updateXAndY(a,x,moveX,y,moveY,muDiv,radius){
	var endX=x+moveX;
	var endY=y+moveY;

	muChangeData[a].x=endX;
	muChangeData[a].y=endY;
		
	//开始移动
	var muNodeTop=endY-radius;
	var muNodeLeft=endX-radius;
	//animateForMu(muDiv, muNodeLeft,muNodeTop, aniSecond * 0.4);
	muDiv.css("top",muNodeTop+"px");
	muDiv.css("left",muNodeLeft+"px");
}

// 2017.08.23 叶夷 生成一个新的匹配人div
/*function muDiv(id,muImg,muUserName,top,left){
	var muNode=$("<div></div>").attr("id","mu"+id).attr("class","mu");// 这是页面的匹配人头像div
	var muNodeImg=$("<img src='"+muImg+"' style='width:0px;height:0px;'/>");
	muNode.append(muNodeImg);
	$(".header-container").append(muNode);
	muNode.css("top",top);
	muNode.css("left",left);
	muNode.css("width","0px");
	muNode.css("height","0px");
	
	// 点击事件
	muNode.click(function() {
		// 进入聊天页
		enterDialogPage(id,muUserName);
		// addMPData();//测试匹配人动画
	});
}*/

// 2017.08.24 叶夷 获得现有mp中应该去除的排名，则在新排名中没有的mp
/*function getMuNowPositionNewNotExist(i,matchedUserArr){
	var muNowPositionNewNotExist;// 这个位置的前端匹配人在新排名里不存在
	// 3.获得现有mp中应该去除的排名，则在新排名中没有的mp,且将它缩小
	for (var index = i; index < muNowData.length; index++) {
		var exist = false;// 表示在前端的数据中在新排名里面没有
		for (var j = i; j < matchedUserArr.length; j++) {
			if(muNowData[index].attr("id")==matchedUserArr[j].getMpId()){// 表示在前端的数据中在新排名里面有,这是测试版
			// if (muNowData[index].attr("id") == matchedUserArr[j].userid) {//
			// 表示在前端的数据中在新排名里面有
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
}*/

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
	var imgWidth=(parseInt(muSize)-10)+"px";
	muDiv.find("img").animate({
		width : imgWidth,
		height : imgWidth
	}, second * 1000, function() {
		if(muSize==0){
			muDiv.remove();
		}
    });
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
	//2017.11.09 叶夷  只要点击一次添加标签按钮则发送一个接口给后台
	execRoot("sendClickAddTagMsg()");
	
	var _obj = $("#showatloaded");
	var _h = 80;
	var _w = _obj.width() - 180;
	var contextresult = [];
	contextresult.push('<div id="entrytag">');
	contextresult
			.push("<p class='addtag-div'><input type='text' class='tag-name' id='pop_tagName' onporpertychange='showSearchTag()' oninput='showSearchTag()' onkeypress='if(event.keyCode==13){Javascript:searchToAddTag();}'></p>");
	contextresult
			.push('<div class="btn-div" onclick="searchToAddTag()">确定</div>');
	contextresult.push('</div>');
	contextresult
			.push('<div class="searchtag_suggest" id="gov_search_suggest"></div>');
	alertWin(contextresult.join(''), "添加'心语'", _w, _h);
	
	//将添加标签的确定按钮两个字的字体大小调整
	var btnIdvWidth=$(".btn-div").width();
	var btnDivFontSize=btnIdvWidth/2;
	if(btnDivFontSize>15){
		btnDivFontSize=15;
	}
	$(".btn-div").css("font-size",btnDivFontSize+"px");
}

//监听添加标签输入框是否有改变
function showSearchTag() {
	addCPID=undefined;
	//aData.splice(0,aData.length);// 清空数组
	var input_value = $("#pop_tagName").val();// 获得输入框的值
	responseSearchTag(input_value);// 通过输入框获得匹配的数据
}

/*function searchTagData(id,text){
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
*/
//var aData = [];
// 通过输入框获得匹配的数据
function sendKeyWordToBack(input_value,data) {
	//2017.11.13 叶夷  在后台返回数据之后再清空，避免出现ajax不同步的情况，导致搜索标签出现添加两次的情况
	// 清空div中所有的子元素
	var childList = document.getElementById('gov_search_suggest').childNodes;
	for(var i=0,len=childList.length;i<len;i++){
	    document.getElementById('gov_search_suggest').removeChild(childList[0]);
	}
	
	var suggestWrap = $('#gov_search_suggest');
	
	for(var i in data){
		searchTag(suggestWrap,data[i]);
	}
	
	// 输入框为空的话，结果不显示
	if(input_value!="" && data.length!=0){
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
	
	//console.log("测试添加标签搜索结果显示："+cpid+"->"+text);
	//log2root("测试添加标签搜索结果显示："+cpid+"->"+text);
	
	var searchtag = $("<div></div>")/* .attr("id","searchtag" + data) */.text(text);// 文字div
	suggestWrap.append(searchtag);
	
	// 点击事件
	searchtag.click(function() {
		// 点击搜索项之后将数据放入输入框中
		$("#pop_tagName").val(text);
		addCPID=cpid;
		$("#htmlObj").css("height","100px");
		suggestWrap.hide();
	});
}

function response_user_selected_cp(datas){
	var myTagContainer=$("#mytag-container");
	myTagContainer.show();
	/*var backgroundRightbarMytagWidth=$("#background-rightbar-mytag").width();
	myTagContainer.css("padding-right",backgroundRightbarMytagWidth);*/
	var backgroundRightbarMytagWidth=parseInt(myTagContainer.css("padding-right"));
	//设置我的标签框width
	//右侧遮盖条取消后, 这里不需要了设置了.var myTagContainerWidth=$("body").width()-backgroundRightbarMytagWidth-10;
	//myTagContainer.css("width",myTagContainerWidth);
	var cp_arr=datas.cp_arr;
	for(var i in cp_arr){
		var cpid=cp_arr[i].cpid;
		var text=cp_arr[i].cptext;
		var selected_user_num =cp_arr[i].selected_user_num
		addMyCp(cpid,text,selected_user_num);
	}
}

// 2017.08.09 叶夷 添加标签之后的显示
function addCpShow(data){
	var is_success=data.is_success;
	console.log("添加标签消息备注:"+data.message);
	if(is_success=="true"){
		var cpid=data.cpid;
		var cptext=data.cptext;
		//chooseCP(null,cpid,text);
		showSelectTag(cpid,cptext);
		//console.log("添加标签成功");
    	toast_popup("添加标签成功",2500);
    	closePop();// 添加标签框关掉
	}else{
		//console.log("标签添加过,请重新添加");
    	toast_popup("标签添加过,请重新添加",2500);
	}
	var suggestWrap=$("#gov_search_suggest")
	$("#htmlObj").css("height","100px");
	suggestWrap.hide();
}

function unreadMsg(){
	var unreadParent=$("#enterdialogList");
	if (unreadParent.find('.unread').length==0) {// 如果没有未读消息,则加上一个1;
		var unreadNum = $("<div></div>").attr("class", "unread").text("1");
		unreadParent.append(unreadNum);
	} else {// 如果已有未读消息,则加上1:
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

// 2017.08.23 叶夷 各个控件位置根据屏幕调整
function showMatchedUsers(){
	// 如今的装匹配人的宽高
	var headerContainerHeight=parseInt($(".header-container").css("height"));
	var headerContainerWidth=parseInt($(".header-container").css("width"));
	
	// 用来对比的装匹配人的宽高
	var contrastWidth=375;
	var contrastHeight=129.59;
	
	// 放大或缩小的比例
	var proportionWidth=headerContainerWidth/contrastWidth;
	var proportionHeight=headerContainerHeight/contrastHeight;
	
	for(var i=1;i<=15;i++){
		var muNode=$("#mutemp"+i);
		// var newMuTop=parseInt(muNode.css("top"));
		// var newMuLeft=parseInt(muNode.css("left"));
		var newMuWidth=parseInt(muNode.css("width"));
		
		// var changeMuTop=newMuTop*proportionHeight;
		// var changeMuLeft=newMuLeft*proportionWidth;
		var changeMuWidth=newMuWidth*proportionWidth;
		
		// muNode.css("top",changeMuTop+"px");
		// muNode.css("left",changeMuLeft+"px");
		muNode.css("width",changeMuWidth+"px");
		muNode.css("height",changeMuWidth+"px");
	}
}

/**
 * 2017.09.11 叶夷 cp选择失败，加上感叹号重新选择
 */
function sendSelectedCPFail(cpid,text){
	// 1.在我的标签上加感叹号
	var mytag=$("#mytag"+cpid);
	var myTagFaildImg=$("<img />").attr("src", "../image/acclaim-50x173.png").attr("class","myTagFail");
	mytag.append(myTagFaildImg);
	
	// 2.将我的标签的点击事件绑定为选择标签
	mytag.unbind();
	var cp_node=$("#cpid"+cpid);
	mytag.click(function(){
		chooseCP(cp_node,cpid,text,"P");
	});
}

/**
 * 2017.09.11 叶夷 cp选择成功，绑定上取消点击标签的点击事件
 */
function myTagAgainBindingClick(cpid){
	var mytag=$("#mytag"+cpid);
	myTagFail=mytag.find(".myTagFail");
	if(myTagFail.length>0){// 只有选择标签出错时
		myTagFail.remove();
		mytag.click(function(){
			sendUnSelectCP(cpid);
		});
	}
}

//滚动条到页面底部加载更多	
$("#cp-show").scroll(function(){
	var cpShowHeight = $(this).height();//可见高度  
	var cpShowContentHeight = $(this).get(0).scrollHeight;//内容高度  
	var cpShowScrollTop =$(this).scrollTop();//滚动高度  
	//if(cpShowScrollTop/(cpShowContentHeight -cpShowHeight)>=0.95){ //到达底部100px时,加载新内容
	//console.log("测试滑动");
	//console.log("测试滑动2"+cpShowScrollTop+" "+cpShowContentHeight+" "+cpShowHeight+" "+requestCPSuccese);
	if(0<=Math.abs(cpShowContentHeight -cpShowHeight-cpShowScrollTop) 
			&& Math.abs(cpShowContentHeight -cpShowHeight-cpShowScrollTop)<=2 
			&& requestCPSuccese){ 
		//改变更多标签按钮的内容
		$("#request_cp").html("正在加载...");
		//console.log("测试滑动到底部");
		//滑到底部先查看上一批匹配标签是否请求成功，如果成功再请求下一批
		requestCP(userId,requestCPNum,(requestCPNum*(currentRequestedCPPage++)));
	} 
});

/**
 * start 2017.09.14 叶夷 "选中标签"性能测试
 */
var cpTestArray=new Array();// 用来装页面存在过的cpid
var startTest=false;
function testSelectTag(){
	startTest=true;
	if(cpTestArray.length>0){
		for(var i in cpTestArray){
			var cpid=cpTestArray[i].getCpid();
			var text=cpTestArray[i].getText();
			// var cp_node=$("cpid"+cpid);
			// sendSelectCP(userId, cpid,text);
			againsendSelectCP(userId, cpid,text);
		}
	}
	timeOutSuccess = setTimeout(function() {
		cpTestArray.splice(0,cpTestArray.length);
		requestCP(userId,requestCPNum,(requestCPNum*(currentRequestedCPPage++)));
	},cpTestArray.length*100);
}

function againsendSelectCP(userId, cpid,text){
	timeOutSuccess = setTimeout(function() {
		sendSelectCP(userId, cpid,text);
	},100);
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

function cleartimeout(){
	startTest=false;
}
/**end
 */


/**start 2017.10.18 叶夷  测试websocket并发的问题*/
function requestUserIds(){
	execRoot("requestUserIds()");
}
var testWSArray=new Array();
//var testWS;
var i=0;
function testWebSocket(data){
	var uid_arr=data.uid_arr;
	createNewWS(uid_arr,i)	
}

function createNewWS(uid_arr,i) {
	var userId=uid_arr[i].userId;
	console.log('新建第'+(i+1)+"个WS");
	var testWS = new WebSocket("ws://" + domain + "/xunta-web/websocket?userid=" + userId + "&boot=no");
	testWS.onopen=function(event){
		console.log('Client received a message:',event); 
		sendWS(testWS,userId); 
		++i;
		if(i<=uid_arr.length){
			setTimeout(function() {
				createNewWS(uid_arr,i);
			},100);
		}
	};
	/*
	setTimeout(function() {
			sendWS(testWS); 
	},2000);*/
}
function sendWS(testWS,userId) {
	//var testWS=testWSArray[i];
	var json_obj = {
			 _interface:"1102-1",
			 interface_name: "sendSelectedCP",
			 uid:userId.toString(),
			 cpid:"60670",
			 cptext:"英音",
			 property:  "P",
			 timestamp:"",
		};
	testWS.send(JSON.stringify(json_obj));
	console.log("执行WS发送.接口:" + json_obj._interface);
}
/**end*/
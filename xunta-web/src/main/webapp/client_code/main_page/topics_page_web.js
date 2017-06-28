function wsConnect() {
    execRoot("checkIfWSOnline4Signal()");
}

//叶夷   2017.06.15  将从服务端的标签显示出来
function responseToCPRequest(CP_list) {//显示从服务器获得的话题列表:    这段代码出现在旧版本，因版本错乱出现在这里
	//$("#loadinganimation").remove();
	$("#showatloaded").show();
	//console.log("进到空白页");
	
	//console.log("测试 ： "+JSON.stringify(CP_list));
	var cpList=CP_list.cp_wrap;
	//定义cp动画开始之前的位置
	for(var i=0;i<cpList.length;i++){
		appendElement(i,cpList,CP_list);//叶夷   2016.06.16  如果直接将此方法中的代码放在此循环中，click()方法只会作用在循环最后的标签上，目前不知道原因？
	}
	
	for(var i=0;i<cpList.length;i++){
		cp_node=$("#cpid"+cpList[i].cpid);
		var startTop;//动画还没开始的top位置,第一次起始位置从顶部开始，之后都是从每一批的底部开始
		if(currentRequestedCPPage>1){
			startTop=cpValue[cpValue.length-1].getCpTop();//动画还没开始的top位置
		}
		cp_node.css("top",startTop+"px");
	}

	document.getElementById('cp-container').scrollTop = document.getElementById('cp-container').scrollHeight;//让滚动条落底
}

//叶夷   2017.06.16  通过服务器返回的标签添加到页面的方法
function appendElement(i,cpList,CP_list){
	//叶夷   2017.06.20   控制cp的大小和字体颜色
	var cp_width=60;
	var cp_height=60;
	var cp_color="black"
	
	var cp_container=$("#cp-container");
	var cp=cpList[i];
	var cp_node = $("<div></div>").attr("class", "cp").attr("id", "cpid"+cp.cpid);
	//var cp_text="<div style='width:"+cp_width+"px;height:"+cp_height+"px;color:"+cp_color+";'>"+cp.cptext+"</div>";
	var cp_text=$("<div></div>").text(cp.cptext);
	cp_node.append(cp_text);
	
	//console.log("测试： "+i);
	cp_node.click(function(){
		//console.log("测试点击1:"+i);
		//点击每个显示的标签，标为选中，向后台发送选中请求。已选中的再点一次，标记取消，向后台发送请求
		chooseOneCP(cp_node,cp,CP_list);
		//cp_code.css("background-color","#FF0000");
	});
	cp_container.append(cp_node);
	
	var second=Math.random()*3+2;
	second=parseInt(second);
	
	cp_text.css("height",(second+4)*10+"px");
	cp_text.css("width",(second+4)*10+"px");
	
	cpAnimation(cp_node,second*1000);
}

//通过标签字体和标签字数来算圆的大小和文字与圆的距离
function calCircle(textSize,cpNumber){
	if(cpNumber%2==0){//字数是双数
		
	}
}

var cpValue=new Array();//定义一个数组，将可见屏幕的所有标签的left和top值存入数组中，这样可以直接对比

function CP(cpNode,cpLeft,cpRight,cpTop,cpBottom){//定义一个cp类
	var obj = new Object();
	obj.cpNode=cpNode;
	obj.cpLeft=cpLeft;//用来判断轨迹范围,最后定位上升cp的动画位置
	obj.cpRight=cpRight;//用来判断轨迹范围
	obj.cpTop=cpTop;//用来排序，在已存在的cp内，寻找最低；在要上升的cp轨迹内，寻找最高；最后定位上升cp的动画位置
	obj.cpBottom=cpBottom;
	obj.getCpNode=function(){
		return this.cpNode;
	};
	obj.getCpLeft=function(){
		return this.cpLeft;
	};
	obj.getCpRight=function(){
		return this.cpRight;
	};
	obj.getCpTop=function(){
		return this.cpTop;
	};
	obj.getCpBottom=function(){
		return this.cpBottom;
	};
	return obj;
}

//叶夷   2017.06.27   实现圆切面的上升动画效果
function cpAnimation(cp_node,second){
	var cp_container=$("#cp-container");//装标签的容器
	var cpWidth=cp_node.width();//要上升的标签宽
	var cpHeight=cp_node.height();//要上升的标签高
	var containerWidth=cp_container.width();//装cp容器的宽度，即扫描轨迹的x轴的总数
	
	var top=-1;//用来和不同轨迹对比，将数值最大的赋值给top
	var left=0;//
	
	//1.遍历装cp容器的宽度,每次+1px
	for(var start=0;start<=containerWidth-cpWidth;start++){//start是要上升的cp的left的值，所以终点必须空出上升cp的width
		
		//2.从便利开始获得上升cp的圆心坐标和半径，以cp_container的左下点为(0,0)
		var cpRadius=cpWidth/2;//半径就是要上升的cp的宽除以2
		var cpX=start+cpRadius;//一开始圆心的x为start+cpRadius
		var cpY=0;//一开始圆心的y为0
		
		//3.划分出这次start要上升的圆的上升轨迹左右范围
		var cpLeft=start;
		var cpRight=start+cpWidth;
		
		//用两个数组容器来装轨迹内已经存在的cp中两个最低的圆
		var cpTwo=new Array();
		
		//4.遍历所有已经存在的cp，判断哪些cp在这条轨迹范围内
		for(var j=0;j<cpValue.length;j++){//遍历已经存在的所有cp
			
			var cpObj=cpValue[j];
			var cpNode=cpObj.getCpNode();
			var cpLeftValue=cpObj.getCpLeft();//获得已有cp的最左边边界值
			var cpRightValue=cpObj.getCpRight();//获得已有cp的最右边边界值
			var cpTopValue=cpObj.getCpTop();//获得已有cp的最上边边界值
			var cpBottomValue=cpObj.getCpBottom();//获得已有cp的最下边边界值
			
			var nowCpRadius=(cpRightValue-cpLeftValue)/2;//现有cp的半径
			var nowCpX=cpLeftValue+nowCpRadius;//现有cp的圆心x周
			
			if(Math.abs(nowCpX-cpX)<(nowCpRadius+cpRadius)){//如果现有cp的x轴-上升cp的x轴<两者半径的和，则表示两圆相交,表示存在的圆在这个轨道内
				cpTwo.push(new CP(cpNode,cpLeftValue,cpRightValue,cpTopValue,cpBottomValue));
			}
		}
		
		cpTwo.sort(function(a,b) {
			return b.getCpBottom()-a.getCpBottom();//bottom值越大越低，要从大到小排序
		});
		
		var maxTop;
//		var cpFirstTangencyTop;
//		var cpSecondTangencyTop;
		var isOverLay=false;//判断是否重叠
		if(cpTwo.length>0){
			//5.拿出轨迹内cp最低的圆,即cpTwo数组中的第一个
			var cpFirstObj=cpTwo[0];
			if(cpTwo.length!=null){
				//6.计算与cpFirstObj能够相切时的位置
				maxTop=calCPTangencyTop(cpFirstObj, cpRadius,cpX);//可以上升的Top值
				for(var k=0;k<cpTwo.length;k++){
					var cpSecondObj=cpTwo[k];
					cpY=maxTop+cpRadius;//上升点模拟轨迹中最高点的y轴点
					
					var cpLeftValue=cpSecondObj.getCpLeft();
					var cpTopValue=cpSecondObj.getCpTop();
					var cpRightValue=cpSecondObj.getCpRight();
					var nowCpRadius=(cpRightValue-cpLeftValue)/2;//第二个最低点半径
					var nowCpX=cpLeftValue+nowCpRadius;//第二个最低点的圆心x轴
					var nowCpY=cpTopValue+nowCpRadius;//第二个最低点的圆心y轴
					
					if(Math.sqrt(Math.pow((cpX-nowCpX),2)+Math.pow((cpY-nowCpY),2))<(cpRadius+nowCpRadius)){//如果与第一个最低点相切的时候与第二个最低点重合
						isOverLay=true;
						break;
					}
				}
			}
		}else{
			maxTop=0;
		}
		
		if(isOverLay){
			continue;
		}
		
		if(top==-1){//如果一开始=-1，则top直接赋值
			top=maxTop;
		}else{
			if(top>maxTop){
				top=maxTop;
				left=cpLeft;
				right=cpRight;
			}
		}
	}
	var right=left+cpWidth;
	var bottom=top+cpHeight;
	cpValue.push(new CP(cp_node.attr("id"),left,right,top,bottom));

	cp_node.css("left",left+"px");
	cp_node.animate({
		top:top+"px"
	},{duration:second});
}

//计算与圆相切时的top值
function calCPTangencyTop(cpObj,cpRadius,cpX){
	//6.计算与cpFirstObj能够相切时的位置
	var cpObjNode=cpObj.getCpNode();
	var cpObjRadius=$("#"+cpObjNode).width()/2;//已有cp的半径
	var cpObjLeftValue=cpObj.getCpLeft();//获得已有cp的最左边边界值
	var cpObjTopValue=cpObj.getCpTop();
	var cpObjX=cpObjLeftValue+cpObjRadius;//圆心的x轴
	var cpObjY=cpObjTopValue+cpObjRadius;//圆心的y轴
	
	//上升的cp在轨迹内可以与其相切的y值
	var cpTangencyY=cpObjY+Math.sqrt(Math.pow((cpRadius+cpObjRadius),2)-Math.pow((cpX-cpObjX),2));
	var cpTangencyTop=cpTangencyY-cpRadius+1;//可以上升的Top值
	return parseInt(cpTangencyTop);
}

/*// 叶夷  2017.06.20  实现上升的动画效果
function cpAnimation(cp_node,second){
	var cp_container=$("#cp-container");
	var left=0;//初始化
	var tempLeft=0;//用来获得对比冲突时的
	var top=-1;//初始化
	var cpWidth=cp_node.width();
	var cpHeight=cp_node.height();
	var right;
	var bottom;
	
	var containerWidth=(cp_container.width());//装cp容器的宽度，即扫描轨迹的x轴的总数
	
	//console.log("测试 ： "+containerWidth);
	for(var start=0;start<=containerWidth-cpWidth-5;start++){//横向循环
		//cp-container的轨迹的右边边界为start+cp.width(),左边边界是start,遍历所有的已经显示在界面的cp，有哪个cp的最左边边界值在轨迹的两条线之间,或者最右边边界在轨迹的两条线之间,那这个cp就是在这条轨迹内
		//var cps=$(".cp");//获得界面显示的所有的cp
		var maxTop=-1;//这是在一条轨迹内阻碍的cp的最高点
		
		for(var j=0;j<cpValue.length;j++){
			//console.log("测试2 ： "+cps.eq(j).attr("id")+"-->"+cps.eq(j).position().left);
			var cpValueStr=new Array();
			cpValueStr=cpValue[j].split(",");
			var cpLeftValue=parseInt(cpValueStr[1]);//获得已有cp的最左边边界值
			var cpRightValue=parseInt(cpValueStr[3]);//获得已有cp的最右边边界值
			//if((cpLeftValue<=start+cpWidth && cpLeftValue>=start) || (cpRightValue>=start && cpRightValue<=start+cpWidth) || (cpLeftValue==start&&cpRightValue==start+cpWidth)){//这个cp在这个轨迹内
			if(start<cpRightValue && start>=cpLeftValue && start+cpWidth<=containerWidth){
				//获得在轨迹内的cp的最高点
				var cpTopValue=parseInt(cpValueStr[2]);//数值越小越高
				var cpBottomValue=parseInt(cpValueStr[4]);
				if(maxTop==-1 || cpTopValue<=maxTop){//一开始的maxTop的值和一开始过后cp要上升的值取最小值
					maxTop=cpBottomValue;
				}
			}
		}
		//一条轨迹扫描完毕之后，将获得的阻碍cp的最高点+自身的height=即将上升的cp的top,越小代表越高
		var cpUpTop=maxTop;
		if(cpUpTop<0){
			cpUpTop=0;
		}
		if(top<0){
			top=cpUpTop;
			left=start;
		}else{	
			if(cpUpTop<top){//获取能上升的最高的上升点
				top=cpUpTop;
				//这条轨迹可以使cp达到与其他cp不重叠的最高点
				left=start;
			}
		}
	}
	right=left+cpWidth;
	bottom=top+cpHeight;
	cpValue.push(cp_node.attr("id")+","+left+","+top+","+right+","+bottom);//一个cp的id和上下左右四条边界值
	
	//cp_node.css("margin-top",cp_container.height()+"px");
	
	cp_node.css("left",left+"px");
	cp_node.animate({
		top:top+"px"
	},{duration:second});
}
*/

//叶夷   2017.06.16  点击每个显示的标签，标为选中，向后台发送选中请求。已选中的再点一次，标记取消，向后台发送请求
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




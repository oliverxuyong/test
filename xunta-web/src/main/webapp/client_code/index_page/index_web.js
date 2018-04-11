var windowHeight;
var windowWidth;        
var bodyHeight;
var bodyWidth;

function setBodyHeightWidth() {//刚启动被调用一次,以后窗口resize也会被调用.
	windowHeight = window.innerHeight;
	windowWidth = window.innerWidth;   
	var paddingFactor = 0.9;
	//userAgent[0] = "Mobile";
	//这两个方法也能得到窗口值.备用.xu console.log('$(window).innerHeight()     :' + $(window).innerHeight());	//console.log('$(window).height()     :' + $(window).height());
	if (userAgent[0] == "PC"){//如果是pc,则居中,并按800x500比例设宽高:
		if ( (windowHeight/windowWidth) > 800/500){//如果成立,说明细高,应该先算宽度:
			bodyWidth = Math.round(windowWidth*paddingFactor);
			if ( bodyWidth > 700 ) {bodyWidth = 700;}
			bodyHeight = Math.round(bodyWidth/500*800);			
		}else{//如果是矮粗,则先算高度:
			bodyHeight = Math.round(windowHeight*paddingFactor);
			if ( bodyHeight > 1100 ) {bodyHeight = 1100;}
			bodyWidth = Math.round(bodyHeight/800*500);
		}
		setBodyCSS4PC();
	}else{//如果是Mobile,则(几乎)满屏:
		//bodyWidth = windowWidth*paddingFactor;
		//bodyHeith = windowHeight*paddingFactor;
		setBodyCSS4Mobile();//设满屏,也许不需要宽高参数了.
		
		//2017.11.09 叶夷   如果是手机端则body和html去掉边框线
		$("html").css("border",0);
		$("body").css("border",0);
	}
	//console.log('window innerHeight :' + windowHeight);
	//console.log('window innerWidth :' + windowWidth);
	//console.log('bodyHeight :' + bodyHeight);
	//console.log('bodyWidth :' + bodyWidth);
}
 
function setBodyCSS4PC(){
	//console.log("div宽度:  "+(bodyWidth-250)*0.08+"px");
	$("#login>div").css("margin",(bodyWidth-230)*0.09+"px");//三个登录按钮距离的自适应调节.
	$("html,body").css("position","fixed");
	$("html,body").css("top","50%");
	$("html,body").css("left","50%");
	$("html,body").css("margin-left","-"+bodyWidth/2+"px");
	$("html,body").css("margin-top","-"+bodyHeight/2+"px");
	$("html,body").css("height",bodyHeight+"px");
	$("html,body").css("width",bodyWidth+"px");
 	setIframeCSS();
}
 
function setBodyCSS4Mobile(){
 	//console.log("div宽度:  "+(windowWidth-230)*0.09+"px");
	$("#login>div").css("margin",(windowWidth-230)*0.09+"px");//三个登录按钮距离的自适应调节.
	$("html,body").css("top","0px");
	$("html,body").css("left","0px");
	$("html,body").css("margin","0px");
	$("html,body").css("height","100%");
	$("html,body").css("width","100%");
 	setIframeCSS();
}
  
 function setIframeCSS(){//在iframe未建之前,css不起作用,所以独立出这个方法,供openWin时跨页调用:
	//if (userAgent[0] == "PC"){//使用了全局变量.
 		$(".iframe_windows").css("height",(bodyHeight-2)+"px");//它在iframe未打开前不起作用.
 		$(".iframe_windows").css("width",(bodyWidth-2)+"px");
 		
 		//2017.11.09 叶夷   如果是手机端则iframe去掉padding
 		if (userAgent[0] != "PC"){
 			var iframe=$(".iframe_windows");
 			iframe.css("padding-top",0);
 			iframe.css("padding-bottom",0);
 			iframe.css("padding-left",0);
 			iframe.css("padding-right",0);
		}
 	//}else{
 		//$(".iframe_windows").css("height","100%");//它在iframe未打开前不起作用.
 		//$(".iframe_windows").css("width","100%");
 	//}
 }
 

//F 0120 检查用户请求来自wap还是web
function checkUserAgent(){
    var userAgentInfo = navigator.userAgent;
    logging("当前终端类型 userAgent="+userAgentInfo);
    console.log("当前终端类型 userAgent="+userAgentInfo);
    //var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod"]; //"iPad",当PC对待xu
        
    var mobileOrPC = "PC";
	var browserName = "None";
	//三星手机note4的userAgent = "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-N9100 Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.1 Chrome/34.0.1847.76 Mobile Safari/537.36 {5-15 14:23:53}"
	
    //for (var v = 0; v < Agents.length; v++) {
        //if (userAgentInfo.indexOf(Agents[v]) > 0) {//终端名称通过遍历的方式,不用了.
        
        //chrome上的userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
        if (userAgentInfo.indexOf("Chrome") > 0) {//因为很多浏览器中都含有chrome,所以把这个放在最前面.
            browserName = "Chrome";
        }
        
        if (userAgentInfo.indexOf("Android") > 0) {
            mobileOrPC = "Mobile";
            browserName = "Android";
        }

        if (userAgentInfo.indexOf("SamsungBrowser") > 0) {
            mobileOrPC = "Mobile";
            browserName = "SamsungBrowser";
        }
        
        if (userAgentInfo.indexOf("iPhone") > 0) {
            mobileOrPC = "Mobile";
            browserName = "iPhone";
        }
        if (userAgentInfo.indexOf("SymbianOS") > 0) {
            mobileOrPC = "Mobile";
            browserName = "SymbianOS";
        }
        if (userAgentInfo.indexOf("Windows Phone") > 0) {
            mobileOrPC = "Mobile";
            browserName = "Windows Phone";
        }
        if (userAgentInfo.indexOf("iPod") > 0) {
            mobileOrPC = "Mobile";
            browserName = "iPod";
        }
        if (userAgentInfo.indexOf("iPad") > 0) {
            browserName = "iPad";
        }
        //IE11上的userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko"
        if (userAgentInfo.indexOf("rv:11") > 0) {
            browserName = "IE11";
        }
        if (userAgentInfo.indexOf("rv:10") > 0) {
            browserName = "IE10";
        }
        if (userAgentInfo.indexOf("rv:9") > 0) {
            browserName = "IE9";
        }
        if (userAgentInfo.indexOf("rv:8") > 0) {
            browserName = "IE8";
        }
        if (userAgentInfo.indexOf("rv:8") > 0) {
            browserName = "IE8";
        }
		//QQBrowser上的userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36 Core/1.47.210.400 QQBrowser/9.4.8071.400"
        if (userAgentInfo.indexOf("QQBrowser") > 0) {
            browserName = "QQBrowser";
        }
    
    $("#loadingtext").text("正在登录...["+mobileOrPC+","+browserName+"]");
    return [mobileOrPC,browserName];//用数据返回两个参数.
}
        
        
function setPageTitle(){
 /*  if(domain.indexOf("apicloudhelp") != -1){
        // WEB项目特有的，根据请求域名动态设置网页标题
        document.title = "ApiCloud互助平台";
    }else if(domain.indexOf("chninn") != -1){
    	document.title = "笃行客";
    }else{
        document.title = "寻Ta网";
    }
   */ 
    document.title = pageTitle;
}

function setPageICO(){
	$("#favicon_ico").attr("href",window.location.protocol+"//"+domain+"/xunta-web/client_code/icon/"+faviconUrl);
} 

function setSpecialGroupReq(){
	if(domain=="www.ainiweddingcloud.com" && $("#ainilogo").length==0){
		var logo = $("<img id='ainilogo' src='image/aini.jpg' />");
		logo.css("padding-top","5%");
		logo.css("width","100%");
		$("#welcomepicture_container").append(logo);
	}
}
 
 //1.11 新增 F  删除iframe页面，
function removeIframe(P_winName){
    if($("#"+P_winName) != null){
        $("#"+P_winName).remove();
        //removeDiv($("#"+P_winName),userAgent[1]);
    }
}

function removeAllIframes(){
   $("iframe").remove();
   //removeDiv($("iframe"),userAgent[1]);
}

function hideAllIframes(){
	$("iframe").hide();
}


var dialogPageArray = new Array();//这个变量定义在index.html页面时使用本地测试发现获取不到。写在这里是可以的
var zIndex = 1;//页面层叠次数。要设为全局变量，页面层叠次数最高的才会显示到顶层

function openWin(winName, winUrl, data) {//这个方法马上调用本地的openWin_Root(),是为了让业务代码保持与App的一致性.//只在log退回时能用到.
    openWin_Root(winName,winUrl,data);
}

function closeWin(winName){//这个方法马上调用本地的openWin_Root(),是为了让业务代码保持与App的一致性.//只在聊天页面打开的数量大于10时,要关闭最老的页面时才用到.
     closeWin_Root(winName);
}


function openWin_Root(winName, winUrl, data) {
    if(winName == "root"){
    	//removeAllIframes();
    	hideAllIframes();
    	
    	/*
        currentPageObj =  $("body");
        console.log(":::::::::::"+currentPageObj.html());
        currentPageObj.css("z-Index",1000000);//不知为什么, 这样显不出来.
        setCurrentPageId(winName);
        zIndex = zIndex+1;
        */
      $("#logging").show();
        
        return
    }

    var pageOpenStatus = checkPageOpenStatus(winName);//root时不适用于这一句,所以放到这里.
    var currentPageObj;
	
    if(pageOpenStatus == true){
        console.log(winName+"  页面已经开启过，直接显示该页面");
        log2root(winName+"  页面已经开启过，直接显示该页面");
       //通过z_index来设置页面堆叠顺序，来控制页面显示到顶层。z_index不懂可以去w3c查资料
       	currentPageObj = $("#"+winName);
        currentPageObj.css("z-index",zIndex);
        setCurrentPageId(winName);//原来漏掉了这句,不加的话,再次打开同一页面会收不到toast消息.
    }else if(pageOpenStatus == false){
        console.log(winName+"  页面没有开启过，创建新页面并前台显示.");
        log2root(winName+"  页面没有开启过，创建新页面并前台显示.");
        //openNewWin(winName, winUrl, JSON.parse(data));
        openNewWin(winName, winUrl, data);
    }
    zIndex = zIndex+1;
}

function openNewWin(winName, winUrl, data){
    var iframeObj = $('<iframe id="' + winName + '"' + ' src="' + winUrl + '"' + ' class="iframe_windows"/>');
    iframeObj.css("zIndex",zIndex);
    iframeObj.load(function() {
    	//console.log("main_page加载好的时间："+new Date());
        console.log('创建页面:' + winName);
        log2root('创建页面:' + winName);
        if (data != "") {
            //var script = "start(" + JSON.stringify(data) + ")";
            var script = "start(" + data + ")";
            exec(winName, script);
            
        }
    });
    window.parent.$('body').append(iframeObj);
    //console.log("main_page的iframe开始导入的时间："+new Date());
    
//    //2018.02.07  叶夷     在创建页面之前将css和js文件创建
//    if(winName=="main_page"){
//    	//将需要的css文件变成js代码生成
//		loadCss(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/main_page/topics_page.css");
//   		loadCss(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/main_page/topics_page_web.css");
//    	loadCss(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/css/common_web.css");
//    	loadCss(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/main_page/alter_userimage.css");
//    	loadCss(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/css/popup.css");
//    	loadCss(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/css/popcontext.css");
//    	//将需要的js文件变成js代码生成
//		loadJs(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/script/jquery-1.11.3.min.js");
//		loadJs(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/script/jquery.nicescroll.min.js");
//		loadJs(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/script/common-xunta.js");
//		loadJs(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/script/common-xunta_web.js");
//		loadJs(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/script/popup.js");
//		loadJs(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/main_page/topics_page.js");
//		loadJs(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/main_page/topics_page_web.js");
//		loadJs(window.parent.document.getElementById(winName),preUrl+"/xunta-web/client_code/script/popcontext.js");
//		loadJs(window.parent.document.getElementById(winName),window.location.protocol+"//xunta.so:3000/javascripts/websocket.io.js");
//    }else if(winName=="matchUsers_page"){
//    	//将需要的css文件变成js代码生成
//		loadCss(preUrl+"/xunta-web/client_code/matchUsers_page/matchUsers_page.css");
//		loadCss(preUrl+"/xunta-web/client_code/matchUsers_page/matchUsers_page_web.css");
//		loadCss(preUrl+"/xunta-web/client_code/matchUsers_page/dialoglist_page.css");
//		loadCss(preUrl+"/xunta-web/client_code/matchUsers_page/dialoglist_page_web.css");
//		//将需要的js文件变成js代码生成
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/script/jquery-1.11.3.min.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/script/common-xunta.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/script/common-xunta_web.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/matchUsers_page/matchUsers_page_common_web.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/matchUsers_page/matchUsers_page_common.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/matchUsers_page/dialoglist_page_common_web.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/matchUsers_page/dialoglist_page_common.js");
//    }else if(winName=="profile_page"){
//    	loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/script/jquery-1.11.3.min.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/script/common-xunta_web.js");
//    }else{
//    	//将需要的css文件变成js代码生成
//		loadCss(document.getElementById(winName),preUrl+"/xunta-web/client_code/dialog_page/dialog_page.css");
//		loadCss(document.getElementById(winName),preUrl+"/xunta-web/client_code/dialog_page/dialog_page_web.css");
//		loadCss(document.getElementById(winName),preUrl+"/xunta-web/client_code/dialog_page/inputframe.css");
//		loadCss(document.getElementById(winName),preUrl+"/xunta-web/client_code/css/common_web.css");
//		loadCss(document.getElementById(winName),preUrl+"/xunta-web/client_code/css/popup.css");
//		loadCss(document.getElementById(winName),preUrl+"/xunta-web/client_code/css/popcontext.css");
//		//将需要的js文件变成js代码生成
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/script/jquery-1.11.3.min.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/dialog_page/dialog_page_common.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/dialog_page/dialog_page_common_web.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/script/common-xunta.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/script/common-xunta_web.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/script/popup.js");
//		loadJs(document.getElementById(winName),preUrl+"/xunta-web/client_code/script/popcontext.js");
//    }
    
    setIframeCSS();
}

//检查页面打开状态。
function checkPageOpenStatus(winName){
    var pageOpenStatus;
    if(winName == "main_page"){//如果打开的是topics页面时，这个页面是不存储在队列里的，否则这个页面因一直存在会破坏队列的先进先出的机制
		pageOpenStatus = checkTopicsPageOpenStatus();
/*
        if(dialogPageArray.length == 0){// dialogPageArray.length == 0  表示是初次启动，这个时候要创建话题列表页面
            pageOpenStatus = false;
        }else{// 如果不是，表示列表页面已经创建过了，直接显示列表页， 这里可能有个疑问，列表页没存怎么能知道已经存在了？答：因为第一次启动时列表页没进来的问题应该在index页面的流程中处理
            pageOpenStatus = true;
        }
*/
    }else if(winName == "search_page"){//这里单独判断一下,不要把搜索页的pageid写入dialogPageArray.
    	pageOpenStatus = false;//搜索页总是会被关掉的,所以打开时一定是新打开一个.
    // }else if(winName == "user_others_page"){ //如果开启的页面不是topics页面，按照正常流程处理
    //     pageOpenStatus = false;
    }else{
         pageOpenStatus = checkDialogPageOpenStatus(winName);//判断页面是否存在，返回该页面的打开状态，true为打开，false表示没打开
    }
    return pageOpenStatus;
}

function checkTopicsPageOpenStatus(){
	if(topicsPageOpenMark == "no"){
		return false;
	}
	if(topicsPageOpenMark == "yes"){
		return true;
	}
}

function checkDialogPageOpenStatus(pageId){//每次打开新的聊天窗口页面时检查当前聊天窗口页面数量，如果大于10，则删除掉最早开启的聊天窗口页面
    for (var p = 0; p < dialogPageArray.length; p++) {
        if (dialogPageArray[p] == pageId) {
            return true;  //判断当前打开的话题页面ID是否已经存储到数组中
        }
    }
    dialogPageArray.push(pageId);
    console.log("dialogPageArray中push进一个pageid="+pageId);
    log2root("dialogPageArray中push进一个pageid="+pageId);
    if (dialogPageArray.length > 10) {//当队列数组中超过10个页面后，要删除第一个页面,shift()方法的作用是移除第一个角标并返回角标上对应的值
        var deleteTopicPageName = dialogPageArray.shift();//获取数据中第一个角标位的值,先进先出的队列机制
        closeWin(deleteTopicPageName);
        console.log("打开的页面已超过10个,关闭最早打开的页面,pageid="+deleteTopicPageName);
        log2root("打开的页面已超过10个,关闭最早打开的页面,pageid="+deleteTopicPageName);
    }
    return false;
}

function removeFromdialogPageArray(winName){
    var index = dialogPageArray.indexOf(winName);
    if(index != -1){
        var dialogPageArraySize = dialogPageArray.length;
        for(var b = index; b<dialogPageArraySize; b++){
            dialogPageArray[b] = dialogPageArray[b+1];
        }
        dialogPageArray.pop();//删除多余的最新push进的pageid,因为已经前移了.
        console.log("从dialogPageArray里删除了一个pageid="+winName+"|它在队列中排第"+index);
        log2root("从dialogPageArray里删除了一个pageid="+winName+"|它在队列中排第"+index);
    }else{
	    console.log("要删除dialogPageArray里的一个pageid,却发现没有.-"+winName);
	    log2root("要删除dialogPageArray里的一个pageid,却发现没有.-"+winName);
    }
}

function closeWin_Root(winName){
    removeFromdialogPageArray(winName);
	removeIframe(winName);
}

function exec(winName, script) {//script为方法名与参数名合为一个字串符,以便与App的跨页执行方法兼容.目前测试通过. xu 0112
	//console.log("执行:exec(" + winName + "," + script.substring(0, 100) + "....后面截掉了)");
    //console.log("执行:exec("+winName+","+script);
	if(winName != null){
		var rootWindow = window.parent.document.getElementById(winName).contentWindow;
    	var fun = rootWindow.eval(script);
    	fun;//fun后面不用加().
    }else{
    	console.log("跨页执行时发现页面ID名称为'null' !!!");
    }
}


//index页面跳转topics_page页面传值转换成JSON数据格式，并供全局使用。 1.11新增 F
function publicVarsJson() {//改为只封装所有页面都会用到的页面公共变量.
	var publicVars = {
        "userInfo":userInfo,
		"domain":domain,
		"projectType":projectType,
		"groupName":groupName,
		"userAgent":userAgent,
		"pageTitle":pageTitle,
		"adminName": adminName,
		"adminImageurl": adminImageurl
	};
	return publicVars;
}

function toast(info) {
	toast_popup(info,2500);//定义在popup.js里
}






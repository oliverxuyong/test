
function exec(winName, script) {//script为方法名与参数名合为一个字串符,以便与App的跨页执行方法兼容.目前测试通过. xu 0112
	console.log("执行:exec(" + winName + "," + script.substring(0, 300) + "....后面截掉了)");
    //console.log("执行:exec("+winName+","+script);
	if(winName != null){
		var rootWindow = window.parent.document.getElementById(winName).contentWindow;
    	var fun = rootWindow.eval(script);
    	fun;//fun后面不用加().
    }else{
    	console.log("跨页执行时发现页面ID名称为'null' !!!");
    }
}

function execRoot(script) {
//console.log("script1:"+script);
	var rootWindow = window.parent;
	var fun = rootWindow.eval(script);
	fun;//fun后面不用加().
	//rootWindow.eval(script);
}

function openWin(winName, winUrl, data) {
	//data = JSON.stringify(data);
	//console.log("data1:"+data);
    execRoot("openWin_Root('"+winName+"','"+winUrl+"','"+data+"')");
}

function closeWin(winName){
     execRoot("closeWin_Root('"+winName+"')");
}

function closeAllPages2Index(){
	execRoot("removeAllIframes()");
}

function costomToast(info, duration, location) {
	//alert(info);
	//api.toast({
	//	msg : info,
	//	duration : duration,
	//	location : location
	//});
	toast_popup(info,duration);//定义在popup.js里
}

function toast(info) {
	toast_popup(info,2500);//定义在popup.js里
}

/**
 * 叶夷 2017.06.30 判断字符串长度，中文=英文的两倍
 */
function length(cpText) {
	var len = 0;
	var cpLength=cpText.length;
	for (var i = 0; i <cpLength; i++) {
		if (cpText.charCodeAt(i) >=97 && cpText.charCodeAt(i) <=122) {//小写字母
			len+=0.6;
		} else if(cpText.charCodeAt(i) >= 65 && cpText.charCodeAt(i) <= 90){//大写字母
			len+=0.8;
		}else if(cpText.charCodeAt(i) >= 48 && cpText.charCodeAt(i) <= 57){//数字
			len+=0.7;
		}else {
			len++;
		}
	}
	return len;
}
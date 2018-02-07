/*这些变量移到index.html的script顶部了.因为这个文件是全项目共用的.
var projectType;
var domain;
var groupName;
var userMobileNum;*/

//function exec1 (winName,methord,data){//参数单列的跨页执行方法. 目前只在openWin()方法里用到了. xu 0112
//    var rootWindow = window.parent.document.getElementById(winName).contentWindow;
//    var fun=  rootWindow.eval(methord);
//    fun(data);
//}
//
//function execRoot1 (methord,data){
//    var rootWindow = window.parent;
//    var fun=  rootWindow.eval(methord);
//    fun(data);
//}


function log2root(logtext) {//这段用于记录一些log信息.之后,可以点击拖拉机再进入列表页.xu10.30
	var script = "logging('" + logtext + "')";
	execRoot(script);
}

/*
function timeout(method){
	setTimeout(method, 500)
}
*/

function specialLettersCoding(str){
	str = str.replace("\\","-thisisfanxiegangzifu-");//这个反斜框的替代符需要在上屏后再替换成一串临时字串,到websocket.js里传输前再替换回来.
	str = str.replace(/'/g,"-thisisdanyinhaozifu-");//同上.
	str = str.replace(/\"/g,"-thisisshuangyinhaozifu-");//同上.
	return str
}

function specialLettersDecoding(str){
	str = str.replace(/-thisisfanxiegangzifu-/g,"\\"); //这个反斜框在afterinput上屏后发送前被替代了,需要在websocket.js里传输前再替换回来.
	str = str.replace(/-thisisdanyinhaozifu-/g,"\'"); //这个反斜框在afterinput上屏后发送前被替代了,需要在websocket.js里传输前再替换回来.
	str = str.replace(/-thisisshuangyinhaozifu-/g,"\""); //这个反斜框在afterinput上屏后发送前被替代了,需要在websocket.js里传输前再替换回来.
	return str
}

function cutStringIfTooLong(str,maxLength){
	if (str.length > maxLength) {//长度太长,就截短.
		return str.substring(0, maxLength-1) + " …";
	}else{
		return str;			
	}
}
/**start:叶夷   2017.10.24
 *		去除特殊字符的方法
 */
function excludeSpecial(str){
	//去掉空格
	str=str.replace(/[ ]/g,"");    
	 // 去掉转义字符  
    str = str.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');  
    // 去掉特殊字符  
    str = str.replace(/[\@\#\$\%\^\&\*\{\}\:\"\<\>\?]/,'');  
    return str;  
}


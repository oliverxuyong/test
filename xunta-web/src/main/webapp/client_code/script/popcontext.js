var bgObj ="";
var htmlBgObj ="";
var tipsObj = "";
/**
 * 弹出框
 * @param _context 弹出内容
 * @param _title 弹出标题
 * @param _w 弹出高度
 * @param _h 弹出宽度
 */
function alertWin(_context,_title,_w,_h){
    var iWidth =  $(window).width();
    var iHeight =  $(window).height();
    var iTop = $(window).scrollTop();
    var iLeft = $(window).scrollLeft();
    bgObj = document.createElement('div');
    htmlBgObj = document.createElement('div');
    tipsObj = document.createElement('div');
    bgObj.style.cssText="width:"+$(window).width()+"px;height:"+$(document).height()+"px;background:#000;position:absolute;top:0;left:0;z-index:200;opacity:0.2;filter:alpha(opacity =20);";
    document.body.appendChild(bgObj);
    htmlBgObj.style.cssText = "position:absolute;top:" + (iTop + Math.abs((iHeight - _h) / 2)) + "px;left:" + (iLeft + Math.abs((iWidth - _w) / 2))  + "px;width:" + _w + "px;height:" + _h + "px;z-index:201;border:1px solid #D3D6DD;border-radius:6px;background-color:#fff;";
    tipsObj.style.cssText = "top:" + (iTop + Math.abs((iHeight - _h) / 2) - 30) + "px;left:" + (iLeft + Math.abs((iWidth - _w) / 2))  + "px;width:" + _w + "px;z-index:202;";
    htmlBgObj.id = "htmlObj";
    tipsObj.id = "tipsObj";
    var result = [];
    result.push('<div class="pop-title">');
    result.push('<div class="title-div"><span>'+_title+'</span></div>');
    result.push('<div class="close-div" onclick="closePop()"> &times; </div>');
    result.push('</div>');
    
    result.push(_context);
    tipsObj.innerHTML="";
    htmlBgObj.innerHTML= result.join('');
    document.body.appendChild(tipsObj);
    document.body.appendChild(htmlBgObj);
}

/**
 * 关闭pop弹出框
 */
function closePop(){
    if(tipsObj!="")
        document.body.removeChild(tipsObj);
    if(bgObj!="")
        document.body.removeChild(bgObj);
    if(htmlBgObj!="")
        document.body.removeChild(htmlBgObj);
    if($("#inputbox").val()){
        $("#inputbox").val("");
    }
    if(replyOpptid){
        replyOpptid = null ;
    }
}

/**
 * 更新标题
 * @param _text 标题名
 */
function updateTitleName(_text){
    $(".title-div span").html(_text);
}

function topicChangeHeightSize(_h){
    var iHeight =  $(window).height();
    $("#htmlObj").css({"height":_h,"top":Math.abs((iHeight - _h) / 2)});
    $("#tipsObj").css({"top":Math.abs(((iHeight - _h) / 2)- 30)});
}

/**
 * 弹出框
 * @param _context 弹出内容
 * @param _title 弹出标题
 * @param _w 弹出高度
 * @param _h 弹出宽度
 */
function alert_Win(_context,_title,_w,_h){
    var iWidth =  $(window).width();
    var iHeight =  $(window).height();
    var iTop = $(window).scrollTop();
    var iLeft = $(window).scrollLeft();
    bgObj = document.createElement('div');
    htmlBgObj = document.createElement('div');
    tipsObj = document.createElement('div');
    bgObj.style.cssText="width:"+$(window).width()+"px;height:"+$(document).height()+"px;background:#000;position:absolute;top:0;left:0;z-index:200;opacity:0.2;filter:alpha(opacity =20);";
    document.body.appendChild(bgObj);
    htmlBgObj.style.cssText = "position:absolute;top:" + (iTop + Math.abs((iHeight - _h) / 2)) + "px;left:" + (iLeft + Math.abs((iWidth - _w) / 2))  + "px;width:" + _w + "px;height:" + _h + "px;z-index:201;border:1px solid #D3D6DD;border-radius:6px;background-color:#fff;";
    tipsObj.style.cssText = "top:" + (iTop + Math.abs((iHeight - _h) / 2) - 30) + "px;left:" + (iLeft + Math.abs((iWidth - _w) / 2))  + "px;width:" + _w + "px;z-index:202;";
    htmlBgObj.id = "htmlObj";
    tipsObj.id = "tipsObj";
    var result = [];
    result.push('<div id="bodyBgObj">');
    result.push('<div class="pop-title">');
    result.push('<div class="title-div"><span>'+_title+'</span></div>');
    result.push('<div class="close-div" onclick="closePop()"> &times; </div>');
    result.push('</div>');

    result.push(_context);
    result.push('</div>');
    tipsObj.innerHTML="";
    htmlBgObj.innerHTML= result.join('');
    document.body.appendChild(tipsObj);
    document.body.appendChild(htmlBgObj);
}
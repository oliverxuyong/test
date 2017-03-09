function getPageParams(pageParamsStr){
    userId = pageParamsStr.userId;
    userName = pageParamsStr.userName;
    userImage = pageParamsStr.userImage;

    adminName = pageParamsStr.adminName;
    adminImageurl = pageParamsStr.adminImageurl;
    userAgent = pageParamsStr.userAgent;
    domain = pageParamsStr.server_domain;

    _tmpPageId = pageParamsStr.tmpPageId;

    $("#userImg").attr("src",userImage);
    $("#username").html(userName);
}

function updUserImg(){
    $("#ImageBox").show();
    $("#disableLayer").show();
    $("#imghead").attr("src", userImage);
}

function doToast(msg,duration){
    duration=isNaN(duration)?3000:duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="width:60%; min-width:150px; padding-left:5px; padding-right:5px; background:#dddddd; opacity:0.8; height:; line-height:30px; text-align:center; border-radius:5px; position:fixed; top:40%; left:20%; z-index:999999; font-weight:bold;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}

//自定义弹框  msg-提示信息,btntxt-按钮文字,btnclick-按钮方法
function doConfirm(msg,btntxt1,btntxt2,btnclick,btnclose){
    var mainDiv = document.createElement('div');
    mainDiv.id = "conf_window";
    var btn = '<button style="height:25px;font-size:14px" onclick="' + btnclick + '">' + btntxt1 + '</button>&nbsp;&nbsp;&nbsp;&nbsp;';
    if(btnclose != null && btnclose != ""){
        btn += '<button style="height:25px;font-size:14px" onclick="' + btnclose + '">' + btntxt2 + '</button>';
    }else{
        btn += '<button style="height:25px;font-size:14px" onclick="doCancel(\'conf_window\')">' + btntxt2 + '</button>';
    }
    mainDiv.innerHTML = msg +"<br/>"+btn;
    mainDiv.style.cssText="width:80%; min-width:200px; background:#dddddd; opacity:0.8; height:60px; padding:2px; line-height:30px; text-align:center; border-radius:5px; position:fixed; top:40%; left:10%; z-index:999999; font-weight:bold;";
    document.body.appendChild(mainDiv);
}

function doCancel(val){
    var reDiv = document.getElementById(val);
    document.body.removeChild(reDiv);
}

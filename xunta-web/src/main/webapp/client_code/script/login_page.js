var qq_obj;
var wx_obj;
var qq_installed_mark;
var wx_installed_mark;
function checkCookie()
{
    var cookie_type =getCookie('type');
    if (cookie_type!=null && cookie_type!=""){
        return 'yes';
    }
    else{
        return 'no';
    }
}

function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            if(c_name == "name"){
                return decodeURI(document.cookie.substring(c_start,c_end));
            }
            return document.cookie.substring(c_start,c_end);
        }
    }
    return ""
}
/**
 * 向服务器存储用户信息，如果当前用户在服务器中已有用户信息，则将服务器存储的用户信息存储本地，以服务器的信息为准  9.14 Fang
 *
 * 描述 ： 张三有A,B两台设备，在A登录后并留有本地信息，那么在B登录时没有本地信息不意味着张三没有注册过帐号。    如果在A设备进行改名的话，那么在B设备登录时就要获取服务器存储的信息  9.14 Fang
 * */
function storageUserInfo(type, uid, name, image, unionid) {
    if ($("#loadinganimation").find("#loadingtext").length == 0) {
        $("#loadinganimation").append($("<div></div>").attr("id", "loadingtext").text("话题列表读取中..."));
        $("#loadinganimation").append($("<img>").attr("src", "image/tractor-short.gif"));
    }
    if(localStorage.getItem("uid") == null){
        //本地没有存储用户登陆信息或上次用户注销后则进入登陆页面
        saveUserInfoToServer(type, uid, name, image, unionid);
    }else{
        //本地有存储用户登陆信息，读取信息后进入话题列表页面
        if(localStorage.getItem('unionid') == unionid){
            var userInfo = userInfoToJson(localStorage.getItem('type'), localStorage.getItem('uid'), localStorage.getItem('name'), localStorage.getItem('image'), localStorage.getItem('originalUid'), 'false', localStorage.getItem('unionid'));
            $.ajax({
                url : "http://"+domain+"/xunta-web/checkuser",
                action : "post",
                dataType: "jsonp",
                jsonp:'callback',
                jsonpCallback:"success_save_user",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data : {
//                                unionid : localStorage.getItem('unionid'),
                    userid : localStorage.getItem('uid'),
                    userimage : localStorage.getItem('image')
                },
                async : false,
                success : function(data, textStatus) {
                    if (data.if_exist == '1') {
//                                    window.parent.initToGetTopicList('login', localStorage.getItem('uid'), userInfo);
                        removeIframe('topics_page');
                        initToGetTopicList('login',localStorage.getItem('uid'),JSON.stringify(userInfo));
                        localStorage.setItem('logOff','false');
                        removeIframe('login_page');
//                                    localStorage.setItem('type',type);
//                                    localStorage.setItem('uid',localStorage.getItem('uid'));
//                                    localStorage.setItem('name',name);
//                                    localStorage.setItem('image',localStorage.getItem('image'));
//                                    localStorage.setItem('originalUid',localStorage.getItem('originalUid'));

//                                    localStorage.setItem("unionid",unionid);
//                                    window.parent.web_closeWin('login_page');

                    } else {
                        saveUserInfoToServer(type, uid, name, image, unionid);
                    }
                },
                error : function(data, textStatus) {
                    setTimeout(function(){
                        $("#loadinganimation img").attr('src', 'image/tractor.jpg');
                        $("#loadingtext").text("网络不给力呀! 稍后戳一下拖拉机再试试.");
                        //
                        $("#loadinganimation").click(function(evt) {
                            //alert("点击了");
                            $("#loadinganimation img").attr('src', 'image/tractor-short.gif');
                            //恢复动态图片.
                            $("#loadingtext").text("再次请求中...");
                            storageUserInfo(type, uid, name, image, unionid);
                            $("#loadinganimation").unbind('click');
                            //点击后马上取消这个事件绑定.
                        });
                    },5000);
                }
            });
        }else{
            /*
             * 本地有存储用户信息，当前登录用户信息uid与本地存储用户信息不一致，向服务器发送用户信息。
             * */
            saveUserInfoToServer(type, uid, name, image, unionid);
        }
    }
};
/**
 * 将用户消息传到服务器并保存服务器  9.14 Fang
 * */
function saveUserInfoToServer(userType, userUid, userName, userImage, unionid) {
    $.ajax({
        url : "http://"+domain+"/xunta-web/save_user",
        action : "post",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        dataType: "jsonp",
        jsonp:'callback',
        jsonpCallback:"success_save_user",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        data : {
            type : userType,
            third_party_id : unionid,
            name : userName,
            image_url : userImage,
            groupname : groupName
        },
        async : false,
        success : function(data, textStatus) {
//                    if(projectType == 'APP'){
//                        var userInfo = userInfoToJson(userType, data.userid, data.username, userImage, userUid, 'false', P_unionid);
//                        userInfoTolocalStorage(JSON.stringify(userInfo));
//                        executeInitToGetTopicList(data.userid, JSON.stringify(userInfo));
//                    }else if(projectType == 'WEB'){
            var userInfo = userInfoToJson(userType, data.userid, data.username, userImage, userUid, 'false', unionid);
            localStorage.setItem('type',userType);
            localStorage.setItem('uid',data.userid);
            localStorage.setItem('name',data.username);
            localStorage.setItem('image',userImage);
            localStorage.setItem('originalUid',userUid);
            localStorage.setItem('logOff','false');
            localStorage.setItem('unionid',unionid);
            initToGetTopicList('login',data.userid,JSON.stringify(userInfo));
            removeIframe('login_page');
        },
        error : function(data, textStatus) {
            $("#loadinganimation img").attr('src', 'image/tractor.jpg');
            $("#loadingtext").text("网络不给力呀! 稍后戳一下拖拉机再试试.");
            //
            $("#loadinganimation").click(function(evt) {
                //alert("点击了");
                $("#loadinganimation img").attr('src', 'image/tractor-short.gif');
                //恢复动态图片.
                $("#loadingtext").text("再次请求中...");
                saveUserInfoToServer(userType, userUid, userName, userImage ,P_unionid);
                $("#loadinganimation").unbind('click');
                //点击后马上取消这个事件绑定.
            });
        }
    });
}

// F 0118 登陆页面不能依赖index页面传值进来的数据，因为WEB登陆成功后会刷新页面，这样通过index页面传过来的参数就都没了，
function initPublicParam() {
    $.ajax({
        url : "xunta_config.xml",
        dataType : 'xml',
        type : 'GET',
        async : false,
        timeout : 2000,
        error : function(xml) {
            alert("加载配置文件xunta_config.xml文件出错.");
        },
        success : function(xml) {
            var xmlObj = $(xml).find("xunta").find('xunta_public_param');
            projectType = xmlObj.find("projectType").text();
            groupName = xmlObj.find("groupName").text();
            domain = xmlObj.find("domain").text();
            //if(projectType == 'WEB'){
            //    domain = document.domain;
            //}
        }
    });
}
/**
 * QQ登录请求并获取QQ用户信息 9.14 Fang
 * */
function qq_login() {
    window.location = "http://"+domain+"/xunta-web/qqlogin";
}

/**
 * WX登录请求并获取WX用户信息 9.14 Fang
 * */
function wx_login() {
    var redirect_uri = "http://"+domain+"/wx_callback";
    window.location = "https://open.weixin.qq.com/connect/qrconnect?appid=wxed5db4b066e33c7b&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_login&state=705e582b0990b1e9b2fb860b823f2a9e#wechat_redirec";
}
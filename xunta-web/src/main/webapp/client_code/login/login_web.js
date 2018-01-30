//web项目特有的方法，因为检查信息中要检查cookie里的信息
function getUserInfo(){
    //正常登陆 - 检查是否有cookie
    var cookieState = checkCookie();
    if(cookieState == 'yes'){
    	console.log("发现cookie,进入handleCookie()...")
    	handleCookie();//读取cookie数据,并同步到服务器上.成功回到loginEnd(),失败打开登录界面.
    }else{
    	console.log("没有发现cookie,读取localStorage...");
        checkLocalStorage();////读取localstorage数据,获得服务器验证.成功回到loginEnd(),失败打开登录界面.
    }
}
// 读取用户本地信息，如果没有本地用户信息要显示登陆界面，如果本地有用户信息就要像服务器提交用户信息用来验证用户信息的有效性
function checkLocalStorage() {
    if(window.localStorage){
    var uid = localStorage.getItem("uid");
    var name = localStorage.getItem("name");  
    console.log("localstorage中的uid="+uid+"|name="+name);
        if(uid == null || name == "undefined"){//localStorage.getItem("uid") 如果不存在的话，默认值是null，
            //本地没有存储用户登陆信息或上次用户注销后则进入登陆页面
            console.log("localstorage中的用户数据无效或没有,进入登录页.")
            showLogin();
        }else{//本地有存储用户登陆信息，读取信息后进入话题列表页面
	        console.log("localstorage中的用户数据有效,下一步向服务器检证它是否存在.");
            var status = compareTimestamp();//Fang 04 22  ***  这是个方法返回的是boolean,超过2天返回true，否则返回false. 变量名用的是status，因为想不出其他名字了。
            if(status == false){
                //时间戳已过期。引导用户从新登陆
                console.log("本地存储信息时间超过2天，删除本地数据后引导用户从新登陆");
                showLogin();
                return;
            }
            var userInfoJsonStr = userInfoToJsonStr(localStorage.getItem("type"),localStorage.getItem("uid"),localStorage.getItem("name"),localStorage.getItem("image"),localStorage.getItem("unionid"));
            checkUser(userInfoJsonStr);//成功则返回到loginEng(),否则进入登录页面.
        }
    }else{ //当前浏览器不支持H5 localStorage，直接跳转登陆页
        console.log("这个浏览器不支持HTML5的localStorage.");
        toast("这个浏览器不支持HTML5的localStorage.每次均需登录进入.");
        showLogin();
    }
}

function handleCookie(){
    var cookieUserStr = readCookie();//向服务器提交用户信息前，先将方法参数封装成一个json格式的字符串，使用时在转成Json对象，这是开会时说的。userInfoToJsonStr方法是通用的，定义在common-xunta.js里面

    var u = JSON.parse(cookieUserStr);
   if(u.image==null||u.image==""){
   		u.image="https://42.121.136.225:8888/user-pic2.jpg";//2018.01.29 叶夷    将http更改成https
   		toast("授权登录的第三方帐号缺少头像数据,暂时采用本系统默认用户头像.建议登录后马上更改头像.");
   }
   if(u.name==null||u.type==null||u.unionid==null){
        toast("由于某种原因,登录信息不完整，请尝试重新登录或与开发者联系.");
        showLogin();
        return;
   }
    //向服务器提交用户信息并保存在服务器，同时返回一个服务器生成的用户ID。用来作为用户在应用中的唯一ID
    syncUser(cookieUserStr);
}//syncUser成功,则回调下面的saveUserSuccess(),否则停止拖拉机.
function syncUserSuccess(userInfo){//暂时用不着了.
	uStr = JSON.stringify(userInfo);
	console.log("syncUser获得的uid等用户信息存入localStorage.");
	saveUser2LocalStorage(uStr);
    deleteCookie();
    loginEnd(uStr);
/*
    var userinfo =null;
        uid = userinfo.userid;
    //存储用户信息到本地前，先将方法参数封装成一个json格式的字符串，使用时在转成Json对象，这是开会时说的。userInfoToJsonStr方法是通用的，定义在common-xunta.js
    var userStr = userInfoToJsonStr(type,uid,name,image,unionid);
    saveUser2LocalStorage(userStr);
    //return storageLocalUserInfoParameterChangeJsonStr;
    //上面是我注释掉的,在一个页范围内传递参数不需要字符串化:
    var userInfoJStr = userInfoToJsonStr(type,uid,name,image,unionid);
   	return userInfoJStr*/
}

function readCookie(){
//将用户信息从cookie中取出
    var type = getCookie("type");
    var uid  = getCookie("uid");
    var name = getCookie("name");
    var image = getCookie("image").replace("\"","").replace("\"","");
    var unionid = getCookie("unionid");
    
    /**
     * 读取cookie中的openid
     * @author 叶夷
     */
    var openid =getCookie("openid");
    console.log("readCookie openid: "+openid);
    //向服务器提交用户信息前，先将方法参数封装成一个json格式的字符串，使用时在转成Json对象，这是开会时说的。userInfoToJsonStr方法是通用的，定义在common-xunta.js里面
    return userInfoToJsonStr(type,uid,name,image,unionid,openid);
}


//--------------------------  cookie 增删改查
function checkCookie() {
    var cookie_type = getCookie('type');
    console.log("checkCookie() - cookie_type= "+cookie_type);
    if (cookie_type != null && cookie_type != "" && cookie_type != "no" && cookie_type != undefined) {
        return 'yes';
    } else {
        return 'no';
    }
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1)
                c_end = document.cookie.length
            if (c_name == "name") {
                return decodeURI(document.cookie.substring(c_start, c_end));
            }
            return document.cookie.substring(c_start, c_end);
        }
    }
    return ""
}

function deleteCookie(){//zheng 2016.04.15 修改删除cookie方法，变为将cookie有效期设成过去 
	var type = getCookie('type');

    var strCookie=document.cookie;
    var arrCookie=strCookie.split("; "); // 将多cookie切割为多个名/值对
    console.log("cookie String ="+strCookie);
    var exp=new Date();
    exp.setTime(exp.getTime()-100);//让它等于-1就可以了.xu
    for(var i=0;i<arrCookie.length;i++){ // 遍历cookie数组，处理每个cookie对
        console.log("删除cookie...arrCookie["+i+"]  =  "+arrCookie[i]);
        var arr=arrCookie[i].split("=");
        //cookieValue =  arr[0]+"=no; Expires="+exp.toGMTString()+";Path=/";
        //cookieValue =  arr[0]+"=no; Expires="+exp.toGMTString()+"; Domain=www.xunta.so; Path=/";
        //cookieValue =  arr[0]+"=no; Expires='-1'; Path=/";
        
        //删除cookie的字串中,不能有domain=xxx,否则会新产生一个.xxx这样的新cookie. Expires=-1的方法不能删掉cookie
        //后面的path的值要与待删掉的cookie的path值一样,否则会生成新cookie.
        //WX与QQ返回来的cookie的path值是不一样的,因此下面要分别处理:xu 2016.4.20
        var cookieValue;
/*        
        if (type == "WX"){
        	cookieValue =  arr[0]+"=no; Expires="+exp.toGMTString()+"; Path=/";
        }
        
        if (type == "QQ"){
        	if(domain == "www.xunta.so"){
        		cookieValue =  arr[0]+"=no; Expires="+exp.toGMTString()+"; Path=/xunta-web";
        	}else{
        		cookieValue =  arr[0]+"=no; Expires="+exp.toGMTString()+"; Path=/";
			}
        }
*/
      	if ((type=="QQ")&&(domain=="www.xunta.so")&&(userAgent[1]!="IE11")){
  			cookieValue =  arr[0]+"=no; Expires="+exp.toGMTString()+"; Path=/xunta-web";
  			console.log("判断为qq登录, xunta.so进入, 浏览器非IE,此时删除cookie时path=/xunta-web. 注意是否成功删除了cookie"); 
        }else{
        	cookieValue =  arr[0]+"=no; Expires="+exp.toGMTString()+"; Path=/";//这几个写法都无法删除ie中的cookie. path值不起作用. 过期值起作用.
        	//cookieValue =  arr[0]+"=no; Expires="+exp.toGMTString();
        	//cookieValue =  arr[0]+"=no; Path=/";
        }
        console.log("要写入的cookieValue = "+cookieValue);
        window.document.cookie=cookieValue;
    }
}

//存储用户信息到本地
function saveUser2LocalStorage(userInfoJsonStr){
    var timestamp = Date.parse(new Date());
    var userInfoJsonObj = JSON.parse(userInfoJsonStr);
    localStorage.setItem('type', userInfoJsonObj.type);
    localStorage.setItem('uid', userInfoJsonObj.uid);
    localStorage.setItem('name', userInfoJsonObj.name);
    localStorage.setItem('image', userInfoJsonObj.image);
    localStorage.setItem('unionid', userInfoJsonObj.unionid);
    localStorage.setItem('timestamp',timestamp);
}

/**
 * QQ登录请求并获取QQ用户信息 9.14 Fang
 * */
function qq_login() {
	
	var redirect_uri;
	if(domain == 'www.xunta.so'){
		redirect_uri = "https://xunta.so/qq_callback";//2018.01.29 叶夷    将http更改成https
	}else{
		redirect_uri = "https://"+domain+"/qq_callback";//2018.01.29 叶夷    将http更改成https
	}
	
    window.location = "https://graph.qq.com/oauth2.0/authorize?client_id="+qqappid+"&redirect_uri="+redirect_uri+"&response_type=code&state="+qqappkey+"&scope=get_user_info,add_topic,add_one_blog,add_album,upload_pic,list_album,add_share,check_page_fans,add_t,add_pic_t,del_t,get_repost_list,get_info,get_other_info,get_fanslist,get_idollist,add_idol,del_ido,get_tenpay_addr";
}

/**
 * WX登录请求并获取WX用户信息 9.14 Fang
 * */
function wx_login() {
    var redirect_uri = "https://"+domain+"/wx_callback";//2018.01.29 叶夷    将http更改成https
    window.location = "https://open.weixin.qq.com/connect/qrconnect?appid="+wxappid+"&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_login&state="+wxstate+"#wechat_redirec";
}

//比较本地信息存储的时间戳与当前时间戳，如果当前时间戳大于信息存储时间戳2天，返回true，否则返回flase
function compareTimestamp(){
    var localTimestamp = localStorage.getItem("timestamp");
    var currentTimestamp = Date.parse(new Date());
    var timeDifference_s = currentTimestamp - localTimestamp;
    console.log(currentTimestamp+'      '+localTimestamp);
    var timeDifference_d = timeDifference_s / 1000 / 60 / 60 / 24; //用时间差除以60秒得分，除以60分得小时，除以24小时得天。
    console.log("当前时间与本地信息存储时间相差 ："+timeDifference_d+"天");
    if(timeDifference_d > 2){
        console.log("本地信息存储时间超过2天，准备让用户重新登录");
        localStorage.clear();
        return false;
    }else{
        console.log("本地信息存储时间未超过2天，重设初始时间为当前时间.")
        localStorage.setItem("timestamp",currentTimestamp);
        return true;
    }
}
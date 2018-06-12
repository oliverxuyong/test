var userMobileNum;

function loginBegin(){//login的起点.
    //先检查是否本地测试，如果是本地测试，isLocalTest变量为true.
    if (isLocalTest){  //用户模拟用户信息后请求话题列表数据并打开话题列表
    	var userInfo = preDefinedUserInfo();
    	userInfoIsReady(userInfo);
        return //提前结束.
    }
	getUserInfo();//成功则回调到loginEnd().//web则进入login_web.js,app则进入login_app.js
					//不成功则打开登录页面.
}

function loginEnd(userinfo){//login的终点.
	userInfoIsReady(userinfo);//回到index.html
}

// 向服务器提交登陆后的用户信息，  groupname这个参数是xunta_config.xml里面配置的，用来给当前登陆用户分配话题组
//web中,只有qq微信登录才会生成cookie,并转到这里存储;在app中,qq微信登录成功后会直接转到这里.unionid是第三方返回来的唯一标识.
//返回cookie,应该是服务器已经记录好用户信息了, 不需要再save了.但是app需要save吧?
function syncUser(cookieUserStr){//cookie之后到这里.如果是新用户,服务器则新建一个帐号,如果是老用户(,则原样返回.
    //var dfd = $.Deferred();
    var u = JSON.parse(cookieUserStr);
    /*
    var type = userInfoJsonObj.type;
    var uid = userInfoJsonObj.uid;
    var name = userInfoJsonObj.name;
    var image = userInfoJsonObj.image;
    var unionid = userInfoJsonObj.unionid;
    */
   console.log("已进入syncUser, groupname="+groupName);
   console.log("查看name有没有被urlecnode？"+u.name);
   console.log("name:"+u.name+"; type:"+u.type+"; third_party_id:"+u.unionid+"; imageurl:"+u.image+";openid:"+u.openid);
   
   //放在这里判断,应该是各种登录最后都汇集到这里:
   if(u.image==null||u.image==""){
   		u.image=window.location.protocol+"//42.121.136.225:8888/user-pic2.jpg";
   }
   
   if(u.name==null||u.type==null||u.unionid==null){
        toast("账号信息不全，请重新登录");
        //showLogin();
        tmpLoginForGetUserInfo();
        return;
   }
   
   
    $.ajax({
        url : window.location.protocol+"//" + domain + "/xunta-web/save_user",
        action : "post",
        contentType : "application/x-www-form-urlencoded; charset=utf-8",
        dataType : "jsonp",
        jsonp : 'callback',
        jsonpCallback : "success_save_user", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        data : {	type :u.type,
            		third_party_id : u.unionid,
            		name : u.name,
            		image_url : u.image,
            		groupname : groupName, 
            		openid : u.openid },
        async : false,
        success : function(data, textStatus) {
        	if(data.userid != null){//这个地方是否需要更多的成功判断?xu
        		console.log("syncUser返回uid="+data.userid);
        		u.uid = data.userid;//服务器会根据unionid返回uid.
        		u.name = data.username;
        		syncUserSuccess(u);
        	}
            //return data.userid;
            //dfd.resolve(data);
        },
        error : function(data, textStatus) {
            console.log("syncUser出错,停止拖拉机.");
        	clickLoadingtextEvent();//ajax请求失败后重新执行startLogin方法，从来一遍，这个以前说过的，因为几率不大，所以可以重来
        	//showLogin();
        	return;
           //return "Request an exception occurs"
            //dfd.resolve("Request an exception occurs");
        }
    });
    //return dfd.promise()
}

//-------------------------- 用户信息检查
function checkUser(userInfoJsonStr) {//读取localStorage之后到这里.
 	if(!checkIfOnline4Ajax()){//如果不在线,则终止执行, 停止拖拉机.
		clickLoadingtextEvent();
		toast("检测发现当前浏览器没有接入网络,请接入后再尝试."); 		
 		console.log("checkUser之前发现断网,停止拖拉机.");
	 		return
		}
 
	    var u = JSON.parse(userInfoJsonStr);
	    $.ajax({
	        url : window.location.protocol+"//" + domain + "/xunta-web/checkuser",
        action : "post",
        timeout : 7000,
        dataType : "jsonp",
        jsonp : 'callback',
        jsonpCallback : "success_save_user", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        contentType : "application/x-www-form-urlencoded; charset=utf-8",
        data : {
            userid : u.uid
        },
        async : false,
        success : function(data, textStatus) {
         	console.log("checkUser成功返回数据.")
            if (data.if_exist == '1') {
                // 0表示不存在  1表示存在
                var userInfoJsonObj = JSON.parse(userInfoJsonStr);//将json格式的字符串转换成JSON对象
                //下面这两步是为了:用户在不同的地方登录后在本地留下昵称,当用户在另外一个地方改昵称后,这个本地昵称没有同步修改.
                userInfoJsonObj.name = data.userName;//将服务器返回来的昵称替换掉登陆成功后获得的昵称
                localStorage.setItem("name",data.userName);//将服务器返回来的新昵称替换掉本地的昵称
                userInfoIsReady(JSON.stringify(userInfoJsonObj));
            } else {
                console.log("checkUser证实localstorage中的用户数据在服务器上不存在,进入登录页面.")
                //showLogin();
                tmpLoginForGetUserInfo();
            }
        },
        error : function(data, textStatus) {//网线拔了后,浏览器会报jquery无网错误,但不会走到这里.
         	console.log("checkUser出错,拖拉机停止.")
         	log2root("checkUser出错,拖拉机停止.")
        	clickLoadingtextEvent();
        	//showLogin();
        }
    });
}


function checkIfOnline4Ajax(){
// console.log("第四步online="+window.ononline);
// console.log("第四步online="+window.onoffline);
// console.log("第四步navigator.onLine="+navigator.onLine);
	return navigator.onLine //如果这句不可靠, 可以再加其它测试手段.
}


//--------------------------- 辅助类
//用户在话题列表注销后会调用该方法，用来显示Login元素和其他
function showLogin(){
    $("#loadinganimation").css("display","none");//在重新登录时需要这句.
    $("#mobilephone-login-container").hide();
    $("#login").show();//这两句是xu增加的.2016.3.12
    $("#welcomepicture_container").show();
    
    
    //2017.11.17  叶夷  在这里判断如果是PC和ipad,则三个登录方式都显示，如果是移动端，则只有手机登录
    showLoginMode();
}

/**2018.03.08  叶夷      
 * 为了测试阶段取消登陆页面，在这里把上面的方法（登录页面出现的方法showLogin()）在这里被替代
 * 在这里从服务器获取用户信息数据，之后直接调用exitmobilelogin_gobacktoindexpage(receivedData)方法
 * receivedData数据格式
 * 	{ "userid", userid,
	  "username", username,
	  "image_url", image_url,
	  "code", "1",
	  "message", "登录成功"}
 */
function tmpLoginForGetUserInfo(){
	//放一个模拟数据用来测试
	/*var receivedData = 
			{ userid:"932909988979019776",
			  username: "叶汉良",
			  image_url: "../image/guideMU1.png",
			  code: "1",
			  message: "登录成功"};
	exitmobilelogin_gobacktoindexpage(receivedData);*/
	//2018.06.12   叶夷    在tmp_login接口中加上event_scope数据
	var event_scope=window.location.search.split("=")[1];
	$.ajax({
        url : window.location.protocol+"//" + domain + "/tmp_login",
        action : "post",
        contentType : "application/x-www-form-urlencoded; charset=utf-8",
        data:{event_scope:event_scope},
        dataType : "jsonp",
        jsonp : 'callback',
        jsonpCallback : "callback_registerbymobilephone",
        /*success : function(data, textStatus) {
        	console.log("tmp_login获得用户信息："+JSON.stringify(data));
        	exitmobilelogin_gobacktoindexpage(data);
        },*/
        error : function(data, textStatus) {//网线拔了后,浏览器会报jquery无网错误,但不会走到这里.
        	console.log("tmp_login获得用户信息失败,重新请求.")
        	log2root("tmp_login获得用户信息失败,重新请求.")
        	//tmpLoginForGetUserInfo();
        }
	});
}



/**2017.11.17  叶夷  在这里判断如果是PC和ipad,则三个登录方式都显示，如果是移动端，则只有手机登录*/
function showLoginMode(){
	console.log("判断终端类型 "+userAgent);
	//if(userAgent[0]=="Mobile"){
		$("#login").children("div").eq(0).hide();
		$("#login").children("div").eq(1).hide();
		$("#login>div").css("width","60%");
		$("#login>div").css("border-color","#b2b2b2");
	//}
}

function hideLogin(){
    $("#login").hide();//这两句是xu增加的.2016.3.12
    $("#welcomepicture_container").hide();
}
/*
function hide_mobilephoneloginform(){
	$("#login").hide();//这两句是xu增加的.2016.3.12
    $("#welcomepicture_container").hide();
}*/


//以下全部为手机登录相当代码:
function show_mobilephoneloginform(){//打开手机登录/注册页面,先把不需要的元素全部隐藏.这里不专门分出登录和注册,看手机是否已注册来临时决定.
    $("#login").hide();//这两句是xu增加的.2016.3.12
    $("#welcomepicture_container").hide();
    
    $("#mobilephone-login-container").show();
    $("#countrycode,#inputbox_mobileno,#button_checkonmobileno").show();
    $("#graphcode,#graphcode img,#inputbox_graphcode,#button_requestSendSMSCode,#changegraphcode").hide();
    $("#inputbox_graphcode").val("输入图形码");
    $("#button_requestSendSMSCode,#button_requestSendSMSCode4Resetpassword").hide();
    $("#inputbox_smscode").hide();
    $("#inputbox_smscode").val("输入短信验证码");
    $("#inputbox_nickname").hide();
    $("#inputbox_nickname").val("输入昵称");
    $("#inputbox_password2login,#inputbox_password2register,#inputbox_resetpassword").hide();
	$("#inputbox_password2login").attr('type','text');
    $("#inputbox_password2login").val("输入登录密码");
    $("#inputbox_resetpassword").val("重设登录密码");
    $("#inputbox_password2register").val("设置登录密码");
    $("#forgetpassword").hide();
    $("#button_registerbymobilephone").hide();
    $("#button_resetandloginbymobilephone").hide();
    $("#button_loginbymobilephone").hide();
    $("#button_requestSendSMSCode4Resetpasswordfont").text("发送短信码");
    $("#button_requestSendSMSCodefont").text("发送短信码");
    changGraphCode();
}

function checkonmobileno(){//输入手机号后执行这个方法,向后台传送手机号,后台返回是否已注册.
    var input_mobileno = document.getElementById("inputbox_mobileno").value;
    if (!verifyMobileNumCorrection(input_mobileno)) {
        toast("这个号码看起来不像是个手机号,请重新输入.");
        return;
    }
    userMobileNum = input_mobileno;//在本页全局变量中存放用户手机号.
    console.log("checkonmobileno - userMobileNum:"+userMobileNum);
    var data2send = {phonenumber : input_mobileno};
    url = window.location.protocol+"//"+domain+"/xunta-web/check_mobilenum_ifexist";
    ajax2server_Jsonp(url,data2send,"callback_checkonmobileno");
}//上为请求,下为回调.
function callback_checkonmobileno(receivedData){
    show_mobilephoneloginform();//由于随时会半路返回按下一步,先清理所有已经显示出来的元素.
    console.log(receivedData.ifexist);//手机号已存在则返回yes,否则为no.
    if (receivedData.ifexist == "no"){//若手机号是新号,则显图形码输入框及短信码按钮.
        toast("该手机号为新号.请输入图形验证码,然后请求发送短信验证码.");

		//new Toast({context:$('body'),message:'该手机号为新号.请输入图形验证码,然后请求发送短信验证码.'}).show(); 

        $("#graphcode,#graphcode img,#changegraphcode,#inputbox_graphcode,#button_requestSendSMSCode").show();
    }else{//如果已存在,显示密码输入框及登录大按钮.
        toast("该手机号已经注册,请输入密码,然后登录.");
		//new Toast({context:$('body'),message:'该手机号已经注册,请输入密码,然后登录.'}).show(); 

        $("#inputbox_password2login,#forgetpassword,#button_loginbymobilephone").show();
        $("#inputbox_password2login").focus();
    }
}

function verifyMobileNumCorrection(input_mobileno){//验证手机号的合法性.
    //console.log(input_mobileno.length+"|"+input_mobileno.charAt(0));
    if((input_mobileno.length == 11)&&(input_mobileno.charAt(0) == "1")){
        for(var i=0;i<=10;i++){
            if (input_mobileno.charAt(i)<"0" || input_mobileno.charAt(i)>"9"){
                return false;
            }
        }
        //console.log("对了");
        return true
    }else{
        return false
    }
}

function forgetPassword(){//点击忘记密码后,显示"新"密码输入框,及为找回密码而设的短信发送按钮.
    show_mobilephoneloginform();//由于随时会半路返回按下一步,先清理所有已经显示出来的元素.
    toast("若忘记密码,请先输入图形验证码,然后请求发送短信验证码.");
    $("#graphcode,#graphcode img,#changegraphcode,#inputbox_graphcode, #button_requestSendSMSCode4Resetpassword").show();
}

function requestSendSMSCode4Resetpassword(){//在忘记密码并显示图形码后,点击发送短信密码后,执行这个方法,显示短信码/昵称/新密码等输入框及注册按钮.
    var input_graphcode = $("#inputbox_graphcode").val();
    var data2send = {	phonenumber : userMobileNum,
        graph_code:input_graphcode   	}
    console.log("图码="+input_graphcode+"|"+userMobileNum);
    var url = window.location.protocol+"//"+domain+"/xunta-web/get_mobilephone_validatecode";
    ajax2server_Jsonp(url,data2send,"callback_requestSendSMSCode4Resetpassword");
    $("#button_requestSendSMSCode4Resetpasswordfont").text("再次发送短信码");
}//上为请求,下为回调.
function callback_requestSendSMSCode4Resetpassword(receivedData){//短信码若发送成功,则显示短信码/新密码等输入框及重设密码并登录按钮.
    console.log("找回密码的短信验证码请求的回调:"+receivedData.code+"|"+receivedData.message);
    //receivedData.code = 0;//这里为了测试,临时设为0.
    if(receivedData.code == 0){	//成功code=0,失败code=1. 还有data.message(用于返回失败或成功类型)
        $("#inputbox_smscode, #inputbox_resetpassword, #button_resetandloginbymobilephone").show();
        toast("短信验证码已向"+userMobileNum+"发出.请查看手机短信,然后进行下一步.若未能及时收到短信,可再试一次.");
    }else{
        toast(receivedData.message);
    }
}

function changGraphCode(){
    var time = new Date();
    $("#graphcode img").attr("src",window.location.protocol+"//"+domain+"/xunta-web/get_graph_validatecode?time=new Date()?time="+time);
}

function requestSendSMSCode(){//手机号为新并输入图形码后,按请求短信码按钮则执行这个方法.
    var input_graphcode = $("#inputbox_graphcode").val();
    var data2send = {	phonenumber : userMobileNum,
        graph_code:input_graphcode   	}
    console.log("图码="+input_graphcode+"|"+userMobileNum);
    var url = "http://"+domain+"/xunta-web/get_mobilephone_validatecode";
    ajax2server_Jsonp(url,data2send,"callback_requestSendSMSCode");
    $("#button_requestSendSMSCodefontfont").text("再次发送短信码");
}//上为请求,下为回调.
function callback_requestSendSMSCode(receivedData){
    console.log(receivedData.code+"|"+receivedData.message);
    //receivedData.code = 0;//为了测试临时设为0
    if(receivedData.code == 0){//成功code=0,失败code=1. 还有data.message(用于返回失败或成功类型)
        //若短信发送成功,则显示短信码/昵称/新密码等输入框及注册并登录按钮.
        $("#inputbox_smscode, #inputbox_nickname, #inputbox_password2register, #button_registerbymobilephone").show();
        toast("短信验证码已向"+userMobileNum+"发出.请查看手机短信,然后进行下一步.若未能及时收到短信,可再试一次.");
    }else{
        toast(receivedData.message);
    }
}

function loginbymobilephone(){//老用户正常登录按钮后执行这个方法
    var input_password = document.getElementById("inputbox_password2login").value;
    console.log("loginbymobilephone - userMobileNum:"+userMobileNum);
    var data2send = {	password : input_password,
        phonenumber : userMobileNum,
    };
    url = window.location.protocol+"//"+domain+"/xunta-web/login_mobilephone";
    ajax2server_Jsonp(url,data2send,"callback_loginbymobilephone");
}//上为请求,下为回调.
function callback_loginbymobilephone(receivedData){
    console.log("callback_loginbymobilephone-"+receivedData.userid+"|"+receivedData.username);
    console.log("callback_loginbymobilephone-"+receivedData.code+"|"+receivedData.message);
    if(receivedData.userid != undefined){
        console.log("手机登录成功了:"+receivedData.userid+"|"+receivedData.username);
        $("#mobilephone-login-container").hide();
        exitmobilelogin_gobacktoindexpage(receivedData);
        toast("手机登录成功,进入主页...");
    }else{
        console.log("手机登录不成功:"+receivedData.code+"|"+receivedData.message);
        log2root("手机登录不成功:"+receivedData.code+"|"+receivedData.message);
        toast(receivedData.message);
    }
}

function resetandloginbymobilephone(){//老用户按重设密码并登录按钮执行这个方法
    var input_password = document.getElementById("inputbox_resetpassword").value;
    var input_smscode = document.getElementById("inputbox_smscode").value;
    console.log("重新 input_password="+input_password);
    var data2send = {
        newpasswd : input_password,
        phonenumber : userMobileNum,
        phonevalidatecode : input_smscode  };
    url = "http://"+domain+"/xunta-web/resetpwandlogin";
    ajax2server_Jsonp(url,data2send,"callback_resetandloginbymobilephone");
}//上为请求,下为回调.
function callback_resetandloginbymobilephone(receivedData){
    if(receivedData.userid != undefined){
        console.log("手机重设密码并登录成功了:"+receivedData.userid+"|"+receivedData.username);
        $("#mobilephone-login-container").hide();
        exitmobilelogin_gobacktoindexpage(receivedData);
         toast("手机重设密码成功,进入主页...");
    }else{
        console.log("手机重设密码并登录不成功:"+receivedData.code+"|"+receivedData.message);
        toast(receivedData.message);
    }
}

function registerbymobilephone(){//新用户最后按钮注册并登录按钮执行这个方法.
    var input_nickname = document.getElementById("inputbox_nickname").value;
    var input_password = document.getElementById("inputbox_password2register").value;
    var input_smscode = document.getElementById("inputbox_smscode").value;
    var data2send = {	nickname : input_nickname,
        groupname : groupName,
        password : input_password,
        phonenumber : userMobileNum,
        phonevalidatecode : input_smscode  };
    url = window.location.protocol+"//"+domain+"/xunta-web/register_mobilephone";
    ajax2server_Jsonp(url,data2send,"callback_registerbymobilephone");
}//上为请求,下为回调.
function callback_registerbymobilephone(receivedData){
    if(receivedData.userid != undefined){
        console.log("手机注册成功:"+receivedData.userid+"|"+receivedData.username);
        $("#mobilephone-login-container").hide();
        exitmobilelogin_gobacktoindexpage(receivedData);
        //toast("手机注册成功,进入主页...");
    }else{
        console.log("手机注册不成功:"+receivedData.code+"|"+receivedData.message);
        toast(receivedData.message);
    }
}

//下为以jsonp为数据格式的标准ajax请求方法.所有ajax通讯都通过这个方法,以免出现大量重复的ajax代码.
//本项目的其它ajax通讯也建议使用该方法.//?
function ajax2server_Jsonp(url,data2send,callbackfunction){
    console.log("将发送ajax通讯:"+url+"|"+JSON.stringify(data2send)+"|"+callbackfunction);
    $.ajax({
        url : url,
        action : "post",
        contentType : "application/x-www-form-urlencoded; charset=utf-8",
        dataType : "jsonp",
        jsonp : 'callback',
        jsonpCallback : callbackfunction,
        data :data2send,
        error : function(data, textStatus) {
            console.log("ajax通讯出现错误,请稍后再试试,或加QQ2234119978请求帮助.");
            toast("ajax通讯出现错误,请稍后再试试,或加QQ2234119978请求帮助.");
        }
    });
}

function exitmobilelogin_gobacktoindexpage(receivedData){
    console.log("注册登录或重设密码成功后准备打开列表页:"+receivedData.userid+"|"+receivedData.username+"|"+receivedData.image_url);
    saveUser2LocalStorage(userInfoToJsonStr('mobilephone',receivedData.userid,receivedData.username,receivedData.image_url,receivedData.userid));
    hideLogin();
    var userInfoJsonStr = userInfoToJsonStr('mobilephone',receivedData.userid,receivedData.username,receivedData.image_url,receivedData.userid)
    //userInfoIsReady(userInfoJsonStr);//返回到index页面.
    start();//返回到index页面.
}

function preDefinedUserInfo(){
//本地localhost测试,只需解除下两句的注释,并在xunta_config.xml中设置好后台的domain.同时解除185行上这句的注释: domain = xmlObj.find("domain").text();
            //正式版服务器上的帐号:
            var testtype='QQ';
			var testuid='670182701776637952';
			var testname='语擎';
			var testimage='http://q.qlogo.cn/qqapp/1104713537/339A9FCD49DE1268435D7F2E18C4FD2E/40';
			var testoriginalid = "339A9FCD49DE1268435D7F2E18C4FD2E";
			var testunionid="339A9FCD49DE1268435D7F2E18C4FD2E";
			
            
            
            
            
            //模拟测试帐号:光头强,对应iphone6的微信号
//			var testtype='WX';
//			var testuid='654215301193404416';//636270250438037504';
//			var testname='光头强1';
//			var testimage='http://wx.qlogo.cn/mmopen/USH8Nb3Hz5TOBhibHNJoKbMhheXXCypicu9W2JEHYKMgYr0G3KqJUw3JpmjgVkxc9l6T6aDG5EAbVsRaQkTqGibIKU4Pb35deu9/46';
//			var testoriginalid = "o48POs3nMZ_A-wufSIQrZqUi8nlA";
//			var testunionid="o48POs3nMZ_A-wufSIQrZqUi8nlA";
			
			//模拟测蔗帐号:语擎-兴趣社交引擎,对应QQ7597399
			//var testtype = 'QQ';
			//var testuid = '654214903657271296';//636082515689476096';
			//var testname = '语擎-兴趣社交引擎';
			//var testimage = 'http://q.qlogo.cn/qqapp/1104713537/339A9FCD49DE1268435D7F2E18C4FD2E/40';
            //var testunionid ='339A9FCD49DE1268435D7F2E18C4FD2E';
            
			//模拟测试帐号:红鲤鱼与绿鲤鱼与驴
			//var testtype = 'QQ';
			//var testuid = '654216376927522816';
			//var testname = '红鲤鱼与绿鲤鱼与驴';
			//var testimage = 'http://q.qlogo.cn/qqapp/1104713537/A8C80A5E5F852E52639B7BC82FE31D54/40';
            //var testunionid='A8C80A5E5F852E52639B7BC82FE31D54';

			//模拟测试帐号:方圆一户
//			var testtype = 'QQ';
//			var testuid = '666798948727525376';
//			var testname = '方圆一户';
//			var testimage = 'http://q.qlogo.cn/qqapp/1104713537/8EA50F96B018682F4A343A1C28E1CF2D/40'
//            var testunionid='8EA50F96B018682F4A343A1C28E1CF2D';

			//模拟测试帐号:Aaron+++Www~~
//			var testtype = 'wx';
//			var testuid = '681723620032122880';
//			var testname = 'Aaron+++Www~~';
//			var testimage = 'http://wx.qlogo.cn/mmopen/hNg774YrEdNTXGb0SnyOG0vS4MC9VtdhvgoKPHxU1XcXxfBbiaYSdluPSGpLH8CkIRUqZrGLibTlBusxvRqfZ5PnqOuYxkvZYL/0'
//           var testunionid='ohc9ts8EzFQ8JnfozEW2wYB-u5cM';
            
            //模拟测试帐号:Bright
//			var testtype = 'QQ';
//			var testuid = '671224519653986304';
//			var testname = 'Bright';
//			var testimage = 'http://q.qlogo.cn/qqapp/1104713537/3D646864B3BDD36E494217D7271C8504/40';
//			var testunionid = '3D646864B3BDD36E494217D7271C8504';
			
			//模拟测试帐号:Bright+
			//var testtype = 'WX';
			//var testuid = '681716478642360320';
			//var testname = 'Bright+';
			//var testimage = 'http://wx.qlogo.cn/mmopen/ibKHP1TZZeXLGA5Fchm7xcXUicYozdqfnSqjy3TUKdhdH2FHBN5ctO8oqVib60ItbwkKiaaK5RdkKDIYqoAibOFPyuBqR9C1DqRFR/0';
			//var testunionid = 'ohc9ts1Ce7Girwu_biwEs5tzEGHM';
			
			//模拟测试帐号:abdc1234
			//var testtype = 'QQ';
			//var testuid = '694094636964253696';
			//var testname = 'abdc1234';
			//var testimage = 'http://qzapp.qlogo.cn/qzapp/101214455/8204A3E381349CA9784278FD8923B1DB/50';
			//var testunionid = '8204A3E381349CA9784278FD8923B1DB';
    return userInfoToJsonStr(testtype,testuid,testname,testimage,testunionid);
}

// 将用户信息封装成json数据格式并字符串化. 我把它移到这里来了.xu
function userInfoToJsonStr(userType, userUid, userName, userImage, P_unionid,openid) {
    var userInfo = {
        "type" : userType,
        "uid" : userUid,
        "name" : userName,
        "image" : userImage,
        "originalUid" : P_unionid,
        "unionid" : P_unionid,
        "openid" : openid
    };
    return JSON.stringify(userInfo);
}

// 将用户信息封装成json数据格式. 这是我增加的,因为返回userInfo不需要字符串化.2016.3.30
function userInfoToJson(userType, userUid, userName, userImage, P_unionid) {
    var userInfo = {
        "type" : userType,
        "uid" : userUid,
        "name" : userName,
        "image" : userImage,
        "originalUid" : P_unionid,
        "unionid" : P_unionid
    };
    return userInfo;
}

		/*function hideLoadinganimation() {
//			$("#loadinganimation img").attr('src', 'image/tractor.jpg');
            $("#loadinganimation").hide();
            $("#logging").hide();
		}*/


function setTopicsPageOpenMark() {
	topicsPageOpenMark = "yes";//变量在index.html
}

function clearTopicsPageOpenMark() {
	topicsPageOpenMark = "no";//变量在index.html
}


		function logging(logtext) {//向index页面写入log信息.其它页由common_xunta.js里的同名方法调用.
			var date = new Date();
			logtext = "■ " + logtext + " {" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "}";
			$("#logging").append("<div>" + logtext + "</div>");
		}

		function hideIndexLogInfo() {
			$("#logging").hide();
		}

        /**
         * 将userInfo封装JSON
         * */
        function userInfoToJson(userType, userUid, userName, userImage, userOriginalUid, userLogOff, union_id) {
            var userInfo = {
                "type" : userType,
                "uid" : userUid,
                "name" : userName,
                "image" : userImage,
                "originalUid" : userOriginalUid,
                "logOff" : userLogOff,
                "unionid" : union_id
            };
            return userInfo;
        }

        // 显示拖拉机效果的方法
        function showLoadingtext(){
            if ($("#loadinganimation").find("#loadingtext").length == 0) {
                $("#loadinganimation").append($("<div></div>").attr("id", "loadingtext").text("正在登录中..."));
                $("#loadinganimation").append($("<img>").attr("src", "image/tractor-short.gif"));
            }
        }
        function createPublicParam4UserInfo(userinfo){
            var userinfoObj = JSON.parse(userinfo);
            userId = userinfoObj.uid;
            userName = userinfoObj.name;
            userImage = userinfoObj.image;
            userInfo = userinfoObj;
        }
        
		function readXuntaConfigXml() {//读取config, 
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
					//先取出对web和app都相同的全局参数:
                	var xmlObj = $(xml).find('public_param');
                	projectType = xmlObj.find("projectType").text();
                    if(projectType == "APP"){
	                    domain = xmlObj.find("app").find("domain").text();
	                    groupName = xmlObj.find("app").find("groupName").text();
	                    pageTitle = xmlObj.find("app").find("pageTitle").text();//该变量在app里没用.
                    	adminName = xmlObj.find("app").find("adminName").text();
                    	adminImageurl = xmlObj.find("app").find("adminImageurl").text();
                    }else if (projectType == "WEB"){ 
	            		domain = document.domain;//首先根据浏览器的访问地址获取domain.
                		var domainArr = domain.split(".");
                		var projectName;//用于
                		if(domain.indexOf("www") == -1){//从当前网址获知属于哪个项目://最好用遍历项目并检查是否包含的方法.xu
		   					projectName = domainArr[0];
		   					domain = "www."+domain;
		   				}else{
	   						projectName = domainArr[1];
	   					}
	                    var projectObj = xmlObj.find("web").find(projectName);//获得该项目下的公共参数:            
                    	pageTitle = projectObj.find("pageTitle").text();
                    	groupName = projectObj.find("groupName").text();
                    	adminName = projectObj.find("adminName").text();
                    	adminImageurl = projectObj.find("adminImageurl").text();
                    	faviconUrl = projectObj.find("faviconUrl").text();
                    	wxappid = projectObj.find("wxappid").text();
                    	wxstate = projectObj.find("wxstate").text();
                    	qqappid = projectObj.find("qqappid").text();
                    	qqappkey = projectObj.find("qqappkey").text();
                    
                    	if(projectName == "localhost"){ //只有web版才需要在本地测试时读取config里的domain.xu 
                    		domain = projectObj.find("domain4test").text();//其它参数通过项目名称已经读出.
               			}
               		}
               		console.log("正在访问："+domain+"; pageTitle:"+pageTitle+"; adminName:"+adminName+"; adminImageurl:"+adminImageurl+
                    			"; projectType:"+projectType+"; projectName:"+projectName+";groupName:"+groupName);
                }
            });
        }
        

/*
 ws.js返回来的新名字，要在列表页上修改dom元素
 * */
//这个方法从列表页移到这里,用于修改本地所有昵称:xu 2016.4.15
function changeAllNickNames(newNickname) {
	var scriptStr = "updateNickname('" + newNickname + "')";
	for (var n = 0; n < dialogPageArray.length; n++) {
		console.log("正在所有页面中的昵称,目前修改的页面是pagename="+dialogPageArray[n]);
		exec(dialogPageArray[n], scriptStr);
	}//这个循环是修改聊天页的昵称.
	//exec("topics_page", scriptStr);//单独修改列表页昵称.
	/**start:叶夷  2017年3月20日
	 * 修改main_page中的username
	 */
	exec("main_page", scriptStr);
	/**
	 * end: 叶夷
	 */
	localStorage.setItem("name", newNickname);//更新本地文件，将更改后的昵称存储在本地，下次在登录时或凑个本地读取新昵称
}//请求服务器改名后的返回状态，这个方法只针对不成功的状态，改名成功会在上面的方式里面去做。 10.9

/*
*   点击注销按钮后关闭topics_page页面前要将打开的diglog_page页面都关闭
* */
//这个方法经过修改,可用于关闭所有对话页,但暂时没有用到,将来也许有用.xu 2016.4.15
function closeAllDialogPages(){
    for (var x = 0; x < dialogPageArray.length; x++) {//关掉所有页面,除index.html以外.
        if(dialogPageArray[x] != "search_page"){        
        	closeWin(dialogPageArray[x]);
        	console.log("正在关闭所有聊天页,这是其中之一 pagename="+dialogPageArray[x]);
        }
    }
}

//2018.02.05  叶夷     进入公司简介页面
function enterProfilePage() {
	console.log("enterProfilePage");
	openWin('profile_page', 'profile_page/profile_page.html', "");
}
//2018.02.05  叶夷     进入产品介绍页面
function enterProfilePage() {
	console.log("enterProductPage");
	openWin('product_page', 'product_page/product_page.html', "");
}

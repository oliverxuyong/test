<%@ page language="java"  pageEncoding="utf-8"%>

<%@ include file="/inc/_00meta.inc"%>

<%@page isELIgnored="false" %>

<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="xunta.so" content="寻TA网">
		<meta name="description" content="寻TA网_跨社区旅游搜人引擎">
		<meta property="qc:admins" content="65000324676505641637" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>寻TA网_跨社区旅游搜人引擎|XunTa.so|输入"知识点"关键词,寻找可信赖的旅伴,团长,导游,店家,餐馆,车主,博主...</title>
		<%pageContext.setAttribute("baseUrl",request.getContextPath()); %>
		<link rel="stylesheet" href="${baseUrl }/assets/bootstrap/3.0.0/css/bootstrap.min.css"/>
		<link rel="stylesheet" href="${baseUrl }/assets/bootstrap/3.0.0/css/bootstrap-theme.min.css"/>
		<link rel="stylesheet" href="${baseUrl }/assets/stylesheets/index.css" />
		<style>
			.media{
				border:1px dashed lightgray;
				padding:5px;
			}
		</style>
	</head>
	
	<body>
		<div class="navbar navbar-inverse navbar-fixed-top">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse"	data-target=".navbar-collapse">
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="#"><font size="2">首页</font></a>
				</div>
				<div class="collapse navbar-collapse">
					<ul class="nav navbar-nav">
						<li>
							<a href="http://www.aigine.com">关于语擎</a><%--
							<a href="servlet/Login?mark=qq&status=click">QQ</a>
						--%></li>
						  <li class="nav navbar-right"><a href="javascript:void(0);" onclick="qqlogin()" >
						  	<img src = "${baseUrl }/assets/images/QQ/Connect_logo_3.png">
						  </a></li>
						  <li class="nav navbar-right"><a href="javascript:void(0);" onclick="weibologin()" >
						  	<img src = "${baseUrl }/assets/images/weibo/xinlang.png">
						  </a></li>
						  <li class="nav navbar-right"><a href="javascript:void(0);" onclick="weixinlogin()" >
						  	<img src = "${baseUrl }/assets/images/wx.png">
						  </a></li>
					</ul>
	
					<ul class="nav navbar-nav navbar-right">
						<li class="dropdown">
								<a href="#" data-toggle="dropdown">帮助/讨论<b class="caret"></b> </a>
								<!-- dropdown? -->
								<ul  class="dropdown-menu" >
									<li><a href="http://jq.qq.com/?_wv=1027&k=RKZJsB"  target="_blank">进QQ群提问</a></li>
									<li><a href="http://weibo.com/XuntaSo" target="_blank">关注微博官方账号</a></li>
									<li onmouseover="js_show_weixinImg()" onmouseout="js_hidden_weixinImg()">
										<a href="javascript:void(0);">关注微信官方账号</a>
									</li>
									<li id="img_weixin" style="display:none">
											<a href="javascript:void(0);"><img src="assets/images/qrcode_for_gh_43f17f8952ea_258.jpg" width=80px height=80px></img></a>
									</li>
								</ul>
						</li>
					</ul>
			</div>
				<!--/.nav-collapse -->
			</div>
		</div>
		<div id="container">
			<div id="header"></div>
			<div id="body">
				
				<form class="form-inline search-form" role="form"
					action="psearch" method="get">
					<input type="hidden" name="searchTime" value="30days" />
					<input type="hidden" name="searchMode" value="newest">

					<table width="450" border="0" align="center" cellpadding="2"
						cellspacing="2">
						<tr>

							<td width="700" align="center">
								<img src="${baseUrl }/assets/images/xunta_logo_small.jpg"
									width="250" height="" align="center"><span id="test">(测试版)</span>
							</td>
						</tr>
						<tr>
							<td>
								<div class="row">
									<div class="col-lg-4">
										<div class="input-group">
											<label class="sr-only" for="keyword">
												搜索关键词
											</label>
											<input style="width: 450px;"
												class="form-control search-keywords" type="text"
												name="searchKeywords"
												placeholder="输入(多个)知识点关键词，寻找旅游达人、组织者、导游及结伴消息。"
												value="${pageData.searchKeywords}" />
											<span class="input-group-btn">
												<button id="search" class="btn btn-primary" type="submit">
													.SO
												</button>
											</span>
										</div>
										<!-- /input-group -->
									</div>
									<!-- /.col-lg-4 -->
								</div>
							</td>
						</tr>
					</table>
				</form>
				<br />
		
					<!-- <div id="text" align="center" color="#FF5809">大家在搜什么</div>
					
					<div id="history_searchWord">
					</div> -->
			</div>
			<div id="footer">
				<div id="logo" align="center">
					<img src="${baseUrl }/assets/images/lvyoulogo.jpg" width="1024" height="60" border="0" usemap="#Map">
					<map name="Map">
					  <area shape="rect" coords="9,16,62,45" href="http://www.ctrip.com/?utm_source=baidu&utm_medium=cpc&utm_campaign=baidu81&campaign=CHNbaidu81&adid=index&gclid=&isctrip=T " target="_blank">
					<area shape="rect" coords="65,15,117,45" href="http://www.qunar.com/" target="_blank">
					<area shape="rect" coords="126,18,181,44" href="http://www.elvxing.net/" target="_blank">
					  <area shape="rect" coords="191,17,253,44" href="http://www.lvmama.com/" target="_blank">
					  <area shape="rect" coords="260,16,293,45" href="http://www.lvye.cn/" target="_blank">
					<area shape="rect" coords="301,18,353,45" href="http://www.qyer.com/" target="_blank">
					  <area shape="rect" coords="363,15,431,45" href="http://www.sanfo.com/" target="_blank">
					    <area shape="rect" coords="439,18,495,44" href="http://travel.sina.com.cn/" target="_blank">
					    <area shape="rect" coords="502,18,550,44" href="http://www.weibo.com" target="_blank">
					    <area shape="rect" coords="561,17,618,45" href="http://www.tuniu.com/" target="_blank">
					      <area shape="rect" coords="623,22,688,47" href="http://www.douban.com/" target="_blank"><area shape="rect" coords="692,20,747,46" href="http://www.traveler365.com/" target="_blank">
					<area shape="rect" coords="752,19,798,43" href="http://bendi.niwota.com/" target="_blank">
					  <area shape="rect" coords="804,17,847,45" href="http://www.tianya.cn/" target="_blank"><area shape="rect" coords="852,21,917,45" href="http://bbs.wanjingchina.com/forum.php" target="_blank">
					<area shape="rect" coords="921,22,982,45" href="http://bbs.163.com/" target="_blank">
					<area shape="rect" coords="987,18,1014,45" href="http://www.doyouhike.net/" target="_blank">
					</map>
				</div>
				<div id="info">
					<div align="center">
						<font size="2">Powered by <a href="http://www.aigine.com"
							target="_blank">Aigine InfoTech Co.</a> </font>
					</div>
					<div align="center">
						<a href="http://www.miitbeian.gov.cn/"><font size="1">沪ICP备13012815-1号</font>
						</a>
					</div>
					<div align="center">
						<font size="2">© XunTa.so 2014</font>
					</div>
				</div>
			</div>
		</div>
				<script
			src="${baseUrl}/assets/javascripts/jquery-1.10.2.min.js">
</script>
		<script src="${baseUrl}/assets/bootstrap/3.0.0/js/bootstrap.js">
</script>

		<script type="text/javascript"
			src="${baseUrl}/assets/javascripts/application.js">
</script>

<script type="text/javascript">
function qqlogin(){
	
	window.location="${baseUrl }/qqlogin";
}
function weibologin(){
	window.location="${baseUrl }/weibo_login";
}

function weixinlogin(){
	//微信登录
		var redirect_uri = "http://www.mxunta.so/wx_callback";
		var  url = "https://open.weixin.qq.com/connect/qrconnect?appid=wxed5db4b066e33c7b&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_login&state=705e582b0990b1e9b2fb860b823f2a9e#wechat_redirec";
		//var  url = "https://open.weixin.qq.com/connect/qrconnect?appid=wx0ad98a24caca02ca&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_login&state=d967dc101ad34ff81062309e2be96b46#wechat_redirect";
		window.location=url;
}

  		<%-- //创建websocket
  		var count=0;

	    var webSocket = new WebSocket('ws://mxunta.so:80/xunta/ws/websocket');
	    
	    webSocket.onerror = function(event) {
	  		console.log("connet websocket failure");
	    };
	 
	    webSocket.onopen = function(event) {
	    	console.log("connet websocket succeed");
	    };
	    
		 webSocket.onclose = function(event)
		 {
			 console.log(event);
		 }
	 	
	    function stringToJson(stringValue) 
		{ 
			eval("var theJsonValue = "+stringValue); 
			return theJsonValue; 
		}
	    function json2str(o) { 
			var arr = []; 
			var fmt = function(s) { 
			if (typeof s == 'object' && s != null) return json2str(s); 
			return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s; 
			} 
			for (var i in o) arr.push("'" + i + "':" + fmt(o[i])); 
			return '{' + arr.join(',') + '}'; 
		} 
	   
	    webSocket.onmessage = function(event) {
	     	console.log(event.data);
	   	 	var json_msg=stringToJson(event.data);
	   	 	//console.log(json_msg.searchKeywords);
	   	 	var skw=encodeURI(json_msg.searchKeywords);
	   	 	//console.log(skw);
	   	 	var str="<div class='ip_search' id="+(count++)+" style=\"display:none\">"+json_msg.ipaddress+"&nbsp;&nbsp;<a href=\"psearch?searchTime=30days&searchMode=newest&searchKeywords="+skw+"\">"+json_msg.searchKeywords+"</a>&nbsp;&nbsp;&nbsp;"+json_msg.time+"</div>";
	     	//console.log(str);
	   	 	$("#history_searchWord").prepend(str);
	   	 	
	   	 	//15
	   	 	var divs= $("#history_searchWord").children();
	   	 	if(divs.size()>15)
	   	 	{
	   	 		$("#history_searchWord div:last").remove();
	   	 	}

			//console.log(str);	
	     	var str_id="#"+(count-1);
				$(str_id).fadeIn(2000);
	     
	    };

	      var userName="${user.xunta_username}";
	      var cmd="<%=cmd%>";
	      console.log("用户名："+userName+"在线");
	      console.log("cmd:"+cmd);
	      console.log("欢迎试用寻Ta搜人引擎……");
 --%>
  </script>

	</body>

</html>
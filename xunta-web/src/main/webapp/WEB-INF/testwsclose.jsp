<%@page import="java.util.Random"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page isELIgnored="false"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<style>
.media {
	border: 1px dashed lightgray;
	padding: 5px;
}

img {
	width: 200px;
	height: 200px;
}
</style>
<body>
	<%
		request.setAttribute("baseUrl", request.getContextPath());
		//session.setAttribute("username","游客"+new Random().nextDouble());
		session.setAttribute("username","游客1");
	%>
	<h1>聊天窗口</h1>
	<div id="content"></div>
	<textarea id="msg" cols="80" rows="20"></textarea>
	<input type="button" onclick="sendMsg()" value="发送"/>

	<script type="text/javascript" src="${baseUrl }/assets/js/jquery-2.1.4.min.js"></script>
	<script type="text/javascript" src="${baseUrl }/assets/js/sockjs-0.3.min.js"></script>
	<script type="text/javascript">
		var websocket;
	 	if ('WebSocket' in window) {
			websocket = new WebSocket("ws://"+document.domain+":"+window.location.port+"/xunta-web/websocket");
		} else if ('MozWebSocket' in window) {
			websocket = new MozWebSocket("ws://"+document.domain+":"+window.location.port+"/xunta-web/websocket");
		} else {
			websocket = new SockJS("http://"+document.domain+":"+window.location.port+"/xunta-web/sockjs/websocket");
		} 
		//websocket = new SockJS("http://"+document.domain+":"+window.location.port+"/xunta-web/sockjs/websocket",undefined,{protocols_whitelist:[]});
		websocket.onopen = function(evnt) {
			console.log("连接成功");
			console.log(evnt);
		};
		websocket.onmessage = function(evnt) {
			var data = evnt.data;
			var msg = JSON.parse(data);
			if(msg._interface=="test"){
				var p = $("<p></p>").html(msg.ret);
				$("#content").html(p);
			}else if(msg._interface=="ack"){
				console.log(msg.data);
			}
		
		};
		websocket.onerror = function(evnt) {
			console.log("连接出错");
			console.log(evnt);
		};
		websocket.onclose = function(evnt) {
			console.log("连接关闭");
			console.log(evnt);
		}
		
		function sendMsg(){
			var msg = $("#msg").val();
			
			var json_obj = {
					_interface : "test",
					data : msg
				};
			
			var text = JSON.stringify(json_obj);
			websocket.send(text);
		}
	</script>
</body>
</html>
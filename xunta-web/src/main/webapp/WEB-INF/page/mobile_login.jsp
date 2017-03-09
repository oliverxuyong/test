<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page isELIgnored="false"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%
		request.setAttribute("baseUrl", request.getContextPath());
	%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<script type="text/javascript" src="${baseUrl }/assets/js/jquery-2.1.4.min.js"></script>
<body>
	
	
	<form method = "post" action="${baseUrl}/register_validatephonenumber" >
		昵称:<input type="text" name="nickname">
		<br/>
		密码:<input type="password" name="password">
		<br/>
		<img src="${baseUrl }/get_graph_validatecode" id="img_code"/>
		图形验证码:<input type="text" name="graph_validatecode" >
		<br/>
		手机号:<input type="text" name="phonenumber">
		<a id="phone_code" href="javascript:void(0)">点击获取手机验证码</a>
		<input type="hidden" name="groupname" value="寻Ta公测版本">
		</br>
		手机验证码：<input type="text" name="phonevalidatecode">
		</br>
		<input type="submit">提交</input>
	</form>
	<script>

		function validate_form(thisform) {
			with (thisform) {
				alert("表单验证");	
			}
			return false
		}
		
		$("#phone_code").click(function() {
			var params = {
				graph_code:$("input[name=graph_validatecode]").val(),
				phonenumber:$("input[name=phonenumber]").val()
			};
			$.post("${baseUrl}/get_mobilephone_validatecode",params,function(result,state){
				console.log(result);
				//$("img").attr("src","${baseUrl }/get_graph_validatecode?time="+new Date());
				alert(result);
			});
		});
		$("#img_code").click(function(){
			$("img").attr("src","${baseUrl }/get_graph_validatecode?time="+new Date());
		});
	</script>
</body>
</html>
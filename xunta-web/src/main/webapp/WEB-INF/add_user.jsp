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
img{
	width:200px;
	height:200px;
}
</style>
<body>
	<%
		request.setAttribute("baseUrl", request.getContextPath());
	%>
	<h1>用户注册</h1>
	name:<input rows="20" cols="30" id="name"></input><br/>
	image_url:<input type="text" name="image_url" id="image_url"><br>
	third_party_id:<input type="text" name="third_party_id" id="third_party_id"><br>
	type:<input type="text" name="type" id="type"><br/>
	<input type="button" value="添加用户" onclick="save_user()">
	
	
	<script type="text/javascript" src="${baseUrl }/assets/js/jquery-2.1.4.min.js"></script>
	<script type="text/javascript">
		function save_user(){
			var name = $("#name").val();
			var third_party_id = $("#third_party_id").val();
			var image_url = $("#image_url").val();
			var type = $("#type").val();
			console.log("  "+name+"  "+third_party_id+"  "+image_url+"  "+type);
			 $.ajax({
				url:"${baseUrl}/save_user",
				action:"post",
				data:{
					name:name,
					image_url:image_url,
					third_party_id:third_party_id,
					type:type
				},
				async:false,
				success:function(data,textStatus){
					console.log(data);
				},
				error:function(data,textStatus){
					alert(data.statusText);
				}
			}); 
		}
	</script>
</body>
</html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    	<%
		request.setAttribute("baseUrl", request.getContextPath());
	%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
	<h1>删除用户(该用户的所有相关数据包括索引将被清空)</h1>
	<form method="post" action="${baseUrl }/deluser">
		用户id:<input type="text" name="userid">
		<input type="submit" value="提交删除">
	</form>
	<br/>
	
	<h1>上传用户的预设话题</h1>
	<form method="post" action="${baseUrl }/confirm_topic_list">
		<input type="submit" value="提交预设话题">
		用户的id:<select name="userid" style="width:100px;">
			<c:forEach var="user" items="${users }">
				<option value="${user.userId }">${user.name}</option>
			</c:forEach>
		</select>
		用户的预设话题：<br/>
		<textarea rows="50" cols="200" style = "width:100%;height:400px" name="topics"></textarea>	
	</form>
	
	<script type="text/javascript" src="${baseUrl }/assets/js/jquery-2.1.4.min.js"></script>
	
</body>
</html>
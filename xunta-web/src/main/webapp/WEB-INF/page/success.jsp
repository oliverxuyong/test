<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page isELIgnored="false"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>登录成功</title>
</head>
<body>
	<h1>登录成功</h1>
	<h4>添加话题</h4>
	<%
		request.setAttribute("baseUrl", request.getContextPath());
	%>
	<form action="${baseUrl }/addtopic"  method="post">
		话题：<input type="text" name="topiccontent" ><br>
	</form>
	<c:forEach var="topic" items="${topiclist }">
		${topic.topicContent }
	</c:forEach>
</body>
</html>
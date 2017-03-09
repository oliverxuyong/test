<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page isELIgnored="false" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>登录</title>
</head>
<body>
	<h2>登录</h2>
	<%pageContext.setAttribute("baseUrl",request.getContextPath()); %>
	<form action="${baseUrl }/login">
		用户名:<input type="text" name="username">
		<br/>
		<input type="submit" value="注册登录">
	</form>	
</body>
</html>
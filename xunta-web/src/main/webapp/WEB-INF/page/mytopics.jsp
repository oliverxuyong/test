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
	<h2>搜索结果</h2>
	<c:forEach var="r" items="${res }">
		<div class="media">
			<div class="media-body">
				<h4 class="media-heading">${r.title }</h4>
				<%-- <div>${r.content}</div> --%>
			</div>
		</div>
	</c:forEach>
</body>
</html>
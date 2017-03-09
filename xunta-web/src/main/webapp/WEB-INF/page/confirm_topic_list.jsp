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
		//request.setAttribute("topics",request.getAttribute("topics"));
		//request.setAttribute("user",request.getAttribute("user"));
		int count=1;
	%>
	<h1>确认将要添加如下预设话题</h1>
	用户  ${user.name} userid:${user.userId }<br/>
		<form method="post" action="${baseUrl }/set_pre_topics">
			<input type="submit" value="确认预设话题无误"/><br/>
			<input type="hidden" name="userid" value="${user.userId}"/>
			<c:forEach var="topic" items="${topics }">
				<input type="hidden" name="topic_title" value="${topic.topicContent }"/><br/>
			</c:forEach>	
		</form>
		<c:forEach var="topic" items="${topics }">
			<%=count++ %>:${topic.topicContent }<br/>
		</c:forEach>
	
	<script type="text/javascript" src="${baseUrl }/assets/js/jquery-2.1.4.min.js"></script>
	
</body>
</html>
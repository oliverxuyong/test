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
<%
		request.setAttribute("baseUrl", request.getContextPath());
		//session.setAttribute("username","游客"+new Random().nextDouble());
	%>
<body>
	<script type="text/javascript" src="${baseUrl }/assets/js/jquery-2.1.4.min.js"></script>
	<script type="text/javascript" src="${baseUrl }/assets/js/sockjs-0.3.min.js"></script>
	<script type="text/javascript" src="${baseUrl }/assets/JSON-js-master/json_parse.js"></script>
	<script type="text/javascript" src="${baseUrl }/assets/JSON-js-master/json_parse_state.js"></script>
	<script type="text/javascript" src="${baseUrl }/assets/JSON-js-master/json2.js"></script>
	
	
</body>
</html>
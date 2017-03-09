<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page isELIgnored="false"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
	pageContext.setAttribute("baseUrl", request.getContextPath());
%>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
<!-- Bootstrap -->
<link
	href="${baseUrl}/assets/bootstrap-3.3.4-dist/css/bootstrap.min.css"
	rel="stylesheet">
<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="${baseUrl }/assets/js/jquery-2.1.4.min.js"></script>

<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="${baseUrl}/assets/bootstrap-3.3.4-dist/js/bootstrap.min.js"></script>
<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
  <script src="//cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
  <script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>寻Ta 兴趣社交应用</title>
</head>
<body>
	<h1>寻Ta 兴趣社交应用</h1>
	<hr>
	<div class="container">
		<div class="row">
			<div class="col-md-3">
				<div class="btn-group">
					<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
						操作 <span class="caret"></span>
					</button>
					<ul class="dropdown-menu" role="menu">
						<li><a href="#">导入话题</a></li>
						<li><a href="#">显示话题</a></li>
					</ul>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-3">
				<h3>添加用户</h3>
				<form>
					userId:<input type="text" name="userId"><br>
					username:<input type="text" name="name"><br>
					<input type="button" class="btn btn-default" value="添加用户" onclick="add_user(this)">
				</form>
			</div>
			<div class="col-md-3">
				<h3>更新用户</h3>
				<form>
					userId:<input type="text" name="userId"><br>
					username:<input type="text" name="name"><br>
					<input type="button" class="btn btn-default" value="更新用户" onclick="update_user(this)">
				</form>
			</div>
			<div class="col-md-3">
				<h3>添加单词</h3>
				<form action="${baseUrl }/addword" method="post">
					wordName:<input type="text" name="wordName"><br>
					<input type="submit" value="添加单词">
				</form>
			</div>
			<div class="col-md-3">
				<h3>为人建立索引</h3>
				<form action="${baseUrl }/add" method="post">
					userId:<input type="text" name="userId"><br>
					username:<input type="text" name="name"><br>
					<input type="submit" value="创建索引">
				</form>
			</div>
		</div>
		<div class="row">
			<div class="col-md-3">
				<h3>搜索</h3>
				<form action="${baseUrl }/search" method="post">
					搜索:<input type="text" name="searchWord"><br>
					<input type="submit" value="搜索">
				</form>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		function add_user(obj) {
			var userid_node = $(obj).parent("form").find(
					"input[name='userId']");
			var username_node = userid_node.siblings("[name='name']");
			$.ajax({
				url : "${baseUrl}/adduser",
				data : {
					userId : userid_node.val(),
					name : username_node.val()
				},
				cache : false,
				dataType : 'json',
				success : function(data) {
					console.log(data);
				},
				error : function(data) {
					console.log(data);
				}
			});
		}
		
		function update_user(obj) {
			var userid_node = $(obj).parent("form").find(
					"input[name='userId']");
			var username_node = userid_node.siblings("[name='name']");
			$.ajax({
				url : "${baseUrl}/updateuser",
				data : {
					userId : userid_node.val(),
					name : username_node.val()
				},
				cache : false,
				dataType : 'json',
				success : function(data) {
					console.log(data);
				},
				error : function(data) {
					console.log(data);
				}
			});
		}
	</script>
</body>
</html>
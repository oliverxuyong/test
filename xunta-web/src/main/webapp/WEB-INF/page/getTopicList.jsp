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
			<input type="button" class="btn btn-default" value="获取话题列表" onclick="getTopicList()">
		</div>
	</div>
	<script type="text/javascript">
		function getTopicList() {
			$.ajax({
				url : "${baseUrl}/newest_topiclist",
				data : {
				},
				cache : false,
				dataType : 'json',
				success : function(data) {
					var topicArray = data
					console.log(data);
					for(var i = 0;i<topicArray.length;i++){
						var u =$("<ul></ul>");
						var li1 = $("<li></li>").text(topicArray[i].title);
						var li2 = $("<li></li>").text(topicArray[i].author);
						var li3 = $("<li></li>").text(topicArray[i].content);
						var li4 = $("<li></li>").text(topicArray[i].time);
						var img = $("<img></img>").attr("src",topicArray[i].headimage);
						var li5 = $("<li></li>").html(img);
						
						u.append(li1);
						u.append(li2);
						u.append(li3);
						u.append(li4);
						u.append(li5);
						
						console.log(topicArray['content']);
						u.css({
							"border-bottom":"1px dotted gray",
							"list-style":"none"
						});
						$("div.container").append(u);
					}
					
				},
				error : function(data) {
					console.log(data);
				}
			});
		}
	</script>
</body>
</html>
<%@ page language="java"  pageEncoding="utf-8"%>

<%@ include file="/inc/_00meta.inc"%>

<%@page isELIgnored="false" %>

<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="xunta.so" content="寻TA网">
		<meta name="description" content="寻TA网_跨社区旅游搜人引擎">
		<meta property="qc:admins" content="65000324676505641637" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>寻TA网_跨社区旅游搜人引擎|XunTa.so|输入"知识点"关键词,寻找可信赖的旅伴,团长,导游,店家,餐馆,车主,博主...</title>
		<%pageContext.setAttribute("baseUrl",request.getContextPath()); %>
		<link rel="stylesheet" href="${baseUrl }/assets/bootstrap/3.0.0/css/bootstrap.min.css"/>
		<link rel="stylesheet" href="${baseUrl }/assets/bootstrap/3.0.0/css/bootstrap-theme.min.css"/>
		<link rel="stylesheet" href="${baseUrl }/assets/stylesheets/index.css" />
		<script type="text/javascript" src="${baseUrl }/assets/js/jquery-2.1.4.min.js"></script>
		<script src="${baseUrl }/assets/bootstrap/3.0.0/js/bootstrap.min.js"></script>
		
		<style>
			.media{
				border:1px dashed lightgray;
				padding:5px;
			}
		</style>
	</head>
	
	<body>
		<nav class="navbar navbar-default" role="navigation">
			<div class="navbar-header">
				<a class="navbar-brand" href="#">寻Ta兴趣社交</a>
			</div>
			<div>
				<ul class="nav navbar-nav">
					<li class="active">
						<a href="#">首页</a>
					</li>
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown">
							推荐
							<b class="caret"></b>
						</a>
						<ul class="dropdown-menu">
							<li><a href="#">话题</a></li>
							<li><a href="#">趣友</a></li>
						</ul>
					</li>
				</ul>
			</div>
		</nav>
		
		<div class="page-header">
		   <h1>推荐话题 </h1>
		</div>
		
		<div class="container">
			<div class="media">
			   <a class="pull-left" href="#">
			      <img class="media-object" src="${baseUrl }/assets/topic_heading_images/1.jpg" 
			      alt="媒体对象">
			   </a>
			   <div class="media-body">
			      <h4 class="media-heading">媒体标题</h4>
			      这是一些示例文本。这是一些示例文本。 
			      这是一些示例文本。这是一些示例文本。
				  这是一些示例文本。这是一些示例文本。
				  这是一些示例文本。这是一些示例文本。
				  这是一些示例文本。这是一些示例文本。
			   </div>
			   <input type="button" class="btn btn-default" value="喜欢">
			   <input type="button" class="btn btn-default" value="不喜欢">
			</div>
			
			
			<div class="media">
			   <a class="pull-left" href="#">
			      <img class="media-object" src="${baseUrl }/assets/topic_heading_images/2.jpg"  alt="媒体对象">
			   </a>
			   <div class="media-body">
			      <h4 class="media-heading">媒体标题</h4>
			      这是一些示例文本。这是一些示例文本。 
			      这是一些示例文本。这是一些示例文本。
				  这是一些示例文本。这是一些示例文本。
				  这是一些示例文本。这是一些示例文本。
				  这是一些示例文本。这是一些示例文本。
			   </div>
			</div>
		</div>
		
		<script>
			$(function(){
				$.post("${baseUrl}/newest_topiclist",null,function(data){
					for(var i = 0;i<data.length;i++)
					{
						var div_media = $("<div class='media'></div>");
						var a = $("<a class='pull-left' href='#'></a>");
						var img = $("<img src='media-object'>").attr("src",data[i].headimage).attr("alt",data[i].author);
						a.append(img);
						var div_body = $("<div class='media-body'></div>");
						var media_heading = $("<h4 class='media_heading'></h4>").html(data[i].title);
						div_body.append(media_heading).append(data[i].content);
						div_media.append(a).append(div_body);
						var like = $("<input type='button' class='btn btn-default' value='喜欢'>");
						var hate = $("<input type='button' class='btn btn-default' value='不喜欢'>");
						div_media.append(like).append(hate);
						$(".container").append(div_media);
					}
				});				
			});
		</script>
	</body>
</html>
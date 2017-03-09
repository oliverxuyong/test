<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<html>
<head>
<title>using commons Upload to upload file</title>
</head>
<style>
* {
	font-family: "宋体";
	font-size: 14px
}
</style>
<body>
	<p align="center">请您选择需要上传的文件</p>
	<form id="form1" name="form1" method="post" action="<%=request.getContextPath()%>/upload" enctype="multipart/form-data">
		<table border="0" align="center">

			<tr>
				<td>用户id</td>
				<td><input name="userid" type="text" id="userid" size="20"></td>
			</tr>
			<tr>
				<td>上传文件：</td>
				<td><input name="file" type="file" size="20" id="file1"></td>
			</tr>
			<tr>
				<td></td>
				<td><input type="button" value="提交" onclick="upload()">
					<input type="reset" name="reset" value="重置"></td>
			</tr>
		</table>
	</form>
	<img src="" id="images">

<progress id = "proc" style="display:none"></progress>
	<script  src="<%=request.getContextPath()%>/assets/js/jquery-2.1.4.min.js"></script>
	<script  src="<%=request.getContextPath()%>/assets/js/jquery-form-plugin.js"></script>
	<script>
	function upload() {
		var formData = new FormData($('form')[0]);
		$.ajax({
			url :'<%=request.getContextPath()%>/upload', //server script to process data
			type : 'POST',
			xhr : function() { // custom xhr
				myXhr = $.ajaxSettings.xhr();
				if (myXhr.upload) { // check if upload property exists
					myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // for handling the progress of the upload
				}
				return myXhr;
			},
			//Ajax事件
			beforeSend : beforeSendHandler,
			success : completeHandler,
			error : errorHandler,
			// Form数据
			data : formData,
			//Options to tell JQuery not to process data or worry about content-type
			cache : false,
			contentType : false,
			processData : false
		});
	}
	
	function progressHandlingFunction(e){
		console.log(e);
		if(e.lengthComputable){
			$('progress').attr({value:e.loaded,max:e.total});
		}
	}
	function beforeSendHandler(){
		console.log("beforesend");
		$("#proc").css("display","block");
	}
	function errorHandler()
	{
		console.log("error");
	}
	function completeHandler(data){
		console.log("complete:"+JSON.stringify(data));
		$("#images").attr("src",data.image_url);	
	}
	</script>
</body>
</html>
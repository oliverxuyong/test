//自定义app 版本
var app_version = {
	versionName : "1.0",
	versionCode : 1
};

/**
 * 检查是否有新版本
 */
function versionUpdate() {
	api.ajax({
		url : 'https://'+domain+'.so/xunta-web/update_info',//2018.01.29 叶夷    将http更改成https
		method : 'post',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		charset : "utf-8"

	}, function(ret, err) {
		if (ret) {
			var urlJson = ret;
			//版本号
			var version_code = urlJson.version_code;
			var version_name = urlJson.version_name;
			var download_url = urlJson.download_url;
			var ios_url = urlJson.ios_url;
			var description = urlJson.description;
			console.log("版本号：" + version_code);
			console.log("版本名：" + version_name);
			console.log("下载地址：" + download_url);
			console.log("描述：" + description);
			console.log("ios_url：" + ios_url);

			if (app_version.versionCode < version_code) {
				api.confirm({
					title : '发现新版本' + version_name,
					msg : description,
					buttons : ['开始下载', '以后再说']
				}, function(ret, err) {
					if (ret.buttonIndex == 1) {
						//api.alert({msg: '开始下载'});
						var save_path = 'fs://寻Ta.apk';

						var system_type = api.systemType;

						console.log(system_type);
						if (system_type == "ios") {
							console.log("是苹果");
							//installApk(ios_url);
							api.openWin({
								name : 'page1',
								url : ios_url,
								pageParam : {
									name : 'test'
								}
							});
						} else if (system_type == "android") {
							console.log("是安卓apk");
							downloadApk(download_url, save_path);

						}
					}
				});
			} else {
			}
		} else {
			api.alert({
				msg : ('错误码：' + err.code + '；错误信息：' + err.msg + '网络状态码：' + err.statusCode)
			});
		}
	});
}

/**
 * 下载文件
 */
function downloadApk(download_url, save_path) {
	console.log("save_path:" + save_path);
	api.download({
		url : download_url,
		savePath : save_path,
		report : true,
		cache : false,
		allowResume : true
	}, function(ret, err) {
		if (ret) {
			var value = ('文件大小：' + ret.fileSize + '；下载进度：' + ret.percent + '\%  ；下载状态' + ret.state);
			console.log(value);
			updateDownloadProgress(ret.percent + "\%");
			if (ret.state == 1) {
				console.log('存储路径:' + ret.savePath);
				installApk(ret.savePath);
			}
		} else {
			var value = err.msg;
			console.log(value);
		}
	});
}

/**
 * 进度提示
 */
function updateDownloadProgress(process) {
	//var o = document.getElementsByClassName("cloud")[0];
	//o.innerHTML = process;
}

/**
 * 安装apk
 */
function installApk(apk_path) {
	api.installApp({
		appUri : apk_path
	});
}

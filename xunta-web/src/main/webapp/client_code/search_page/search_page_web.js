function getPageParam(Parameter) {
	tmpSearchPageId = Parameter.tmpSearchPageId;
	topicId = Parameter.topicid;//the previous topicid from which this searchpage was clicked 
	userId = Parameter.userid;
	title = specialLettersDecoding(Parameter.title);

	userName = Parameter.userName;
	userImage = Parameter.userImage;
	adminName = Parameter.adminName;
	adminImageurl = Parameter.adminImageurl;
	userAgent = Parameter.userAgent;
	domain = Parameter.server_domain;
}

function closeThisPage() {
	execRoot("setCurrentPageId('"+topicId+"')");
	/*closeWin(topicId);
	var pageParam = {
		"topicid" : topicId,
		"title" : title,
		"userid" : userId,
		"userName" : userName,
		"userImage" : userImage,
		"server_domain" : domain,
		"isqingting" : 'false',
		"pageTitle":title,
		"adminName": adminName,
		"adminImageurl": adminImageurl,
		"userAgent":userAgent
	};
	console.log("enterDialogPage topicid=" + topicId+"|topictitle="+title);
	openWin(topicId,'dialog_page/dialog_page.html',JSON.stringify(pageParam));*/
	closeWin('search_page');
}
function goBackBtn(){
	execRoot("setCurrentPageId('"+topicId+"')");
	closeWin(tmpSearchPageId);
}


/**
 * Created by deng on 2016/12/24.
 */

function closeAndRedirect() {
    openWin('topics_page', 'topics_page/topics_page.html', '');
    execRoot("setCurrentPageId('topics_page')");
    exec("topics_page","removeUnreadNum('null')");
    closeWin(_tmpPageId);
}

function goBack(){
    closeWin(_tmpPageId);
}

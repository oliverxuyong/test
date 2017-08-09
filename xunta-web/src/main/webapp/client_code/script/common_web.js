/**
 * Created by deng on 2016/12/24.
 */

function closeAndRedirect() {
    openWin('main_page', 'main_page/main_page.html', '');
    execRoot("setCurrentPageId('main_page')");
    exec("main_page","removeUnreadNum('null')");
    closeWin(_tmpPageId);
}

function goBack(){
    closeWin(_tmpPageId);
}

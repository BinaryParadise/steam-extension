$(function () {
    var title = $("#title")
    var state = $("#state");
    if (chrome.tabs == undefined) {
        return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {//获取当前tab
        //向tab发送请求
        chrome.tabs.sendMessage(tab[0].id, {
            action: "reload"
        }, function (response) {
            if (response != undefined && response.state != undefined) {
                title.html(response.state.title)
                state.html(response.state.content)
            }
        });
    });
});
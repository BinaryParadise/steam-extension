chrome.webRequest.onCompleted.addListener(details => {
    onRequestCompleted(details);
}, { urls: ['<all_urls>'] }, ['extraHeaders', 'responseHeaders']
);

function onRequestCompleted(details) {
    console.log(details.url)
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {//获取当前tab
        if (tab.length == 0) {
            return
        }
        //向tab发送请求
        chrome.tabs.sendMessage(tab[0].id, {
            action: "request",
            url: details.url
        }, function (response) {
            if (response != undefined) {
                response.source = 'chrome';
                window.postMessage(response);
            }
        });
    });
}
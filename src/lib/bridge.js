window.addEventListener('message', e => {
    console.log(e.data);
    if (e.source != window || e.data.source != undefined) {
        return;
    }
    if (e.data.action) {
        chrome.runtime.sendMessage(e.data)
    }
});

// register the message listener in the page scope
let script = document.createElement('script');
script.innerText = `
console.info('steam extension bridge registed');
window.addEventListener('message', e => {
    if (e.source == window && e.data.source == 'chrome') {
        console.log(e.data);
        let action = e.data.action;
        if (action == "loadAll") {
            doLoad().then(function (next) {

            });
        } else if (action == "case") {
            $("#case_count").html(e.data.content.html)
        }
    }
});

`;

document.head.appendChild(script);
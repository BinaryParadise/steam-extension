// 出金统计

var localData = undefined
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "request") {
            var url = new URL(request.url)
            if (url != null) {
                console.log(request.url)
                if (/\/profiles\/(\d*)\/inventoryhistory\/\?ajax=1/.exec(url.href) != null) {
                    loadGoldens();
                }
            }
        }
    }
);

function loadGoldens() {
    fetchGolden().then(data => {
        var html = "";
        var uid = /(\d+)/.exec(window.location.href)[1]
        var count = 0;
        data.goldens.forEach(function (item) {
            if (data.mergeGolden || item.uid == uid) {
                count++;
                html += `
                <tr class='case_td'>
                <td class='case_td item_count'>
                    <span class='case_item_name'>${item.name}</span>
                </td>
                <td class='case_td item_name'><span class='case_item_count'>${new Date(item.time).format("yyyy-MM-dd hh:mm")}</span></td></tr>
                `;
            }
        });
        html = `
        <table class="case_table">
        <tr>
        <th colspan=2 class="case_td">
            累计出金 <span style='color: #f1ea0b;font-weight: bold; '>${count}</span> 个</span>
        </th>
        </tr >` + html;
        html += "</table>";
        $("#result_list").html(html);
    });
}

function fetchGolden() {
    $(".tradehistoryrow").each(function (index, item) {
        let action = $(".tradehistory_event_description", this).text().trim()
        if (action == "已开启武器箱") {
            var name = $(".history_item_name", this).last().text().trim()
            if (name.includes("★")) {
                var item = $($(".economy_item_hoverable", this).last())
                var data = { time: toDate($(".tradehistory_date", this).text().trim()).getTime(), id: item.attr("data-classid") + "_" + item.attr("data-instanceid"), name }
                appendGolden(data)
            }
        }
    });
    return makeStorage()
}

function fetchStorage() {
    return new Promise(resolve => {
        if (localData == undefined) {
            chrome.storage.sync.get({ goldens: [], mergeGolden: false }, function (items) {
                localData = items;
                resolve(items);
            });
        } else {
            resolve(localData)
        }
    });
}

function makeStorage() {
    return new Promise(resolve => {
        //存储区有大小限制！
        chrome.storage.sync.set({ "goldens": localData.goldens }, function () {
            console.log("出金数据保存成功");
            resolve(localData);
        });
    });
}

function appendGolden(item) {
    item.uid = /(\d+)/.exec(window.location.href)[1]
    var index = localData.goldens.findIndex(obj => obj.id == item.id)
    if (index === -1) {
        localData.goldens.push(item)
    } else {
        localData.goldens.slice(index, item)
    }
    localData.goldens.sort(function (a, b) {
        return b.time - a.time
    });
}

$("body").append(`
<div id="result_list">
</div>
`);

fetchStorage().then(data => {
    loadGoldens();
});
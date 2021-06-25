// 出金统计

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
    var goldens = fetchGolden()
    goldens.sort(function (a, b) {
        return b.time - a.time
    });
    var html = `
    <table class="case_table">
    <tr>
    <th colspan=2 class="case_td">${"累计出金 <span style='color: #f1ea0b;font-weight: bold; '>" + goldens.length + "</span> 个</span>"
        }</th >
    </tr >
    `;
    goldens.forEach(function (item) {
        html += `
        <tr class='case_td'>
        <td class='case_td item_count'>
            <span class='case_item_name'>${item.name}</span>
        </td>
        <td class='case_td item_name'><span class='case_item_count'>${new Date(item.time).format("yyyy-MM-dd hh:mm")}</span></td></tr>
        `;
    });
    html += "</table>";
    $("#result_list").html(html);
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
    return fetchStorage()
}

function fetchStorage() {
    var goldens = JSON.parse(localStorage.getItem("goldens"))
    if (goldens == null) {
        goldens = [];
    }
    return goldens;
}

function appendGolden(data) {
    var uid = /(\d+)/.exec(window.location.href)[1]
    var goldens = fetchStorage();
    var index = goldens.findIndex(obj => obj.id == data.id)
    if (index === -1) {
        goldens.push(data)
    } else {
        goldens.slice(index, data)
    }
    localStorage.setItem("goldens", JSON.stringify(goldens));
    return goldens;
}

$("body").append(`
<div id="result_list">
</div>
`);

loadGoldens();
// 开箱统计

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "request") {
            var url = new URL(request.url)
            if (url != null) {
                console.log(request.url)
                if (url.pathname.startsWith("/account/AjaxLoadMoreHistory/")) {
                    fetchStorage().then(data => {
                        sendResponse(collectCount($, data));
                    });
                }
            }
        } else if (request.action == "onstart") {
            startAnalytics();
        }
    }
);

window.addEventListener('message', e => {
    console.log(e.data);
    if (e.source != window || e.data.source != undefined) {
        return;
    }
    var action = e.data.action
    if (action == "onstart") {
        startAnalytics();
    }
});

function startAnalytics() {
    // $(".btn_count").css('display', 'none');
    // $("#case_loading").css('display', 'block');
}

var mapKey = {
    "Danger Zone Case Key": "“头号特训”武器箱钥匙",
    "Prisma Case Key": "棱彩武器箱钥匙",
    "Prisma 2 Case Key": "棱彩2号武器箱钥匙",
    "Revolver Case Key": "左轮武器箱钥匙",
    "Glove Case Key": "手套武器箱钥匙",
    "Clutch Case Key": "命悬—线武器箱钥匙",
    "Fracture Case Key": "裂空武器箱钥匙",
    "Operation Broken Fang Case Key": "“狂牙大行动”武器箱钥匙",
    "Operation Hydra Case Key": "“九头蛇大行动”武器箱钥匙",
    "Operation Wildfire Case Key": "“野火大行动”武器箱钥匙",
    "Chroma 2 Case Key": "幻彩2号武器箱钥匙",
    "Chroma 3 Case Key": "幻彩3号武器箱钥匙",
    "Spectrum Case Key": "光谱2号武器箱钥匙",
    "Spectrum 2 Case Key": "光谱2号武器箱钥匙",
    "Horizon Case Key": "地平线武器箱钥匙",
    "CS:GO Case Key": "反恐精英武器箱钥匙",
    "CS20 Case Key": "反恐精英20周年武器箱钥匙",
    "Gamma Case Key": "伽马武器箱钥匙",
    "Gamma 2 Case Key": "伽玛 2 号武器箱钥匙"
}

var mergeCase = false

function fetchStorage() {
    return new Promise(resolve => {
        chrome.storage.sync.get({ mergeCase: false }, items => {
            mergeCase = items.mergeCase
            chrome.storage.local.get({ cases: [], recharge: [] }, vs => {
                resolve(vs)
            });
        });
    });
}

//统计开箱数据analytics
function collectCount($, data) {
    var currency = '￥'
    var uid = /(\d+)/.exec($($(".user_avatar")).attr("href"))[1]
    $('.wallet_table_row.wallet_table_row_amt_change').each(function () {
        // 统计充值卡
        var expamt = /(已购买|Purchased)\s+(\S)(\d+.\d{2})/.exec(this.innerText.trim())
        if (expamt != undefined) {
            currency = expamt[2]
            var rtid = /transid=(\d+)/.exec($(this).attr("onclick"))[1];
            var idx = data.recharge.findIndex(obj => obj.id == rtid)
            var amt = { currency: expamt[2], amount: parseFloat(expamt[3]), uid: uid, id: rtid }
            if (idx === -1) {
                data.recharge.push(amt)
            } else {
                data.recharge.slice(idx, amt)
            }
        }
        if ($($(".wht_items div", this)[0]).text() == "Counter-Strike: Global Offensive" && ["In-Game Purchase", "游戏内购买"].includes(($(".wht_type div", this)[0] || {}).innerText)) {
            var item = $(".wth_payment", this)[0].innerText.trim()
            if (item.indexOf("钥匙") > 0 || item.indexOf("Case Key") > 0) {
                var tid = /transid=(\d+)/.exec($(this).attr("onclick"))[1];
                var exp = /(\d*)\s*([\s\S]+)/.exec(item)
                var num = exp == null || exp[1] == "" ? 1 : parseInt(exp[1])
                var key = exp == null ? item : exp[2]
                if (mapKey[key] != undefined) {
                    key = mapKey[key]
                }
                var index = data.cases.findIndex(obj => obj.id == tid);
                if (index === -1) {
                    data.cases.push({ name: key, count: num, uid, id: tid })
                } else {
                    data.cases.slice(index, { name: key, count: num, uid, id: tid })
                }
            }
        }

    })

    var collect = {}
    var count = 0
    data.cases.forEach(value => {
        if (mergeCase || value.uid == uid) {
            if (collect[value.name] == undefined) {
                collect[value.name] = value.count
            } else {
                collect[value.name] += value.count
            }
            count += value.count
        }
    });

    var recharge = {}
    data.recharge.forEach(value => {
        if (mergeCase || value.uid == uid) {
            if (recharge[value.currency] == undefined) {
                recharge[value.currency] = value.amount
            } else {
                recharge[value.currency] += value.amount
            }
        }
    })
    var total = ""
    Object.keys(recharge).forEach(key => {
        total += `${key}${recharge[key]};`
    })

    keysSorted = Object.keys(collect).sort(function (a, b) { return collect[b] - collect[a] })

    var html = `<table class="case_table">
        <tr>
            <th colspan=2 class="case_td">
                累计开箱 <span style='color: #f1ea0b;font-weight: bold; '>${count}</span> 个            </th>
        </tr>
    `;

    keysSorted.forEach(function (key) {
        html += `<tr class='case_td'>
               <td class='case_td item_name'>
                   <div class='item_group_0'>
                       <span class='case_item_name'>${key}</span>
                   </div>
               </td>
                <td class='case_td item_count'><span class='case_item_count'>${collect[key]}</span></td></tr>
            `;
    });
    html += `</table>`;

    chrome.storage.local.set(data, () => {
        $("#result_list").html(html);
        console.log("开箱数据保存成功");
    });
}

$("body").append(`
<div id="result_list">
</div>
`)

fetchStorage().then(data => {
    collectCount($, data)
})
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "reload") {
            sendResponse({ state: collectCount($) })
        }
    }
);

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

//统计开箱数据analytics
function collectCount($) {
    var icons = {
        "光谱 2 号武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFY4naeaJGhGtdnmx4Tek_bwY-iFlGlUsJMp3LuTot-mjFGxqUttZ2r3d4eLMlhpnZPxZK0/120x40",
        "左轮武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFYwnfKfcG9HvN7iktaOkqD1auLTxD5SvZYgiLvFpo7xjVLh-kdrYWnzcoGLMlhpsyM-5vg/120x40",
        "棱彩武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFUynfWaI25G6Ijkl9iPw_SnNrjXw2oBu8cj3b2Qo4_33QbnrUdlYD37ddCLMlhpvs0XIz0/120x40",
        "棱彩2号武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFUynfWaI25G6Ijkl9iPw_SnNrjXw2oBu8cj3b2Qo4_33QbnrUdlYD37ddCLMlhpvs0XIz0/120x40",
        "手套武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFY1naTMdzwTtNrukteIkqT2MO_Uwz5Q6cYhibyXo4rw2ALsrkRoYjuncNCLMlhpEV4XDTk/120x40",
        "棱彩2号武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFU1nfbOIj8W7oWzkYLdlPOsMOmIk2kGscAj2erE99Sn2AGw_0M4NW2hIYOLMlhpcmY0CRM/120x40",
        "地平线武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFUwnfbOdDgavYXukYTZkqf2ZbrTwmkE6scgj7CY94ml3FXl-ENkMW3wctOLMlhpVHKV9YA/120x40",
        "反恐精英20周年武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFU0naHKIj9D7oTgl4LelaGnMuqIwDgFusR337HCpYmhiwzm8ktqMjv2INKLMlhprbp6CTE/120x40",
        "命悬—线武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFY5naqQIz4R7Yjix9bZkvKiZrmAzzlTu5AoibiT8d_x21Wy8hY_MWz1doSLMlhpM3FKbNs/120x40",
        "“头号特训”武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFUxnaPLJz5H74y1xtTcz6etNumIx29U6Zd3j7yQoYih3lG1-UJqY27xJIeLMlhpaD9Aclo/120x40",
        "幻彩 3 号武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFYynaSdJGhE74y0wNWIw_OlNuvXkDpSuZQmi--SrN-h3gey-Uo6YWmlIoCLMlhplhFFvwI/120x40",
        "幻彩 2 号武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFAuhqSaKWtEu43mxtbbk6b1a77Twm4Iu8Yl3bCU9Imii1Xt80M5MmD7JZjVLFH-6VnQJQ/120x40",
        "伽玛武器箱": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFYznarJJjkQ6ovjw4SPlfP3auqEl2oBuJB1j--WoY322QziqkdpZGr3IteLMlhpw4RJCv8/120x40",
        "光谱武器箱": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFY2nfKadD4U7Y7lwYXexaGlYb3QzjlUvZ0k0ujHptug2VbirkRrNW2md4SLMlhph09hpX0/120x40",
        "伽玛 2 号武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsVFx5KAVo5PSkKV4xhfGfKTgVvIXlxNPSwaOmMLiGwzgJvJMniO-Zoo_z2wXg-EVvfSmtc78HsNoy/120x40",
        "“野火大行动”武器箱钥匙": "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFYxnaeQImRGu4S1x9TawfSmY-iHkmoD7cEl2LiQpIjz3wPl_ERkYWHwLY-LMlhp9pkR_UQ/120x40",
        "“九头蛇大行动”武器箱钥匙": "",
        "反恐精英20周年印花胶囊": "",
        "“狂牙大行动”武器箱钥匙": "",
        "反恐精英武器箱钥匙": "",
        "裂空武器箱钥匙": "",
        "光谱武器箱钥匙": "",
        "伽玛武器箱钥匙": ""
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
    var result = {}
    var count = 0
    var amount = 0
    var currency = '￥'
    $('.wallet_table_row.wallet_table_row_amt_change').each(function () {
        // 统计充值卡
        var expamt = /(已购买|Purchased)\s+(\S)(\d+.\d{2})/.exec(this.innerText.trim())
        if (expamt != undefined) {
            currency = expamt[2]
            amount += parseFloat(expamt[3])
        }
        if ($($(".wht_items div", this)[0]).text() == "Counter-Strike: Global Offensive" && ["In-Game Purchase", "游戏内购买"].includes(($(".wht_type div", this)[0] || {}).innerText)) {
            var item = $(".wth_payment", this)[0].innerText.trim()
            if (item.indexOf("钥匙") > 0 || item.indexOf("Case Key") > 0) {
                var exp = /(\d*)\s*([\s\S]+)/.exec(item)
                var num = exp == null || exp[1] == "" ? 1 : parseInt(exp[1])
                var key = exp == null ? item : exp[2]
                if (icons[key] == undefined) {
                    if (mapKey[key] != undefined) {
                        key = mapKey[key]
                    } else {
                        console.log(key + " 找不到")
                    }
                }
                if (result[key] == undefined) {
                    result[key] = num
                } else {
                    result[key] += num
                }
                count += num
            }
        }

    })

    keysSorted = Object.keys(result).sort(function (a, b) { return result[b] - result[a] })

    var html = "";
    keysSorted.forEach(function (key) {
        html += "<tr>"
        html += "   <td class='item_name'>"
        html += "       <div class='item_group_0'>"
        // html += "           <img class='item_img'"
        // html += "               src=" + icons[key] + ">"
        html += "           <span class='history_item_name' style='color: #D2D2D2'>" + key + "</span>"
        html += "       </div>"
        html += "   </td>"
        html += "<td class='item_count'><span class='history_item_name' style='color: #8650AC;font-weight:bold;'>" + result[key] + " ★</span></td></tr>"
    });
    return { title: "截止 " + new Date().format("yyyy年M月d日") + " 共计开箱 <span style='color: yellow; '>" + count + "</span> 个，充值合计 <span style='color: orange;'>" + currency + "" + + amount + "</span>", content: html };
}
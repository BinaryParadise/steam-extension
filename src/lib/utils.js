Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
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

function toDate(str) {
    //str eg: 2021年5月22日\t\t\t下午3:39
    var regex = /(\d{4})\s*年\s*(\d)\s*月\s*(\d+)\s*日\S*(上午|下午)\s*(\d+):(\d+)/;
    var matchs = regex.exec(str.replaceAll("\t", ""));
    if (matchs == null) {
        return new Date()
    }
    matchs = matchs.map((value) => {
        if (value == "上午") {
            return 0
        } else if (value == "下午") {
            return 12
        }
        return parseInt(value)
    });
    return new Date(matchs[1], matchs[2] - 1, matchs[3], matchs[4] + matchs[5], matchs[6], 1);
}
require("dotenv").config();
// require("dotenv").config({path: '../.env'});

// 替换敏感词
function filterSensitive(someArray) {
    const sensitiveWords = JSON.parse(process.env.SENSITIVE);
    // console.log(sensitiveWords);

    someArray = someArray.filter(item => {
        const isWhitelistedIP = whitelistedIPs.includes(item.clientIP);

        if (isWhitelistedIP) {
            return false;
        }

        const isSensitivePath = sensitiveWords.some(word => item.clientRequestPath.includes(word)) ||
                                (item.clientRequestPath === '/' && !item.clientRequestQuery);

        if (isSensitivePath) {
            item.clientRequestPath = `CloudFlare WAF REPORT: Disobey robots.txt. Suspicious web crawler.`;
        } else {
            item.clientRequestPath = `CloudFlare WAF REPORT: ${item.clientRequestPath}`;
        }

        item.clientRequestPath = item.clientRequestQuery ? `${item.clientRequestPath}${item.clientRequestQuery}` : item.clientRequestPath;

        return true;
    });

    return someArray;
}


function dropDuplicates(jsonArray) {
    // object keys must not be repeated
    const uniqueByName = Object.values(
        jsonArray.reduce((item, obj) => {
            item[obj.clientIP] = obj;
            return item;
        }, {})
    );
    return uniqueByName;
}


module.exports = {
    dropDuplicates,
    filterSensitive,
}
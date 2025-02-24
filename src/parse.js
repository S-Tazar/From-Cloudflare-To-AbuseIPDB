require("dotenv").config();
// require("dotenv").config({path: '../.env'});

// 替换敏感词
function filterSensitive(someArray) {
    const sensitiveWords = JSON.parse(process.env.SENSITIVE);
    const whitelistedIPs = JSON.parse(process.env.WHITELIST_IP);
    // console.log(sensitiveWords);

    someArray = someArray.filter(item => {
        const isWhitelistedIP = whitelistedIPs.includes(item.clientIP);
        if (isWhitelistedIP) {
            return false;
        }
        const isSensitivePath = sensitiveWords.some(word => item.clientRequestPath.includes(word)) ||
                          (item.clientRequestPath === '/' && !item.clientRequestQuery);
        const isSensitiveQuery = sensitiveWords.some(word => item.clientRequestQuery.includes(word));

                                (item.clientRequestPath === '/' && !item.clientRequestQuery);

        if (isSensitivePath) {
            item.clientRequestPath = `CloudFlare WAF REPORT: Disobey robots.txt. Suspicious web crawler.`;
        } else {
            item.clientRequestPath = `CloudFlare WAF REPORT: ${item.clientRequestPath}`;
        }
        item.clientRequestPath = (item.clientRequestQuery && !isSensitivePath) ? `${item.clientRequestPath}${item.clientRequestQuery}` : item.clientRequestPath;
        if (!isSensitivePath && !isSensitiveQuery) {
            item.clientRequestPath = `CloudFlare WAF REPORT: ${item.clientRequestPath}${item.clientRequestQuery || ''}`;
        } else if (isSensitivePath || isSensitiveQuery) {
            item.clientRequestPath = `CloudFlare WAF REPORT: Disobey robots.txt. ${isSensitiveQuery ? 'Suspicious web crawler with forbidden query string.' : 'Suspicious web crawler.'}`;
        }
    
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
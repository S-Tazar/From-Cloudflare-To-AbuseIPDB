require("dotenv").config();
// require("dotenv").config({path: '../.env'});

// 替换敏感词
function filterSensitive(someArray) {
    const sensitiveWords = JSON.parse(process.env.SENSITIVE);
    // console.log(sensitiveWords);
    someArray.forEach(item => {
        item.clientRequestPath = sensitiveWords.some(word => item.clientRequestPath.includes(word)) || item.clientRequestPath === '/' && !item.clientRequestQuery
            ? `CloudFlare WAF REPORT: Disobey robots.txt. Suspicious web crawler.`
            : `CloudFlare WAF REPORT: ${item.clientRequestPath}`;

        item.clientRequestPath = item.clientRequestQuery ? `${item.clientRequestPath}${item.clientRequestQuery}` : item.clientRequestPath;
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
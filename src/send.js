const fetch = require("node-fetch");
const FormData = require('form-data');
require("dotenv").config();
// require("dotenv").config({path: '../.env'});

function sendAlertToAbuseIPDB(someArray) {
    someArray.forEach(item => {
        const formData = new FormData();
        formData.append('ip', item.clientIP);
        formData.append('categories', "19, 21");
        formData.append('comment', item.clientRequestPath);

        // console.log(item.clientIP);
        options = {
            method: "POST",
            headers:  {"Accept": "application/json", "Key": process.env.ABUSEIP_DB_KEY},
            body: formData,
        };
        console.log(options);

        fetch("https://api.abuseipdb.com/api/v2/report", options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
        })
        .catch(err => console.error(err));
    });
}

module.exports = {
    sendAlertToAbuseIPDB,
}
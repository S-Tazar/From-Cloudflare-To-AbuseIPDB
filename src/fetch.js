const fetch = require("node-fetch");
const { dropDuplicates, filterSensitive } = require("./parse");
const { sendAlertToAbuseIPDB } = require("./send");
require("dotenv").config();
// require("dotenv").config({path: '../.env'});

const now = new Date();
const previousTiming = new Date(now);
// 3.5 hours ago
previousTiming.setHours(now.getHours() - 3, now.getMinutes() - 30);

const payload = { "query":
  `query ListFirewallEvents($zoneTag: string, $filter: FirewallEventsAdaptiveFilter_InputObject) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        firewallEventsAdaptive(
            filter: $filter
            limit: 100
            orderBy: [datetime_DESC]
        ) {
            action
            clientAsn
            clientCountryName
            clientIP
            clientRequestPath
            clientRequestQuery
            datetime
            source
            userAgent
        }
      }
    }
  }`,
    "variables": {
        "zoneTag": process.env.CF_ZONE_ID,
        "filter": {
            "datetime_geq": previousTiming, //"2024-08-28T00:47:24Z",
            "datetime_leq": now, //"2024-08-28T03:47:24Z",
            "AND":[
            {"action_neq": "allow"},
            {"action_neq": "skip"},
            {"action_neq": "challenge_solved"},
            {"action_neq": "challenge_failed"},
            {"action_neq": "challenge_bypassed"},
            {"action_neq": "jschallenge_solved"},
            {"action_neq": "jschallenge_failed"},
            {"action_neq": "jschallenge_bypassed"},
            {"action_neq": "managed_challenge_skipped"},
            {"action_neq": "managed_challenge_non_interactive_solved"},
            {"action_neq": "managed_challenge_interactive_solved"},
            {"action_neq": "managed_challenge_bypassed"},
            ]
        }
    }
};


function fetchCFEvents() {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.CF_TOKEN}` },
        body: JSON.stringify(payload),
    };

    fetch("https://api.cloudflare.com/client/v4/graphql", options)
        .then(response => response.json())
        .then(response => {
            const zones = response.data.viewer.zones[0].firewallEventsAdaptive;
            const nonDupliArray = dropDuplicates(zones);
            const nonSensitive = filterSensitive(nonDupliArray);
            sendAlertToAbuseIPDB(nonSensitive);
        })
        .catch(err => console.error(err));
}

module.exports = {
    fetchCFEvents,
}
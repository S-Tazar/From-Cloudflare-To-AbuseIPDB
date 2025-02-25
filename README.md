# From-Cloudflare-To-AbuseIPDB

## 📦 What is it?
A Node.js pipeline that collects malicious IPs from Cloudflare WAF via GraphQL API and automatically reports them to AbuseIPDB, an open-source threat intelligence platform.

## 🕹️ Main feature
It provides a filter function which allows you to replace sensitive words from request URLs, and whitelist your trusted IP addresses when you trigger some forbidden URLs by mistake.

## 🔑 Required Permissions
Ensure your Cloudflare API token has the following permissions:
- Zone:Analytics (Read)

### ⚙️ Configuration Variables
- `CF_ZONE_ID`: The zone ID of your Cloudflare domain.
- `CF_API_TOKEN`: Your Cloudflare API token.
- `ABUSEIP_DB_KEY`: Your AbuseIPDB API key.
- `SENSITIVE`: A comma-separated list of words to replace in the request URLs.
- `WHITELIST_IP`: A comma-separated list of IP addresses to whitelist.

## 🚀 How to use it?
You can deploy this project on your server or use serverless services.
To completely install and configure this project, follow these steps:
- Clone this repository into wherever you want to place.
- Run 'npm install' in command line under project directory to install dependencies.
- Rename .env example to .env, and then fill the required environment variables in the file.
- Set your cron jobs to schedule the fetching and reporting intervals. I have preset the fetching interval as 3.5h while the reporting interval as 3h. I make these overlaps to make sure it can cover all the time slots.  You can modify this in src/fetch.js, line 11, if needed.
- Run 'node index.js' in command line to start the project.

## 📝 License
MIT

Let's fight together to forge a safer Internet!
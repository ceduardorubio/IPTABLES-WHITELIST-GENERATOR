# WHITELISTS BY COUNTRIES
Use this script to easily allow request only from the countries you choose.

Edit config.js as you want and run npm start, and it will generate a script "iptables.sh" in the current directory, with the  whitelist iptables rules.

The ip ranges list is from ip2location.com.
Don't forget to include[if is not included in the ranges] your ip and port you need to access to your server [like your ssh port]

IMPORTANT: The rules generated are related ONLY to the ports you set in config.js file.

[ Just 34 lines of code can prevent DDOS!!!]
## REQUIREMENTS
- CURL
- UNZIP
- NODE.JS

## config.js
```js
const COUNTRY_CODES = ["US"]; // replace with the countries you want to add to your whitelist or blacklist
const PORTS = ["443"]; // replace with the ports you want to add to your whitelist or blacklist
```

## Instructions
- edit config: nano config.js
- run script: npm start
- read and edit iptables.sh if you need to add more rules:
- use iptables.sh file aS you need: bash iptables.sh
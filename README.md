# WHITELISTS BY COUNTRIES
Use this tool to create a iptables script and easily allow request to your server only from the countries you choose(countries whitelist).

The ip ranges list is from ip2location.com.
Don't forget to include[if is not included in the ranges] your ip and port you need to access to your server [like your ssh port]

IMPORTANT: The rules generated are related ONLY to the selected countries and ports .

prevent DDOS!!!
## REQUIREMENTS
- NODE.JS / NPM

## Instructions
- npm install
- npm start
- enter the ports and countries you want to add to your whitelist
- use iptables file as you need: bash iptables
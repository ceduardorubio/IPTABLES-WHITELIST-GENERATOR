# ALLOW REQUEST BY COUNTRY
Use this script to easily allow request only from the countries you choose.
Edit main.sh as you want and execute IT, and it will generate a script call
If you want to update the rules, we recoment to DELETE previuos iptables rules created with this scriopt and generate a new set of rules.

## REQUIREMENTS
- NODE.JS

## INSTRUCTIONS
### On main.sh file
- Uncomment what you need 
- Change the country or countries code you want
- Change the ports to your ports
- Change the ACCEPT to DROP if you want to block the ips from the country codes you select
- Change ADD to DELETE if you want to get a script for removing previous rules generate with this script.
- When you execute ./main.sh, it will generate a file name rules.iptables in the current directory
- Add your rules in the rules.iptables files
- Dont forget to add your ip and port you need to access to your server [like your ssh port]
- make it executable: sudo chmod +x rules.iptables 
- run it: sudo ./rules.iptables
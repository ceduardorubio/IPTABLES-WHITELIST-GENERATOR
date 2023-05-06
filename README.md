# IPTABLES WHITELIST GENERATOR
Use this tool to create a iptables script and easily allow request to your server only from the countries you choose(countries whitelist). You will need to execute the resulting script inside the server you want to protect (server target)

The ip ranges list is from ip2location.com.
Don't forget to include[if is not included in the ranges] your ip and port you need to access to your server [like your ssh port]

IMPORTANT: The rules generated are related ONLY to the selected countries and ports .

prevent DDOS!!!
## REQUIREMENTS
- NODE.JS / NPM

## CODE 
- Read this code in https://github.com/ceduardorubio/WHITELISTS-BY-COUNTRIES 

## INSTALLATION
```bash
    npm install -g iptables-whitelist
```
## Options 

### --help
Will show the command help
```bash

 WELCOME TO IPTABLES WHITELIST GENERATOR

Creates a iptables script in the current directory for:
ALLOWING ACCESS TO THE PROVIDED PORTS TO ALL IP ADDRESS YOU ADD AND ALL THE IP ADDRESSES IN THE SELECTED COUNTRY(IES) AND DENY ACCESS TO EVERYONE ELSE

--help,        -h      Show this help
--countries,   -c      Will ask you to select which countries you want to allow access to the ports you select
--local,       -l      Downloads and decompress IP2LOCATION-LITE-DB1.CSV.ZIP file inside lib folder in the current directory
--update,      -u      Updates (download the current versión of)IP2LOCATION-LITE-DB1.CSV.ZIP file

You can use local and update options together


 WE STRONGLY RECOMMEND THE USE OF THIS TOOL ONLY FOR DEVELOPERS WITH AT LEAST BASIC KNOWLEDGE ABOUT IPTABLES

Read de code in https://github.com/ceduardorubio/WHITELISTS-BY-COUNTRIES
This is a Free Tool

Thanks to ip2location.com, the IP list is provided under the terms of the IP2LocationLite license.
Licence: https://creativecommons.org/licenses/by-sa/4.0/
This site or product includes IP2Location LITE data available from https://lite.ip2location.com
```
### --countries
Will ask you to select which countries you want to allow access to the ports you select
### --local
If doesn't exist the folder lib in the current file,the command will downloads and decompress IP2LOCATION-LITE-DB1.CSV.ZIP file inside lib folder in the current directory
### --update
Force to download and use the current version of IP2LOCATION-LITE-DB1.CSV.ZIP fromhttps://lite.ip2location.com

## IMPORTANT
We advice not to use with ssh port (port 22) unless you completely understand the risk and the steps to make sure not to lock yourself out of the target server
## USE
### Start Iptables Whitelist Generator
- Only with specific ip addresses, no countries prompt
```bash
    iptables-whitelist 
```



- with prompt for allowing countries 
```bash
    iptables-whitelist  --countries
```
- with countries prompt, update current IP2Location file, and save the IP2Location File  in current directory (/lib) 
```bash
    iptables-whitelist --countries --update --local
```
- 
### Select the ports you want to ALLOW/DENY access to
Type the ports you want to protect. Example: 22, 80

```bash 
Enter the port(s) separated by coma (,). [Example: 22,80,443,3306]:
22,80
```
### ALLOW SPECIFIC IPs
Type the ip addresses you need to allow access to the ports, like your computer o other servers that will be connected to the server in which you will add these iptables rules. Example if your target server is a mysql server and second server will connect to it, you have to add to these list the ip address of the second server.

If you are in the same local network than your target server, you will need to add your local ip address. 

If you access yor target server remotely, you need to add you public ip address ( MAKE SURE THAT YOUR PUBLIC IP ADDRESS IS STATIC)

In the next example the target server(mysql server) will be access for the admin via ssh from a computer in the same LAN with the target server and will be access remotely to read/write data using a mysql client
- LAN Ip - target server: 192.168.5.3
- WAN Ip - target server: 7.7.7.7
- Local Ip admin: 192.168.5.2
- WAN Ip remote server: 10.10.10.10
```bash
Enter the IP PUBLIC Addresses you want to EXPLICITLY ALLOW ACCESS TO ALL PORTS REMOTELY, no matter the country.
Enter the IP Addresses separated by coma (,). [Example: 1.1.1.1,8.8.8.8]
Don't forget to enter the public ip addresses of the devices you will use to access to your server
Or if you are in the same LAN with the server, add your local ip address too. (like 192.168.xxx.xxx)
You can get your public IP Address from https://www.whatismyip.com/ or your local ip using your system network manager.
  [default: no ip addresses]:
192.168.5.2,10.10.10.10
```

### Select COUNTRY CODE ( --countries | -c)
When you execute it with the countries option ( iptables-whitelist --countries ), the prompt will show the list of codes and countries available and ask you to type the codes of the country you want to allow access to the previous added ports. All ip address will be able to access the ports you add in the previous step.
```bash 
AD - Andorra
AE - United Arab Emirates
AF - Afghanistan
AG - Antigua and Barbuda
AI - Anguilla
AL - Albania
AM - Armenia
... 
US - United States of America
UY - Uruguay
UZ - Uzbekistan
VA - Holy See
VC - Saint Vincent and The Grenadines
VE - Venezuela (Bolivarian Republic of)
VG - Virgin Islands (British)
VI - Virgin Islands (U.S.)
VN - Viet Nam
VU - Vanuatu
WF - Wallis and Futuna
WS - Samoa
YE - Yemen
YT - Mayotte
ZA - South Africa
ZM - Zambia
ZW - Zimbabwe

Enter the countries codes separated by coma (,).[Example: US,GB ]:
US
[ 22, 80 ] [ 'EC' ]

```
## Script Generated Successfully
the commando will prompt the next message:
```bash 
The script will:


Deny these ports to everyone     : xx,yy,zzz....
These ip addresses be allowed       : xxx.xxx.xxx.xxx,yyy.yyy.yyy.yyy, ...
processing ...

IPTABLES FILE GENERATED!!!

Don't forget to add your own rules to the script in the comment section
 read and edit the file ./iptables_cwDateTimeNumber.sh and execute it with bash the iptables_cwDateTimeNumber.sh

 READ THE COMMENTS IN THE SCRIPT BEFORE EXECUTING IT!
 !!! BE SURE NOT TO LOCK YOURSELF OUT OF YOUR SERVER !!!

 * thanks to ip2location.com, the IP list is provided under the terms of the IP2LocationLite license. *

```

## Copy to Your Target Server
Copy the generated script into the server you want to protect, with tools ls scp or ftp
```bash
    scp iptables_cwDateTimeNumber.sh user@yourServerIp:/the/path/ofYour/selection
```

## Execute Script inside the Server
```bash
    ssh user@yourServerIp
    #inside the server
    cd /the/path/ofYour/selection
    # read the script to make sure your ip address is allow to access de server
    # the user should have privileges (root, sudoers)
    bash iptables_cwDateTimeNumber.sh

```
## DB from ip2location.com
- Thanks to ip2location.com, the IP list is provided under the terms of the IP2LocationLite license. 
- Licence: https://creativecommons.org/licenses/by-sa/4.0/
- This site or product includes IP2Location LITE data available from https://lite.ip2location.com

## License

[MIT](LICENSE)

## Author

Carlos Velasquez

## JUST READ THE CODE 
- ## READ THE GENERATED SCRIPT BEFORE EXECUTE IT !!!
- ## MAKE SURE NOT TO LOCK YOURSELF OUT OF THE SERVER !!!


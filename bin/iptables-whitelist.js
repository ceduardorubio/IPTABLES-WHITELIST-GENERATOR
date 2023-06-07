const fs         = require("fs");
const readline   = require('readline');
const rl         = readline.createInterface(process.stdin, process.stdout);
const https      = require('https');
const decompress = require('decompress');
const url        = "https://download.ip2location.com/lite/IP2LOCATION-LITE-DB1.CSV.ZIP";
let   lib        = __dirname + "/lib";
const ipListFile = lib + "/DB/IP2LOCATION-LITE-DB1.CSV";
const zipFile    = lib + '/IP2LOCATION-LITE-DB1.CSV.ZIP';
const folderDest = lib + '/DB';

let PORTS        = [];
let CODES        = [];
let IP_ADDRESSES = [];
let withCountries= false;

console.log(" ");
    Lines("\x1b[1m WELCOME TO IPTABLES WHITELIST GENERATOR \x1b[0m");
console.log(" ");

function PortSelection(cb){
    rl.question('\nEnter the port(s) separated by coma (,). [Example: 22,80,443,3306]: \n', (str_ports= "443,80") => {
        str_ports = str_ports.replace(/\s/g, "");
        let sPorts = str_ports.split(",");
        let arePorts = sPorts.every(p => !isNaN(p) && Number(p) > 0 && Number(p) < 65536);
        if(arePorts){
            if (sPorts.length === 1 && sPorts[0] === "") sPorts = [443,80];
            PORTS = sPorts.map(p => Number(p));
            cb();
        } else {
            console.log("Please enter valid port numbers");
            PortSelection(cb);
        }
        
    });
}

function SecurityCheck(cb){
    let msg = `\nEnter the IP PUBLIC Addresses you want to EXPLICITLY ALLOW ACCESS TO ALL PORTS REMOTELY, no matter the country.\n`
    msg += `Enter the IP Addresses separated by coma (,). [Example: 1.1.1.1,8.8.8.8] \n`;
    msg += `Don't forget to enter the public ip addresses of the devices you will use to access to your server\n`;
    msg += `Or if you are in the same LAN with the server, add your local ip address too. (like 192.168.xxx.xxx)\n`;
    msg += `You can get your public IP Address from https://www.whatismyip.com/ or your local ip using your system network manager.\n\n`;
    msg += `DON'T FORGET TO PUT THE IP OF YOUR SERVER HERE: [ifconfig (eth0 ,eth1...)].\n\n`;
    msg += `  [default: no ip addresses]:\n`
    rl.question(msg, (devicesIpAddresses = "") => {
        if( devicesIpAddresses === "" || devicesIpAddresses === null || devicesIpAddresses === undefined){
            cb();
        } else {
            devicesIpAddresses = devicesIpAddresses.replace(/\s/g, "");
            let sIpAddresses = devicesIpAddresses.split(",");
            if (sIpAddresses.length === 1 && sIpAddresses[0] === "") sIpAddresses = [];
            IP_ADDRESSES = sIpAddresses.map(p => p.trim());
            cb();
        }
    });
}

function SelectCountry(cb){
    if(withCountries){
        let validCodes = [];
        let c = GetCountries();
        c.forEach(c => {
            validCodes.push(c[0]);
            console.log(c[0] + " - " + c[1])
        });
        const msg = '\nEnter the countries codes separated by coma (,).[Example: US,GB ]:\n';
        rl.question(msg, (str_codes = "US") => {
            str_codes = str_codes.replace(/\s/g, "");
            let sCodes = str_codes.split(",").map(c => c.toUpperCase());
            let areCodes = sCodes.every(c => validCodes.includes(c));
            if(areCodes){
            CODES = sCodes;
                cb();
            } else {
                console.log("Please enter valid country codes");
                SelectCountry(cb);
            }
        });
    } else {
        cb();
    }
}

function CreateScript(cb){
    const chainName = GetChainName();
    ScriptGenerator(PORTS, CODES, chainName, IP_ADDRESSES,content => {
        fs.writeFileSync("./iptables_" + chainName + ".sh", content);
        cb(chainName);
    });
}

function Logs (chainName){
    console.log("\x1b[1m");
    console.log("IPTABLES FILE GENERATED!!!"); 
    console.log("\x1b[0m");
    console.log("Don't forget to add your own rules to the script in the comment section");
    console.log(" read and edit the file ./iptables_" + chainName + ".sh and execute it with bash the iptables_" + chainName + ".sh " );
    console.log("\x1b[1m");
    console.log(" READ THE COMMENTS IN THE SCRIPT BEFORE EXECUTING IT!");
    console.log(" !!! BE SURE NOT TO LOCK YOURSELF OUT OF YOUR SERVER !!! ");
    console.log("\x1b[0m");
    console.log(" * thanks to ip2location.com, the IP list is provided under the terms of the IP2LocationLite license. * ");
    console.log("This site or product includes IP2Location LITE data available from https://lite.ip2location.com    ");
    console.log("");
    process.exit(0);
}

function GetChainName(){
    const d         = new Date();
    const d1        = d.getFullYear() + ((d.getMonth() + 1) + "").padStart(2,"0")  + (d.getDate() + "").padStart(2,"0")
    const d2        = (d.getHours() + "").padStart(2,"0") + (d.getMinutes() + "").padStart(2,"0")  + (d.getSeconds() + "").padStart(2,"0") ;
    const date      = d1 + d2;
    const chainName = "cwl" + date ;
    return chainName;

}

const downloadZIP = function(cb) {
    if(withCountries){
        if (fileExists(zipFile)) {
            cb();
        } else {
            console.log("Downloading the latest IP list from: " + url);
            const file = fs.createWriteStream(zipFile);
            https.get(url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    console.log("Downloaded IP list successfully!");
                    file.close(cb);
                });
            });
        }
    } else {
        cb();
    }
}
 
function extractZIP( cb) {
    if(withCountries){
        if(fileExists(folderDest)) {
            cb();
        } else {
            console.log("Extracting the IP list: " + ipListFile);
            decompress(zipFile, folderDest).then(files => function() {
            }).catch(err => {
                console.error(err);
            }).finally(() => {
                console.log("Extracted IP list successfully!");
                cb();
            });
        }
    } else {
        cb();
    }
}

// check if file exists
function fileExists(path) {
    try {
        if (fs.existsSync(path)) {
            return true;
        } else {
            return false;
        }
    }
    catch (err) {
        console.error(err);
    }
}

const getIPRanges = function (COUNTRY_CODES) {
    let ipRanges = fs.readFileSync(ipListFile, "utf8")
    .split("\r\n").map(line => {
        let [min, max, code, name] = line.replaceAll('"', '').split(",");
        return [IpNumberTo8BitsSegments(min), IpNumberTo8BitsSegments(max), code, name];
    })
    .filter(line => COUNTRY_CODES.includes(line[2]));
    return ipRanges;
}

function GetCountries() {
    let countries = fs.readFileSync(ipListFile, "utf8")
        .split("\r\n").map(line => {
            let [min, max, code, name] = line.replaceAll('"', '').split(",");
            return [code, name];
        }).sort((a, b) => {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
            return 0;
        });

    var distinct = []
    for (var i = 0; i < countries.length; i++)
        if (distinct.findIndex(d => d[0] == countries[i][0]) == -1) distinct.push(countries[i]);

    return distinct.filter(line => line[0] !== undefined);
}
 
 
function IpNumberTo8BitsSegments(ipNumber) {
    let binaryIP = Number(ipNumber).toString(2);
    let binary32digitsIp = binaryIP.padStart(32, '0');
    let segments8bits = binary32digitsIp.match(/.{1,8}/g);
    return segments8bits.map(segment => parseInt(segment, 2)).join(".");
}
 
function ScriptGenerator(PORTS, COUNTRY_CODES,chainName,IpAddresses,cb) {
    console.log("\x1b[1m");
    console.log("The script will:");
    console.log("\x1b[0m");
    console.log("");
    console.log("Deny these ports to everyone     : " + PORTS.join(','));
    if (withCountries) console.log("These countries will be allowed  : " + COUNTRY_CODES.join(","));
    console.log("These ip addresses be allowed       : " + IP_ADDRESSES.join(','));
    console.log("processing ...");

    let result = "";

    function AppendOutput(output) {
        result += output + "\n";
    }
 
    AppendOutput(`# the new chain name is:  ${chainName}`);
    if(withCountries) AppendOutput(`# the countries codes are: ${COUNTRY_CODES.join(",")}`);
    AppendOutput(`# the ports are: ${PORTS.join(",")}`);
    AppendOutput(`# this script will allow to access the ports ${PORTS.join(",")}. Everyone else will be blocked.`);
 
    if(IpAddresses.length > 0) AppendOutput(`# Allowed devices ip addresses to access to all ports.`);
    if(IpAddresses.length > 0) IpAddresses.forEach( i => AppendOutput(`iptables -I INPUT  -p tcp -s ${i} -j ACCEPT;`) );
    if(IpAddresses.length > 0) IpAddresses.forEach( i => AppendOutput(`iptables -I OUTPUT -p tcp -s ${i} -j ACCEPT;`));
 
    if(withCountries){
        let ipRanges = getIPRanges(COUNTRY_CODES);
        AppendOutput(`# Creating the new chain ${chainName}`)
        AppendOutput(`iptables -N ${chainName};`);
        AppendOutput(`# Allowing the countries codes ${COUNTRY_CODES.join(",")} to access the ports ${PORTS.join(",")}. All other countries will be blocked.`);
        AppendOutput(ipRanges.map(r => {
            let range = (r[0] + "-" + r[1]).padEnd(33, " ");
            let result = `iptables -A ${chainName} -m iprange --src-range ${range} -j ACCEPT; # ip range from ${r[2]}`;
            return result;
        }).join("\n"));
        AppendOutput(`# Ending the chain ${chainName} with a RETURN rule`);
        AppendOutput(`iptables -A ${chainName} -j RETURN`);
        AppendOutput(`# Adding the chain ${chainName} to the INPUT chain with the ports ${PORTS.join(",")}`);
        AppendOutput(`iptables -A INPUT -p tcp -m multiport --dports ${PORTS.join(",")} -j ${chainName};`);
    }
 
    AppendOutput(`# iptables script generated by iptables-generator`);
    AppendOutput(`# Allow server to connect to itself`);
    AppendOutput(`iptables -I INPUT -s 127.0.0.1 -j ACCEPT`);
    AppendOutput(`iptables -I OUTPUT -s 127.0.0.1 -j ACCEPT`);
    AppendOutput(`iptables -A INPUT -p tcp -m multiport --dports ${PORTS.join(",")} -j DROP;`);
    AppendOutput(` `);    
    AppendOutput(`# ONLY THE PROVIDED PORTS ARE CONSIDERED. ALL OTHER PORTS ARE NEITHER ALLOW OR DENY FROM ANY REQUEST`);
    AppendOutput(` `);
    AppendOutput(`# Don't forget to give yourself access to the ports you want to allow [ssh, http, https, etc]`);
    AppendOutput(` `);
    AppendOutput(` `);
    AppendOutput(` `);
    AppendOutput(` `);
    AppendOutput(` `);

    AppendOutput(`# IF THERE WERE ANY ERRORS EXECUTING THE PREVIOUS LINES, YOU WILL BE LOCKED OUT OF YOUR SERVER. YOU WILL NEED TO ACCESS YOUR SERVER THROUGH THE CONSOLE`);

    AppendOutput(`# AND REMOVE THIS LINE FROM INPUT IPTABLES CHAIN:`);

    AppendOutput(`# DROP       tcp  --  anywhere             anywhere             multiport dports ssh,http,https,mysql `);
    AppendOutput(`# USING THESE COMMAND TO GET THE RULE LINE: `);
    AppendOutput(`# iptables -L INPUT --line-numbers | grep DROP `);
    AppendOutput(`# copy the number of the line (number before the word DROP) and execute the next line: `);
    AppendOutput(`# replace de ? sign with the number of the line `);
    AppendOutput(`# iptables -D INPUT ?`);
    AppendOutput(` `);
    AppendOutput(` `);

    AppendOutput("# *** WE STRONGLY RECOMMEND THE USE OF THIS TOOL ONLY FOR DEVELOPERS WITH KNOWLEDGE ABOUT IPTABLES ***");
    AppendOutput("# Read the code in https://github.com/ceduardorubio/WHITELISTS-BY-COUNTRIES");
    AppendOutput("# This is a Free Tool");
    AppendOutput("");
    AppendOutput("# Thanks to ip2location.com, the IP list is provided under the terms of the IP2LocationLite license. ");
    AppendOutput(`# Licence: https://creativecommons.org/licenses/by-sa/4.0/`);
    AppendOutput(`# This site or product includes IP2Location LITE data available from https://lite.ip2location.com`);

    AppendOutput(` `);
    AppendOutput(`# **** NOTE: `);
    AppendOutput(`# ? IF YOU GOT OUT OF YOUR SERVER`);
    AppendOutput(`# !!!! GAIN ACCESS USING YOUR CLOUD PROVIDER CONNECTION CONSOLE LIKE CLOUD SHELL`);
    AppendOutput(`# * first allow all connections from your current public ip`);
    AppendOutput(`# iptables -I INPUT -p tcp -s your.ip -j ACCEPT`);
    AppendOutput(`# iptables -I OUTPUT -p tcp -d  your.ip -j ACCEPT`);

    AppendOutput(`# * now you will be able to connect using your ssh client directly in your computer/device`);
    AppendOutput(`# * then delete the chain`);
    AppendOutput(`# iptables -F ${chainName}`);
    AppendOutput(`# iptables -D INPUT -j ${chainName} `);
    AppendOutput(`# iptables -X ${chainName}`);
    AppendOutput(`# * COMMANDS FOR IPTABLES`);
    AppendOutput(`# iptables -L                                     # list all rules in INPUT chain`);
    AppendOutput(`# iptables -L INPUT                               # list all rules in INPUT chain`);
    AppendOutput(`# iptables -D INPUT -j ${chainName}               # delete all rules in INPUT chain refer to ${chainName} (links)`);
    AppendOutput(`# iptables -F ${chainName}                        # flush all rules in chain (links) `);
    AppendOutput(`# iptables -X ${chainName}                        # delete chain `);
    AppendOutput(`# iptables -I INPUT -p tcp -s your.ip -j ACCEPT   # prepend rule to INPUT chain and accept connection from your.ip`);
    AppendOutput(`# iptables -I OUTPUT -p tcp -d  your.ip -j ACCEPT # prepend rule to OUTPUT chain and accept connection to your.ip`);
    AppendOutput(`# iptables -A INPUT -p tcp -s your.ip -j          # append rule to INPUT chain and accept connection from your.ip`);
    AppendOutput(`# iptables -A OUTPUT -p tcp -d  your.ip -j ACCEPT # append rule to OUTPUT chain and accept connection to your.ip`);
    AppendOutput(`# iptables -L --line-numbers                      # list all rules in INPUT chain with line numbers`);
    AppendOutput(`# iptables -D INPUT 1                             # delete rule 1 in INPUT chain`);
    AppendOutput(`# iptables -D OUTPUT 1                            # delete rule 1 in OUTPUT chain`);
    AppendOutput(`# * ban an ip`);
    AppendOutput(`# * iptables -I INPUT -s xxx.xxx.xxx.xxx -j DROP`);

     
     
    cb(result);
 }

function Main (){
    if(withCountries) if (!fs.existsSync(lib)) fs.mkdirSync(lib);
    downloadZIP(() => 
        extractZIP(() => 
            PortSelection(() => 
                SecurityCheck(() => 
                    SelectCountry(() => 
                        CreateScript( (chainName) =>
                            Logs(chainName)
                        )
                    )
                )
            )
        )
    )
}

function Lines(str){
    console.log(str);
}

let args = process.argv
if(args.includes("--help") || args.includes('-h')){
    Lines("Creates a iptables script in the current directory for:");
    Lines("ALLOWING ACCESS TO THE PROVIDED PORTS TO ALL IP ADDRESS YOU ADD AND ALL THE IP ADDRESSES IN THE SELECTED COUNTRY(IES) AND DENY ACCESS TO EVERYONE ELSE");
    Lines("");
    Lines("--help,        -h      Show this help");
    Lines("--countries,   -c      Will ask you to select which countries you want to allow access to the ports you select");
    Lines("--local,       -l      Downloads and decompress IP2LOCATION-LITE-DB1.CSV.ZIP file inside lib folder in the current directory");
    Lines("--update,      -u      Updates (download the current versión of)IP2LOCATION-LITE-DB1.CSV.ZIP file");
    Lines(""); 
    Lines("You can use local and update options together ");
    Lines("");
    Lines("");
    Lines("\x1b[1m WE STRONGLY RECOMMEND THE USE OF THIS TOOL ONLY FOR DEVELOPERS WITH AT LEAST BASIC KNOWLEDGE ABOUT IPTABLES \x1b[0m");
    Lines("");
    Lines("Read de code in https://github.com/ceduardorubio/WHITELISTS-BY-COUNTRIES");
    Lines("This is a Free Tool");
    Lines("");
    Lines("Thanks to ip2location.com, the IP list is provided under the terms of the IP2LocationLite license. ");
    Lines(`Licence: https://creativecommons.org/licenses/by-sa/4.0/`);
    Lines(`This site or product includes IP2Location LITE data available from https://lite.ip2location.com`);
    Lines("");
    process.exit(0);
} else {
    if(args.includes("--countries") || args.includes('-c')) withCountries = true;
    if(args.includes("--local") || args.includes('-l')) lib = "./";
    if(args.includes('--update') || args.includes('-u')){
        console.log("...updating");
        if(fs.existsSync(lib)){
            fs.rmdir(lib,{recursive:true,force:true},()=>{
                Main();
            })
        }
    } else {
        Main();
    } 
}

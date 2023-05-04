const { downloadZIP, extractZIP } = require("./download");
const ScriptGenerator             = require("./generator");
const fs                          = require("fs");
const readline                    = require('readline');
const GetCountries                = require("./countries");
const rl                          = readline.createInterface(process.stdin, process.stdout);
const ipListFile                  = "./DB/IP2LOCATION-LITE-DB1.CSV";

let PORTS        = [];
let CODES        = [];
let IP_ADDRESSES = [];

console.log("Welcome to the IPTables script generator!");

// create folder if not exists
if (!fs.existsSync("./iptables_scripts")) {
    fs.mkdirSync("./iptables_scripts");
}

function PortSelection(cb){
    rl.question('\nEnter the port(s) separated by coma (,). [Example: 22,80,443,3306] [default: 443,80]: \n', (str_ports) => {
        let sPorts = str_ports.split(",");
        if (sPorts.length === 1 && sPorts[0] === "") sPorts = [443,80];
        PORTS = sPorts.map(p => Number(p));
        cb();
    });
}

function SecurityCheck(cb){
    let msg = `\nEnter the IP Addresses you want to EXPLICITLY ALLOW ACCESS TO ALL PORTS, no matter the country.\n`
    msg += `Enter the IP Addresses separated by coma (,). [Example: 1.1.1.1,8.8.8.8] \n`;
    msg += `Don't forget to enter the public ip addresses of the devices you will use to access to your server)\n`;
    msg += `(You can get your public IP Address from https://www.whatismyip.com/) [default: null]:\n`
    rl.question(msg, (devicesIpAddresses) => {
        if( devicesIpAddresses === "" || devicesIpAddresses === null || devicesIpAddresses === undefined){
            cb();
        } else {
            let sIpAddresses = devicesIpAddresses.split(",");
            if (sIpAddresses.length === 1 && sIpAddresses[0] === "") sIpAddresses = [];
            IP_ADDRESSES = sIpAddresses.map(p => p.trim());
            cb();
        }
    });
}

function SelectCountry(cb){
    let c = GetCountries(ipListFile);
    c.forEach(c => console.log(c[0] + " - " + c[1]));
    const msg = '\nEnter the countries codes separated by coma (,).[Example: US,GB ] [default:US]:\n';
    rl.question(msg, (str_codes) => {
        let sCodes = str_codes.split(",").map(c => c.toUpperCase());
        if (sCodes.length === 1 && sCodes[0] === "") sCodes = ["US"];
        CODES = sCodes;
        cb();
    });
}

function CreateScript(cb){
    const chainName = GetChainName();
    ScriptGenerator(PORTS, CODES, chainName, IP_ADDRESSES,content => {
        fs.writeFileSync("./iptables_scripts/iptables_" + chainName + ".sh", content);
        cb(chainName);
    });
}

function Logs (chainName){
    console.log("iptables file generated. Don't forget to add your own rules to the script in the comment section");
    console.log(" edit the file ./iptables_scripts/iptables_" + chainName + ".sh and execute it with bash the iptables_" + chainName + ".sh " );
    console.log(" READ THE COMMENTS IN THE SCRIPT BEFORE EXECUTING IT!");
    console.log(" * thanks to ip2location.com, the IP list is provided under the terms of the IP2LocationLite license. * ");
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

function Main (){
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

Main();
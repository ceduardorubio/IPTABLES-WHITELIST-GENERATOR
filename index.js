const { download, extract } = require("./download");
const ScriptGenerator = require("./generator");
const fs = require("fs");


const readline = require('readline');
const GetCountries = require("./countries");

const rl = readline.createInterface(
    process.stdin, process.stdout);


let url = "https://download.ip2location.com/lite/IP2LOCATION-LITE-DB1.CSV.ZIP";
let ipListPath = "./DB/IP2LOCATION-LITE-DB1.CSV";

console.log("Welcome to the IPTables script generator!");
console.log("Downloading the latest IP list from: " + url);

// create folder if not exists
if (!fs.existsSync("./iptables_scripts")) {
    fs.mkdirSync("./iptables_scripts");
}

download('https://download.ip2location.com/lite/IP2LOCATION-LITE-DB1.CSV.ZIP', './IP2LOCATION-LITE-DB1.CSV.ZIP', function() {
    console.log("Downloaded IP list successfully!");
    console.log("Extracting the IP list: " + ipListPath);
    extract('./IP2LOCATION-LITE-DB1.CSV.ZIP', './DB', function() {
        console.log("Extracted IP list successfully!");
        rl.question('\nEnter the port(s) separated by coma (,). [Example: 22,80,443,3306] [default: 443]: \n', (str_ports) => {
            let ports = str_ports.split(",");
            if (ports.length === 1 && ports[0] === "") ports = [443];
            let c = GetCountries(ipListPath);
            c.forEach(c => console.log(c[0] + " - " + c[1]));
            rl.question('\nEnter the countries codes separated by coma (,).[Example: US,GB ] [default:US]:\n', (str_codes) => {
                let codes = str_codes.split(",").map(c => c.toUpperCase());
                if (codes.length === 1 && codes[0] === "") codes = ["US"];
                let d = new Date();
                let date = d.getFullYear() + ((d.getMonth() + 1) + "").padStart(2,"0")  + (d.getDate() + "").padStart(2,"0")  + (d.getHours() + "").padStart(2,"0") + (d.getMinutes() + "").padStart(2,"0")  + (d.getSeconds() + "").padStart(2,"0") ;
                let chainName = "cwl" + date ;
                ScriptGenerator(ports, codes, ipListPath, chainName ,content => {
                    console.log("iptables file generated. Don't forget to add your own rules to the script in the comment section");
                    console.log(" edit the file ./iptables_scripts/iptables_" + chainName + ".sh and execute it with bash the iptables_" + chainName + ".sh " );
                    console.log(" * thanks to ip2location.com, the IP list is provided under the terms of the IP2LocationLite license. * ");

                    fs.writeFileSync("./iptables_scripts/iptables_" + chainName + ".sh", content);
                    process.exit(0);
                });
            });

        });
    });
});

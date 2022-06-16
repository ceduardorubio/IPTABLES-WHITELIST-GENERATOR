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

download('https://download.ip2location.com/lite/IP2LOCATION-LITE-DB1.CSV.ZIP', './IP2LOCATION-LITE-DB1.CSV.ZIP', function() {
    console.log("Downloaded IP list successfully!");
    console.log("Extracting the IP list: " + ipListPath);
    extract('./IP2LOCATION-LITE-DB1.CSV.ZIP', './DB', function() {
        console.log("Extracted IP list successfully!");
        rl.question('\nEnter the port(s) separated by coma (,). [Example: 443,21] [default: 443]: \n', (str_ports) => {
            let ports = str_ports.split(",");
            if (ports.length === 1 && ports[0] === "") ports = [443];
            let c = GetCountries(ipListPath);
            c.forEach(c => console.log(c[0] + " - " + c[1]));
            rl.question('\nEnter the countries codes separated by coma (,).[Example: US,GB ] [default:US]:\n', (str_codes) => {
                let codes = str_codes.split(",").map(c => c.toUpperCase());
                if (codes.length === 1 && codes[0] === "") codes = ["US"];
                ScriptGenerator(ports, codes, ipListPath, content => {
                    console.log("iptables file generated. Dont forget to add your own rules to the script in the comment section");
                    fs.writeFileSync("./iptables", content);
                    process.exit(0);
                });
            });

        });
    });
});
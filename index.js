const { download, extract } = require("./download");
const ScriptGenerator = require("./generator");
const fs = require("fs");


var readline = require('readline');

var rl = readline.createInterface(
    process.stdin, process.stdout);



download('https://download.ip2location.com/lite/IP2LOCATION-LITE-DB1.CSV.ZIP', './IP2LOCATION-LITE-DB1.CSV.ZIP', function() {
    extract('./IP2LOCATION-LITE-DB1.CSV.ZIP', './DB', function() {
        let ipListPath = "./DB/IP2LOCATION-LITE-DB1.CSV";

        rl.question('Enter the port(s) separated by coma (,). Example: 443,21 ', (str_ports) => {
            let ports = str_ports.split(",");
            ScriptGenerator(ports, countries_codes, ipListPath, content => {
                console.log("iptables.sh generated. Dont forget to add your own rules to the script in the comment section");
                fs.writeFileSync("./iptables", content);
            });
        });

    });
});
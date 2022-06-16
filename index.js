const { download, extract } = require("./download");
const ScriptGenerator = require("./generator");
const fs = require("fs");

let ports = process.argv[2].split(",");
let countries_codes = process.argv[3].split(",");

download('https://download.ip2location.com/lite/IP2LOCATION-LITE-DB1.CSV.ZIP', './IP2LOCATION-LITE-DB1.CSV.ZIP', function() {
    extract('./IP2LOCATION-LITE-DB1.CSV.ZIP', './DB', function() {
        let ipListPath = "./DB/IP2LOCATION-LITE-DB1.CSV";
        ScriptGenerator(ports, countries_codes, ipListPath, content => {
            console.log("iptables.sh generated. Dont forget to add your own rules to the script in the comment section");
            fs.writeFileSync("./iptables", content);
        });
    });
});
const ScriptGenerator = require("./generator")


let ipListPath = "./DB/IP2LOCATION-LITE-DB1.CSV"

ScriptGenerator(ipListPath, content => {
    console.log(content);
});
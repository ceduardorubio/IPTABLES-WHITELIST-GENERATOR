var fs = require('fs');
var args = process.argv.slice(2);
var ports = args[0] || "80,443,22";
var jail = args[1] || "ACCEPT";

var stdin = process.openStdin();
var data = "";
stdin.on('data', function(chunk) {
    data += chunk;
});

stdin.on('end', ProcessData);

function ProcessData() {
    var ipLines = data.split("\r\n").filter(function(l) { return l != "\n" });
    var rules = ipLines.map(function(line) {
        var parts = line.split(",");
        var min = parts[0];
        var max = parts[1];
        return `iptables -A INPUT -p tcp -m multiport --dports ${ports} -m iprange --src-range ${min}-${max} -j ${jail}`;
    });
    if (rules.length == 0) {
        console.log("No IP ranges found");
    } else {
        rules.push("# add your rules here. dont forget to give yourself access to the ports you need to accessyor server, like ssh: ");
        rules.push("# iptables -A INPUT -p tcp -m multiport --dports 22 -j ACCEPT");
        rules.push("iptables -A INPUT -j DROP");
        rules.push("");
        var fileContent = "#!/bin/bash \r\n" + rules.join("\r\n");
        fs.writeFileSync("./rules.iptables", fileContent);
        console.log("Dont forget to add your rules inside rules.iptables file");
    }
}
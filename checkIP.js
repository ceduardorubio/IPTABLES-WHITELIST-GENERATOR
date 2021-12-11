var isInRanges = require("./isInRanges");
var args = process.argv.slice(2);
var ip = args[0];

var stdin = process.openStdin();
var data = "";
stdin.on('data', function(chunk) {
    data += chunk;
});

stdin.on('end', ProcessData);

function ProcessData() {
    var ipLines = data.split("\r\n").filter(function(l) { return l != "\n" });
    var ipRanges = ipLines.map(function(line) {
        var parts = line.split(",");
        return {
            min: parts[0],
            max: parts[1]
        };
    });
    if (ipRanges.length == 0) {
        console.log("No IP ranges found");
    } else {
        var range = isInRanges(ip, ipRanges);
        if (range > -1) {
            console.log("Is In Range: " + ipLines[range]);
        } else {
            console.log("Not In Range");
        }
    }
}
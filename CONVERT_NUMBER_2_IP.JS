#!/usr/bin/env node

var stdin = process.openStdin();
var data = "";
stdin.on('data', function(chunk) {
    data += chunk;
});

stdin.on('end', ProcessData);

function ProcessData() {
    var result = [];
    if (data != "") {
        var lines = data.split("\r\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            line = line.replace(/"/g, '');
            if (line != "") {
                var f = line.split(",");
                var formatedLine = [ProcessIP(f[0]), ProcessIP(f[1]), f[2], f[3]];
                formatedLine = formatedLine.join(",");
                result.push(formatedLine);
            }
        }

    }
    console.log(result.join("\r\n"));
}

function ProcessIP(ipNumber) {
    var nIP = Number(ipNumber);
    var binaryIP = nIP.toString(2);
    var binary32digitsIp = binaryIP.padStart(32, '0');
    var segments = binary32digitsIp.match(/.{1,8}/g);
    var result = segments.map(function(segment) {
        return parseInt(segment, 2);
    });
    var r = result.join(".");
    return r;
}
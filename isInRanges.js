function IptoNumber(ip) {
    var segments = ip.split(".");
    var binaries = segments.map(function(segment) {
        return Number(segment).toString(2).padStart(8, '0');
    });
    var binaryIP = binaries.join("");
    return parseInt(binaryIP, 2);
}

function isInRange(ip, min, max) {
    var ipNumber = IptoNumber(ip);
    return ipNumber >= IptoNumber(min) && ipNumber <= IptoNumber(max);
}

function isInRanges(ip, ipRanges) {
    for (var i = 0; i < ipRanges.length; i++) {
        var ipRange = ipRanges[i];
        if (isInRange(ip, ipRange.min, ipRange.max)) {
            return i;
        }
    }
    return -1;
}

module.exports = isInRanges;
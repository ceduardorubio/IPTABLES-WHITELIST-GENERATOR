var https = require('https');
var fs = require('fs');

const decompress = require('decompress');

var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
    });
}

module.exports = function(cb) {
    download('https://download.ip2location.com/lite/IP2LOCATION-LITE-DB1.CSV.ZIP', './IP2LOCATION-LITE-DB1.CSV.ZIP', function() {
        extract('./IP2LOCATION-LITE-DB1.CSV.ZIP', './DB', function() {
            cb();
        });
    });
}

//extract the zip file
//unzip the file
function extract(file, dest, cb) {
    decompress(file, dest).then(files => cb);
}
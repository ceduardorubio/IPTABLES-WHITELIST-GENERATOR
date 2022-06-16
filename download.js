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

module.exports = {
    download,
    extract
}

//extract the zip file
//unzip the file
function extract(file, dest, cb) {
    decompress(file, dest).then(files => function() {
        console.log('done decompressing');
    }).catch(err => {
        console.error(err);
    }).finally(() => {
        cb();
    });
}
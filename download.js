const https      = require('https');
const fs         = require('fs');
const decompress = require('decompress');

const url        = "https://download.ip2location.com/lite/IP2LOCATION-LITE-DB1.CSV.ZIP";
const ipListFile = "./DB/IP2LOCATION-LITE-DB1.CSV";
const zipFile    = './IP2LOCATION-LITE-DB1.CSV.ZIP';
const folderDest = './DB';

const downloadZIP = function(cb) {
   if (fileExists(zipFile)) {
        cb();
    } else {
        console.log("Downloading the latest IP list from: " + url);
        const file = fs.createWriteStream(zipFile);
        https.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                console.log("Downloaded IP list successfully!");
                file.close(cb);
            });
        });
    }
}

module.exports = {
    downloadZIP,
    extractZIP
}

//extract the zip file
//unzip the file
function extractZIP( cb) {
    if(fileExists(folderDest)) {
        cb();
    } else {
        console.log("Extracting the IP list: " + ipListFile);
        decompress(zipFile, folderDest).then(files => function() {
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            console.log("Extracted IP list successfully!");
            cb();
        });
    }
}

// check if file exists
function fileExists(path) {
    try {
        if (fs.existsSync(path)) {
            return true;
        } else {
            return false;
        }
    }
    catch (err) {
        console.error(err);
    }
}
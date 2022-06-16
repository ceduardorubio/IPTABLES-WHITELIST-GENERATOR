let fs = require('fs');

function GetCountries(ipListPath) {
    let countries = fs.readFileSync(ipListPath, "utf8")
        .split("\r\n").map(line => {
            let [min, max, code, name] = line.replaceAll('"', '').split(",");
            return [code, name];
        }).sort((a, b) => {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
            return 0;
        });

    var distinct = []
    for (var i = 0; i < countries.length; i++)
        if (distinct.findIndex(d => d[0] == countries[i][0]) == -1) distinct.push(countries[i]);

    return distinct.filter(line => line[0] !== undefined);
}

let c = GetCountries("./DB/IP2LOCATION-LITE-DB1.CSV");
c.forEach(c => console.log(c[0] + " - " + c[1]));
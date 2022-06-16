let fs = require('fs');

function IpNumberTo8BitsSegments(ipNumber) {
    let binaryIP = Number(ipNumber).toString(2);
    let binary32digitsIp = binaryIP.padStart(32, '0');
    let segments8bits = binary32digitsIp.match(/.{1,8}/g);
    return segments8bits.map(segment => parseInt(segment, 2)).join(".");
}

function ScriptGenerator(PORTS, COUNTRY_CODES, ipListPath, cb) {
    console.log(PORTS, COUNTRY_CODES);
    let result = "";

    function AppendOutput(output) {
        result += output + "\r\n";
    }
    const chainName = "COUNTRIES_WHITELIST_" + PORTS.join("_") + "_" + COUNTRY_CODES.join("_");
    let ipranges = fs.readFileSync(ipListPath, "utf8")
        .split("\r\n").map(line => {
            let [min, max, code, name] = line.replaceAll('"', '').split(",");
            return [IpNumberTo8BitsSegments(min), IpNumberTo8BitsSegments(max), code, name];
        })
        .filter(line => COUNTRY_CODES.includes(line[2]));

    AppendOutput(`iptables -N ${chainName};`);
    AppendOutput(ipranges.map(r => `iptables -A ${chainName} -m iprange --src-range ${r[0]}-${r[1]} -j ACCEPT;`).join("\r\n"));
    AppendOutput(`iptables -A ${chainName} -j RETURN`);
    AppendOutput(`iptables -A INPUT -p tcp -m multiport --dports ${PORTS.join(",")} -j ${chainName};`);
    AppendOutput(`# add other COUNTRIES_WHITELIST matching ports chains here`);
    AppendOutput(`# add your other matching ports rules here`);
    AppendOutput(`# dont forget to give your user access to the ports you want to allow [ssh, http, https, etc]`);
    AppendOutput(`iptables -A INPUT -p tcp -m multiport --dports ${PORTS.join(",")} -j DROP;`);
    cb(result);
}

module.exports = ScriptGenerator;
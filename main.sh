#!/bin/bash

# wget https://download.ip2location.com/lite/IP2LOCATION-LITE-DB1.CSV.ZIP ; # download the database if you don't have it
# unzip IP2LOCATION-LITE-DB1.CSV.ZIP -d "./DB"; # unzip the database to the DB directory
# rm IP2LOCATION-LITE-DB1.CSV.ZIP ; # remove the zip file after unzipping
cat DB/IP2LOCATION-LITE-DB1.CSV | # read the database file and print the country code and country name and the ip range address
grep "US" | # filter only the US country code
./CONVERT_NUMBER_2_IP.JS | # convert the number to ip address
node GETIPTABLESRULES.js 80,443 ACCEPT # add the ip address rangesof EC to the iptables rules
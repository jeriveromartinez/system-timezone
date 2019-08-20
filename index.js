#!/usr/bin/env node

/***

- this currently only works on *NIX machines (no windows support)

***/

const fs = require('fs');
const crypto = require('crypto');
const glob = require("glob");

const trimFile = function (string) {
    string = string.toString();
    string = string.replace(/\r/g, '');
    string = string.replace(/\n/g, '');
    return string;
};

const timezone = function () {
    if (process.env.TZ) return process.env.TZ;
    else if (fs.existsSync('/etc/timezone')) return trimFile(fs.readFileSync('/etc/timezone'));
    else if (fs.lstatSync('/etc/localtime').isSymbolicLink()) {
        const string = fs.readlinkSync('/etc/localtime').replace('/usr/share/zoneinfo/', '');
        return trimFile(string);
    } else {
        const md5sum = crypto.createHash('md5').update(fs.readFileSync('/etc/localtime'));
        const sourceMd5 = md5sum.digest('hex');
        const files = glob.sync('/usr/share/zoneinfo/**/*');
        for (const file of files) {
            if (fs.statSync(file).isFile()) {
                const localMd5Sum = crypto.createHash('md5').update(fs.readFileSync(file));
                const localMd5 = localMd5Sum.digest('hex');
                if (localMd5 === sourceMd5) return trimFile(file.replace('/usr/share/zoneinfo/', ''));
            }
        }
    }

    throw new Error('Unavailable show system timezone.');
};

module.exports = timezone;

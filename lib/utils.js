// copied from http://www.broofa.com/Tools/Math.uuid.js
var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

exports.uuid = function () {
    var chars = CHARS, uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
        if (i==8 || i==13 ||  i==18 || i==23) {
            uuid[i] = '-';
        } 
        else if (i==14) {
            uuid[i] = '4';
        }
        else {
            if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
    }
    return uuid.join('');
};

var isEqualObj = exports.isEqualObj = function(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length) return false;

    for (var prop in a) {
        if (a[prop] !== b[prop])
            return false;
    }

    return true;
}

exports.isEqual = function(a, b) {
    if (a.length !== b.length) return false;
    if (a.length === 0) return true;

    return a.every(function(rowA) {
        var rowFound = b.some(function(rowB) {
            return isEqualObj(rowA, rowB);
        });
        return rowFound;
    });
}
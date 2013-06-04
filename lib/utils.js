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
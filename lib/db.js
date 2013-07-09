var mysql      = require('mysql');
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : process.env['DBUSER'],
    password: process.env['DBPASSWORD'],
    database: process.env['DBNAME']
});

exports.query = function(query, values, cb) {
    // console.log('DB: connect_time');
    // console.log('DB: query_time');
    if (!cb) {
        cb = values;
        values = null;
    }

    connection.query(query, values, function (err, rows, fields) {
        if (err) return cb(err);
        return cb(null, rows, fields);
    });
};
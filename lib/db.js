var mysql      = require('mysql');
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : process.env['DBUSER'],
    password: process.env['DBPASSWORD'],
    database: process.env['DBNAME']
});

exports.query = function(query, cb) {
    // console.log('DB: connect_time');
    // console.log('DB: query_time');

    connection.query(query, function(err, rows, fields) {
        if (err) return cb(err);
        return cb(null, rows, fields);
    });
};
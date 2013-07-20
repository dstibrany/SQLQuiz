var mysql      = require('mysql');
var connection = mysql.createConnection({
    host:    'localhost',
    user:     process.env['DBUSER'],
    password: process.env['DBPASSWORD'],
    database: process.env['DBNAME']
});

// TODO: possibly use connection pool
exports.query = function(query, values, cb) {
    // console.log('DB: connect_time');
    // console.log('DB: query_time');
    if (!cb) {
        cb = values;
        values = null;
    }

    connection.query(query, values, cb);
};
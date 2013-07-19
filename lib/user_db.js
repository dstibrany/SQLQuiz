var fs      = require('fs');
var sqlite3 = require('sqlite3').verbose();
var ps_path = 'lib/sql/problem_sets';

function User_DB(ps_id) {
    // TODO: deal with errors on open
    this.db = new sqlite3.Database(''); // create anonymous file
    this.ps_id = ps_id;
};

User_DB.prototype.load = function(cb) {
    var self = this;
    fs.readFile(ps_path + '/problem_set_' + self.ps_id + '.sql', function (err, sql) {
        if (err) return cb(err);
        self.db.serialize(function() {
            self.db.exec(sql.toString(), function (err) {
                if (err) return cb(err);
                cb(null);
            });
        });
    });   
};

User_DB.prototype.query = function(sql, cb) {
    this.db.all(sql, cb);
};

module.exports = User_DB;


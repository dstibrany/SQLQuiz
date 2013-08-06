var fs      = require('fs');
fs.readdirSync('env').forEach(function (file) {
    process.env[file] = fs.readFileSync('env/' + file).toString();
});

var util    = require('util');
var express = require('express');
var async   = require('async');
var app     = express();
var db      = require(__dirname +'/lib/app_db');
var User_DB = require(__dirname +'/lib/user_db');
var utils   = require(__dirname + '/lib/utils');

// Middleware
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(__dirname + '/public/app'));

var user_db_map = {};

function error_handler(err, res) {
    if (err.userError) {
        res.json({ user_error: err.message });
    } else {
        res.statusCode = 500;
        console.log('INTERNAL ERROR: ', err.stack);
        res.json({ internal_error: 'Database error' });
    }
}

function destroy_user_db(req, uuid) {
    var old_db = user_db_map[uuid];
    if (old_db) {
        old_db.close();
        delete user_db_map[req.cookies.uuid];
    }
}

// Routes
app.post('/api/checkAnswer/:questionid', function (req, res) {
    var uuid = req.cookies && req.cookies.uuid;
    var user_db = user_db_map[uuid];
    if (!user_db) return res.send(500);

    async.parallel([
        function (cb) {
            user_db.query(req.body.realAnswer, function (err, rows) {
                if (err) return cb(err);
                cb(null, rows);
            });
        },
        function (cb) {
            user_db.query(req.body.userAnswer, function (err, rows) {
                if (err) {
                    err.userError = true;
                    return cb(err);
                }
                    
                cb(null, rows);
            });
        }
    ], 
    function (err, results) {
        if (err) return error_handler(err, res);
        var out = {
            correctResults: results[0],
            userResults:    results[1],
        };

        if (utils.isEqual(results[0], results[1])) {
            out.correct = true;
        } else {
            out.correct = false;
        }

        res.json(out);
    });
});

// get problem sets
app.get('/api/problem_set', function (req, res) {
    db.query('SELECT * FROM problem_sets', function (err, rows) {
        if (err) return error_handler(err, res);
        res.json(rows);
    });
});

// load problem set
app.get('/api/problem_set/:id', function (req, res) {
    if (req.cookies && req.cookies.uuid) {
        destroy_user_db(req, req.cookies.uuid);
    }

    var uuid    = utils.uuid();
    var user_db = new User_DB(req.params.id);
    
    user_db_map[uuid] = user_db;

    user_db.load(function (err) {
        if (err) return error_handler(err, res);
        res.cookie('uuid', uuid);
        res.send(200);
    });
});

// questions
app.get('/api/problem_set/:id/questions', function (req, res) {
    var sql = 'SELECT questions.*\
               FROM problem_sets JOIN questions\
               ON problem_sets.id = Questions.problem_set_id\
               AND problem_sets.id = ?';

    db.query(sql, [req.params.id], function (err, rows) {
        if (err) return error_handler(err, res);
        res.json(rows);
    });
});

// relations
app.get('/api/problem_set/:id/relations', function (req, res) {
    var uuid = req.cookies && req.cookies.uuid;
    if (!uuid) res.send(500);
    
    var user_db = user_db_map[uuid];
    var out = [];

    var get_tables = 'SELECT name FROM sqlite_master WHERE type="table" ORDER BY name';
    user_db.query(get_tables, function (err, tables) {
        if (err) return error_handler(err, res);
        async.each(tables, function (table, outer_cb) {
            out[table.name] = {};
            async.parallel([
                function (inner_cb) {
                    user_db.query('PRAGMA foreign_key_list(' + table.name + ')', function (err, fk_rows) {
                        if (err) return inner_cb(err);
                        inner_cb(null, fk_rows);
                    });
                },
                function (inner_cb) {
                    user_db.query('PRAGMA table_info(' + table.name + ')', function (err, table_columns) {
                        if (err) return inner_cb(err);
                        inner_cb(null, table_columns);
                    });
                },
            ], 
            function (err, results) {
                if (err) return outer_cb(err);
                var fks     = results[0];
                var columns = results[1];

                // use a hash to speed things up
                var columns_hash_table = {};
                columns.forEach(function (column) {
                    columns_hash_table[column.name] = column;
                });

                // add foreign key object to respective column
                fks.forEach(function (fk) {
                    columns_hash_table[fk.from]['fk'] = fk; 
                });

                out.push({
                    table_name:   table.name,
                    columns:      columns
                });

                outer_cb(null);
            });
        
        }, function (err) {
            if (err) return error_handler(err, res);
            res.json(out);
        });
    });
});

app.listen(8999, function() {
    console.log('Listening on http://localhost:8999');
});


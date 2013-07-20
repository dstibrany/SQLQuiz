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
        console.log('INTERNAL ERROR: ', err);
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
app.post('/checkAnswer/:questionid', function (req, res) {
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

app.get('/modules', function (req, res) {
    db.query('SELECT * FROM Modules', function (err, rows) {
        if (err) return error_handler(err, res);
        res.json(rows);
    });
});

app.get('/module/:id', function (req, res) {
    if (req.cookies && req.cookies.uuid) {
        destroy_user_db(req, req.cookies.uuid);
    }

    var uuid = utils.uuid();
    var user_db = new User_DB(req.params.id);
    
    user_db_map[uuid] = user_db;

    user_db.load(function (err) {
        if (err) return error_handler(err, res);
        res.cookie('uuid', uuid);
        res.send(200);
    });
});

app.get('/modules/:id/questions', function (req, res) {
    var sql = 'SELECT Questions.*\
               FROM Modules JOIN Questions\
               ON Modules.id = Questions.module_id\
               AND Modules.id = ?';

    db.query(sql, [req.params.id], function (err, rows) {
        if (err) return error_handler(err, res);
        res.json(rows);
    });
});

app.get('/modules/:id/relations', function (req, res) {
    var out = [];
    var sql = 'SELECT relations.name\
               FROM relationmodulemap JOIN relations\
               ON relationmodulemap.relation_id = relations.id\
               WHERE relationmodulemap.module_id = ?';

    db.query(sql, [req.params.id], function (err, rows) {
        if (err) return error_handler(err, res);
        async.forEach(rows, function (row, cb) {
            db.query('describe ' + row.name, function (err, inner_rows) {
                if (err) return cb(err);
                var relation = {};
                inner_rows.forEach(function (inner_row) {
                    relation[inner_row.Field] = {
                        key: inner_row.Key === 'MUL' ? 'FK' : inner_row.Key
                    };
                });
                relation['__name__'] = row.name;
                out.push(relation)
                cb(null);
            });        
        }, function (err) {
            if (err) return error_handler(err, res);
            res.json(out);
        })
    });
});

app.listen(8999, function() {
    console.log('Listening on port 8999');
});


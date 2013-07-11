var fs      = require('fs');
fs.readdirSync('env').forEach(function(file) {
    process.env[file] = fs.readFileSync('env/' + file).toString();
});
var util    = require('util');
var express = require('express');
var async   = require('async');
var app     = express();
var db      = require(__dirname +'/lib/db');
var utils   = require(__dirname + '/lib/utils');

// Middleware
app.use(express.logger());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/public/app'));

function error_handler(err, res, next) {
    if (err.fatal) return next(err);
    else return res.end(err.toString());
}

// Routes
app.post('/checkAnswer/:questionid', function (req, res, next) {
    async.parallel([
        function (cb) {
            db.query(req.body.realAnswer, function (err, rows) {
                if (err) return cb(err);
                cb(null, rows);
            });
        },
        function (cb) {
            db.query(req.body.userAnswer, function (err, rows) {
                if (err) return cb(err);
                cb(null, rows);
            });
        }
    ], 
    function (err, results) {
        if (err) return error_handler(err, res, next);
        if (utils.isEqual(results[0], results[1])) {
            res.end('Correct!')
        } else {
            res.end('Incorrect');
        }
    });
    


    db.query(req.body.userAnswer)
});

app.get('/modules', function (req, res) {
    db.query('SELECT * FROM Modules', function (err, rows) {
        if (err) throw err;
        res.json(rows);
    });
});

app.get('/modules/:id/questions', function (req, res) {
    var sql = 'SELECT Questions.*\
               FROM Modules JOIN Questions\
               ON Modules.id = Questions.module_id\
               AND Modules.id = ?';

    db.query(sql, [req.params.id], function (err, rows) {
        if (err) throw err;
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
        if (err) throw err;
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
            if (err) throw err;
            res.json(out);
        })
    });
});

app.listen(8999, function() {
    console.log('Listening on port 8999');
});

// Show question on page
// take user input
// process user input as SQL
// check if answer is correct
// if incorrect, display an error
// get next question
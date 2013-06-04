var fs      = require('fs');
fs.readdirSync('env').forEach(function(file) {
    process.env[file] = fs.readFileSync('env/' + file).toString();
});
var util    = require('util');
var express = require('express');
var app     = express();
var db      = require(__dirname +'/lib/db');
var utils   = require(__dirname + '/lib/utils');

// Middleware
app.use(express.logger());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

var correct_results;

// Routes
app.get('/', function(req, res, next) {
    var correct_query = "SELECT * FROM departments;"
    db.query(next, correct_query, function(err, rows) {
        correct_results = rows;
        res.redirect('/index.html');
        console.log(correct_results);
    });
});

app.post('/', function(req, res, next) {
    var query = req.body.query;
    db.query(next, query, function(err, rows) {
        if (err) return res.end(err.toString());
        if (utils.isEqual(correct_results, rows)) {
            res.end('Correct!')
        } else {
            res.end('Incorrect');
        }
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
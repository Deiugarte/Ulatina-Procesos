"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var path = require("path");
var app = express();
var PORT = process.env.PORT || 3000;
var NODE_ENV = process.env.NODE_ENV || 'development';
app.set('port', PORT);
app.set('env', NODE_ENV);
app.use(logger('tiny'));
app.use(bodyParser.json());
app.use('/', require(path.join(__dirname, 'routes')));
app.use(function (req, res, next) {
    var err = new Error(req.method + " " + req.url + " Not Found");
    err.name = '404';
    next(err);
});
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});
app.listen(PORT, function () {
    console.log("Express Server started on Port " + app.get('port') + " | Environment : " + app.get('env'));
});

"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
function getMedications(req, res) {
    try {
        var data = fs.readFileSync(path.join(__dirname, './stats.json'));
        var stats = JSON.parse(data.toString());
        var playerStats = stats.find(function (player) { return player.id === Number(req.params.id); });
        res.json(playerStats);
    }
    catch (e) {
        //next(e);
    }
}
exports.getMedications = getMedications;

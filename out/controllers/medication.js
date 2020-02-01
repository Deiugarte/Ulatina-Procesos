"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function getMedications(req, res) {
    try {
        const data = fs.readFileSync(path.join(__dirname, './stats.json'));
        const stats = JSON.parse(data.toString());
        const playerStats = stats.find((player) => player.id === Number(req.params.id));
        res.json({});
    }
    catch (e) {
        res.sendStatus(500);
    }
}
exports.getMedications = getMedications;
//# sourceMappingURL=medication.js.map
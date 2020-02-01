"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const medicationsFilePath = path.join(__dirname, './medications.json');
function getMedications(req, res) {
    try {
        const data = fs.readFileSync(medicationsFilePath);
        const medications = JSON.parse(data.toString());
        //const filterMedications = medications.find((medication) => medication.name === req.params.name);
        res.sendStatus(201).send(medications);
    }
    catch (e) {
        res.sendStatus(404);
    }
}
function createMedication(req, res, next) {
    try {
        const data = fs.readFileSync(medicationsFilePath);
        const medications = JSON.parse(data.toString());
        const newMedications = {
            name: req.body.name,
            frecuency: req.body.frecuency,
            maxAmount: req.body.maxAmount,
            minAmount: req.body.minAmount,
        };
        medications.push(newMedications);
        fs.writeFileSync(medicationsFilePath, JSON.stringify(medications));
        res.status(201).json(newMedications);
    }
    catch (e) {
        res.sendStatus(500);
        next(e);
    }
}
;
router
    .route('/api/v1/medications')
    .get(getMedications)
    .post(createMedication);
module.exports = router;
//# sourceMappingURL=routes.js.map
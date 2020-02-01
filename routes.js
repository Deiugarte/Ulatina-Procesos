"use strict";
exports.__esModule = true;
var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");
var medicationsFilePath = path.join(__dirname, './medications.json');
var prescriptionsFilePath = path.join(__dirname, './prescriptions.json');
function getMedications(req, res) {
    try {
        var medications = readMedications();
        res.json(medications);
    }
    catch (e) {
        res.sendStatus(404);
    }
}
function createMedication(req, res, next) {
    try {
        var medications = readMedications();
        var newMedications = {
            name: req.body.name,
            frecuency: req.body.frecuency,
            maxAmount: req.body.maxAmount,
            minAmount: req.body.minAmount
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
function getPrescriptions(req, res) {
    try {
        var prescriptions = readPrescriptions();
        res.json(prescriptions);
    }
    catch (e) {
        res.sendStatus(404);
    }
}
function createPrescriptions(req, res, next) {
    try {
        var prescriptions = readPrescriptions();
        var newPrescription = {
            name: req.body.name,
            frecuency: req.body.frecuency,
            amount: req.body.amount,
            patient: req.body.patient
        };
        var validations = validateRestrictions(newPrescription);
        if (validations.valid) {
            prescriptions.push(newPrescription);
            fs.writeFileSync(prescriptionsFilePath, JSON.stringify(prescriptions));
            res.status(201).json(newPrescription);
        }
        else {
            res.status(406).send(validations.message);
        }
    }
    catch (e) {
        res.sendStatus(500);
        next(e);
    }
}
router
    .route('/api/v1/medications')
    .get(getMedications)
    .post(createMedication);
router
    .route('/api/v1/prescriptions')
    .get(getPrescriptions)
    .post(createPrescriptions);
module.exports = router;
function readMedications() {
    var data = fs.readFileSync(medicationsFilePath);
    var medications = JSON.parse(data.toString());
    return medications;
}
function readPrescriptions() {
    var data = fs.readFileSync(prescriptionsFilePath);
    var prescriptions = JSON.parse(data.toString());
    return prescriptions;
}
function validateRestrictions(prescription) {
    var validation = { valid: true, message: '' };
    var medications = readMedications();
    var medicationSpecifications = medications.find(function (md) { return md.name === prescription.name; });
    if (!medicationSpecifications) {
        validation.message = 'Medications not found';
        validation.valid = false;
    }
    else {
        if (prescription.frecuency > medicationSpecifications.frecuency) {
            validation.message = 'Frecuency is higher than permitted';
            validation.valid = false;
        }
        if (prescription.amount > medicationSpecifications.maxAmount) {
            validation.message = 'Amount is higher than permitted';
            validation.valid = false;
        }
        if (prescription.amount < medicationSpecifications.minAmount) {
            validation.message = 'Amount is less than permitted';
            validation.valid = false;
        }
    }
    return validation;
}

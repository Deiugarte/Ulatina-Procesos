const express = require('express')
const router = express.Router()
import * as fs from 'fs'
import * as path from 'path'
import { resolve } from 'dns'

const medicationsFilePath = path.join(__dirname, './medications.json')
const prescriptionsFilePath = path.join(__dirname, './prescriptions.json')

function getMedications(req: any, res: any) {
  try {
    const medications = readMedications()
    res.json(medications)
  } catch (e) {
    res.sendStatus(404)
  }
}

function createMedication(req, res, next) {
  try {
    const medications = readMedications()
    const newMedications = {
      name: req.body.name,
      frecuency: req.body.frecuency,
      maxAmount: req.body.maxAmount,
      minAmount: req.body.minAmount
    }
    medications.push(newMedications)
    fs.writeFileSync(medicationsFilePath, JSON.stringify(medications))
    res.status(201).json(newMedications)
  } catch (e) {
    res.sendStatus(500)
    next(e)
  }
}

function getPrescriptions(req: any, res: any) {
  try {
    const prescriptions = readPrescriptions()
    res.json(prescriptions)
  } catch (e) {
    res.sendStatus(404)
  }
}

function createPrescriptions(req, res, next) {
  try {
    const prescriptions = readPrescriptions()
    const newPrescription = {
      name: req.body.name,
      frecuency: req.body.frecuency,
      amount: req.body.amount,
      patient: req.body.patient
    }
    const validations = validateRestrictions(newPrescription);
    if (validations.valid) {
      prescriptions.push(newPrescription);
      fs.writeFileSync(prescriptionsFilePath, JSON.stringify(prescriptions));
      res.status(201).json(newPrescription);
    } else {
      res.status(406).send(validations.message);
    }
   
  } catch (e) {
    res.sendStatus(500)
    next(e)
  }
}

router
  .route('/api/v1/medications')
  .get(getMedications)
  .post(createMedication)

router
  .route('/api/v1/prescriptions')
  .get(getPrescriptions)
  .post(createPrescriptions)

module.exports = router

function readMedications() {
  const data = fs.readFileSync(medicationsFilePath)
  const medications = JSON.parse(data.toString())
  return medications
}

function readPrescriptions() {
  const data = fs.readFileSync(prescriptionsFilePath)
  const prescriptions = JSON.parse(data.toString())
  return prescriptions
}

function validateRestrictions (prescription): {valid: boolean, message: string}{
  let validation = {valid: true, message: ''}
  const medications = readMedications()
  const medicationSpecifications = medications.find(md => md.name === prescription.name)
  if (!medicationSpecifications) {
    validation.message = 'Medications not found';
    validation.valid = false;
  } else {
    if (prescription.frecuency > medicationSpecifications.frecuency) {
      validation.message = 'Frecuency is higher than permitted';
      validation.valid = false;
    } if (prescription.amount > medicationSpecifications.maxAmount) {
      validation.message = 'Amount is higher than permitted';
      validation.valid = false;
    } if (prescription.amount < medicationSpecifications.minAmount) {
      validation.message = 'Amount is less than permitted';
      validation.valid = false;
    }
  }
  return validation;
}

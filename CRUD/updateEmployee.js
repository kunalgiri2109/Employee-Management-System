// const { db, bcrypt, router } = require('../common/commonFile');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const knex = require('knex');
const config = require('../db/knexfile');
const jwt = require('jsonwebtoken');
const db = knex(require('../db/knexfile').development);
const { validations } = require('../Validations_CheckFields/validations');
const { checkFields } = require('../Validations_CheckFields/checkFields');

router.put('/employee/:employeeId', async (req, res) => {
    const employeeId = req.params.employeeId.trim();
    const updatedDetails = req.body;
    if (employeeId === '') {
      return res.status(400).json({ message: 'Employee ID cannot be empty' });
    }
    if (isNaN(employeeId) || employeeId > Number.MAX_SAFE_INTEGER) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }
    else {
        if(employeeId > Number.MAX_SAFE_INTEGER) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }
    }
    try {
      const existingEmployee = await db('employees').where('id', employeeId).first();
  
      if (!existingEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      let missingFields = [];
      missingFields = checkFields(updatedDetails);
      if(missingFields.length > 0) {
          return res.status(400).json({ error: `Missing required fields :  ${missingFields.join(', ')}` });
      }
      const validationError = validations(updatedDetails);
      console.log('errors :', validationError)

      if(Object.keys(validationError).length !== 0) {
        return res.status(400).json( {validationError});
      }
      const hashedPassword = await bcrypt.hash(updatedDetails.password, 10);
      await db('employees').where('id', employeeId).update({
        first_name: updatedDetails.firstName,
        last_name: updatedDetails.lastName,
        username: updatedDetails.username,
        password: hashedPassword,
        date_of_joining: updatedDetails.dateOfJoining,
        address: updatedDetails.address,
        email: updatedDetails.email,
        is_permanent: !!updatedDetails.isPermanent,
        department_name: updatedDetails.department,});

      const updatedEmployee = await db('employees').where('id', employeeId).first();
      res.json({ message: 'Employee details updated successfully', updatedEmployee });
    }
    catch (error) {
      console.error('Error updating employee details:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  module.exports = router;
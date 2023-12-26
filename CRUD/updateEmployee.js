// const { db, bcrypt, router } = require('../common/commonFile');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const knex = require('knex');
const config = require('../db/knexfile');
const jwt = require('jsonwebtoken');
const elastic = require('../elasticSearch');
const db = knex(require('../db/knexfile').development);
const { validations } = require('../Validations_CheckFields/validations');
const { checkFields } = require('../Validations_CheckFields/checkFields');
const { authenticateUser } = require('../authenticationMiddleware/authentication');
const { ADMIN_EMPLOYEE_MANAGEMENT_SYSTEM } = require('../authenticationMiddleware/authAdmin');

router.put('/:employeeId', authenticateUser, async (req, res) => {
    const employeeId = req.params.employeeId.trim();
    const updatedDetails = req.body;
    if (employeeId === '') {
      return res.status(400).json({ "Entry Error ": 'Employee ID cannot be empty' });
    }
    if (isNaN(employeeId) || employeeId > Number.MAX_SAFE_INTEGER) {
      return res.status(400).json({ "Validation message": 'Invalid employee ID' });
    }
    try {
      if( req.user.username.email !== ADMIN_EMPLOYEE_MANAGEMENT_SYSTEM) {
        return res.status(401).json({ ' Authorization Error ': ' You are not Admin' });
      }
      const existingEmployee = await db('employees').where('id', employeeId).first();
  
      if (!existingEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      // let errorLog = [];
      // let missingFields = [];
    //   missingFields = checkFields(req.body);
     
    //  if (missingFields.length > 0) {
    //     errorLog.push({ "Missing Fields " : missingFields });
      // }
      // const errors = validations(req.body);
      // if(Object.keys(errors).length !== 0 || missingFields.length > 0) {
      //   errorLog.push(errors);
      //   return res.status(400).json( {errorLog});
      // }
      const existingUser = await db('employees').where('email', req.body.email.toLowerCase());
      if (existingUser.length > 0) {
        return res.status(400).json({ " Validation Error " : 'Employee already registered with this email' });
      }

      
      await db('employees').where('id', employeeId).update(updatedDetails);

      const updatedEmployee = await db('employees').where('id', employeeId).first();
      const filteredEmployee = { ...updatedEmployee, password: undefined };
      
      console.log(updatedDetails);
      await elastic.update({
        index: 'employees',
        id: employeeId,
        body : {
          doc : updatedDetails
        }
      });

      res.json({ "Success Message " : 'Employee details updated successfully',
                 "Updated Employee Details " : filteredEmployee 
        });
    }
    catch (error) {
      console.error('Error updating employee details:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  module.exports = router;
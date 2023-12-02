// const { bcrypt, db, router } = require('../common/commonFile');
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
const { getFormattedDateTime } = require('../formatDateTime/getFormattedDateTime');

const { generateAccessToken } = require('../authenticationMiddleware/authService');
const { error } = require('console');

router.post('/', async (req, res) => {
    let {
      employeeId, firstName, lastName, fullname, password, dateOfJoining, address, email, isPermanent, department,
    } = req.body;
    let errorLog = [];
    let missingFields = [];
    missingFields = checkFields(req.body);
    if(missingFields.length > 0) {
      errorLog.push({ error: missingFields });
    }
    const validationError = validations(req.body);

    if(Object.keys(validationError).length !== 0) {
      errorLog.push(validationError);
      return res.status(400).json( {errorLog});
    }
  console.log(typeof employeeId);
  const existingUser = await db('employees').where('email', email);
  if (existingUser.length > 0) {
      return res.status(400).json({ " Updation Error " : 'Employee already registered with this email' });
    
  }
  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.transaction(async (trx) => {
      if(employeeId !== undefined) {
        
        await db('employees').where('id', employeeId).update({
          first_name: firstName,
          last_name: lastName,
          fullname: fullname,
          password: hashedPassword,
          date_of_joining: dateOfJoining,
          address: address,
          email: email,
          is_permanent: !!isPermanent,
          department_name: department,
        });
        const user = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          fullname: req.body.fullname,
          dateOfJoining: req.body.dateOfJoining,
          address: req.body.address,
          email: req.body.email,
          isPermanent: req.body.isPermanent,
          department: req.body.department,
          "created_at" : getFormattedDateTime(),
          "updated_at" : getFormattedDateTime()
        };
        res.status(200).json({ "Success message": 'Upsert successful.', user});
      }
      
      else {
        console.log("entering insert block");
        await db('employees').insert({
          first_name: firstName,
          last_name: lastName,
          fullname: fullname,
          password: hashedPassword,
          date_of_joining: dateOfJoining,
          address: address,
          email: email,
          is_permanent: !!isPermanent,
          department_name: department,
        });
        const user = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          fullname: req.body.fullname,
          dateOfJoining: req.body.dateOfJoining,
          address: req.body.address,
          email: req.body.email,
          isPermanent: req.body.isPermanent,
          department: req.body.department,
          "created_at" : getFormattedDateTime(),
          "updated_at" : getFormattedDateTime()
        };
        const token = generateAccessToken(user);
        password = undefined
        fullname = (firstName + lastName).toLowerCase();
        res.status(200).json({ "Success message": 'Inserted successfully', token, user });
      
    }
    await trx.commit();
    });
  }
  catch (error) {
    console.error('Error during upsert:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;

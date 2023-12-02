// register.js
const express = require('express');
const router = express.Router();
const knex = require('knex');
const bcrypt = require('bcrypt');
const db = knex(require('../db/knexfile').development);

const { generateAccessToken } = require('../authenticationMiddleware/authService');
require('dotenv').config();
const { validations } = require('../Validations_CheckFields/validations');
const { checkFields } = require('../Validations_CheckFields/checkFields');
const { getFormattedDateTime } = require('../formatDateTime/getFormattedDateTime');

router.post('/', async (req, res) => {
    try {
      let errorLog = [];
      let missingFields = [];
      missingFields = checkFields(req.body);
     
     if (missingFields.length > 0) {
        errorLog.push({ "Missing Fields " : missingFields });
      }
      const errors = validations(req.body);
      if(Object.keys(errors).length !== 0 || missingFields.length > 0) {
        errorLog.push(errors);
        return res.status(400).json( {errorLog});
      }
      const existingUser = await db('employees').where('email', req.body.email.toLowerCase());
      if (existingUser.length > 0) {
        return res.status(400).json({ " Validation Error " : 'Employee already registered with this email' });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
      const newUser = await db('employees').insert({
              first_name: req.body.firstName.toLowerCase(),
              last_name: req.body.lastName.toLowerCase(),
              fullname : req.body.fullname.toLowerCase(),
              password: hashedPassword,
              date_of_joining: req.body.dateOfJoining,
              address : req.body.address,
              email : req.body.email.toLowerCase(),
              is_permanent: !!req.body.isPermanent,
              department_name: req.body.department,
            });
            const userDetails = {
              "fullname": req.body.fullname.toLowerCase(),
              "email" : req.body.email.toLowerCase(),
              "date of joining" : req.body.dateOfJoining,
              "address" : req.body.address,
              "isPermanent": !! req.body.isPermanent,
              "department": req.body.department,
              "created_at" : getFormattedDateTime(),
              "updated_at" : getFormattedDateTime()
            }
        const token = generateAccessToken(newUser);
        res.status(200).json({ 
          " Success Message ": 'Registration successful',
          "token" : token,
          "User Details" : userDetails
         });
      } 
      catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
      }
  });

  module.exports = router;
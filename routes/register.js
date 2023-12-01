// register.js
const express = require('express');
const router = express.Router();
const path = require('path');
const knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = knex(require('../db/knexfile').development);

const { generateAccessToken } = require('../authService');
require('dotenv').config();
const { insertUser } = require('../CRUD/insert');
const { validations } = require('../Validations_CheckFields/validations');

router.post('/', async (req, res) => {
      
    try {
      let {
        firstName, lastName, username, password, confirmPassword, dateOfJoining, address, email, isPermanent, department,
      } = req.body;
      let errorLog = [];
     const missingFields = [];
     if (!firstName) missingFields.push('firstName');
     if (!username) missingFields.push('username');
     if (!password) missingFields.push('password');
     if (!confirmPassword) missingFields.push('confirmPassword');
     if (!dateOfJoining) missingFields.push('dateOfJoining');
     if (!address) missingFields.push('address');
     if (!email) missingFields.push('email');
    //  if (!isPermanent) missingFields.push('isPermanent');
     if (!department) missingFields.push('department');
     
     if (missingFields.length > 0) {
        errorLog.push({ error: missingFields });
      }
    const errors = validations(req.body);
    if(Object.keys(errors).length !== 0) {
      errorLog.push(errors);
      return res.status(400).json( {errorLog});
    }
    const existingUser = await db('employees').where('email', email);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Employee already registered with this email' });
      }
      username = (firstName + lastName).toLowerCase();
      const hashedPassword = await bcrypt.hash(password, 10);
      await insertUser({
        firstName,
        lastName,
        username,
        password: hashedPassword,
        dateOfJoining,
        address,
        email,
        isPermanent,
        department,
      });
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        dateOfJoining: req.body.dateOfJoining,
        address: req.body.address,
        email: req.body.email,
        isPermanent: req.body.isPermanent,
        department: req.body.department,
      };
        const token = generateAccessToken(user);
        user.password = undefined
        user.username = (user.firstName + user.lastName).toLowerCase();
        console.log(user.username)
        res.status(200).json({ token, user, message: 'Registration successful' });
      } 
      catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
      }
  });

  module.exports = router;
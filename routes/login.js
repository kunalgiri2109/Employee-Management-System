//login.js

const express = require('express');
const router = express.Router();
const path = require('path');
const knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

const { generateAccessToken } = require('../authenticationMiddleware/authService');
const { getFormattedDateTime } = require('../formatDateTime/getFormattedDateTime');

const db = knex(require('../db/knexfile').development);
require('dotenv').config();

router.post('/', async (req, res) => {
    let { email, password } = req.body;
    try {
      let errorLog = [];
      let missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');

      if (missingFields.length > 0) {
        errorLog.push({ "Missing Fields " : missingFields });
      }
      else {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
          errorLog.push({ "Validation message " : 'Invalid email' });
        }
        if (!password || typeof password != 'string') {
          errorLog.push({ "Validation message " : 'Invalid password' });
        }
    }
    if(errorLog.length !== 0) {
      return res.status(400).json( {errorLog});
    }
      const user = await db('employees').where('email', email.trim().toLowerCase()).first();
      if (!user) {
        return res.status(404).json({ " Validation Error" : 'No user found ' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      
    if (!passwordMatch) {
      return res.status(401).json({ "Validation message " : 'Invalid password' });
    }
    const userDetails = {
      "id" : user.id,
      "fullname": user.fullname.toLowerCase(),
      "email" : user.email.toLowerCase(),
      "date of joining" : user.dateOfJoining,
      "address" : user.address,
      "isPermanent": !! user.isPermanent,
      "department": user.department,
      "created_at" : getFormattedDateTime(),
      "updated_at" : getFormattedDateTime()
    }
    const token = generateAccessToken(userDetails);
      res.status(200).json({ 
        " Success Message ": 'Login successful',
          "token" : token,
          "User Details" : userDetails
         });
    }
    catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
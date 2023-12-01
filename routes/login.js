//login.js

const express = require('express');
const router = express.Router();
const path = require('path');
const knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

// const { bcrypt, db } = require('../common/commonFile');

const { generateAccessToken } = require('../authService');

const db = knex(require('../db/knexfile').development);
// const PORT = process.env.PORT || 8090;
require('dotenv').config();

console.log("login")
router.post('/', async (req, res) => {
    let { email, password } = req.body;
    // password = password.toString();
    // console.log(req.body);
    try {
        const missingFields = [];
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');

        if (missingFields.length > 0) {
        console.error('Missing fields:', missingFields);
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
      }
      // if (!username || typeof username !== 'string' || /\d/.test(username)) {
      //   return res.status(400).json({ error : 'Invalid username' });
      // }
      email = email.trim();
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }
      const user = await db('employees').where('email', email).first();
      if (!user) {
        return res.status(404).json({ error : 'No user found ' });
      }
      const hashedUserpassword = await bcrypt.hash(password, 10);
      
      console.log("req : ", hashedUserpassword);
      const passwordMatch = await bcrypt.compare(password, user.password);
      
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
      const userDetails = { userId: user.id, username: user.username };
      const token = generateAccessToken(userDetails);
      
      res.status(200).json({ token, userDetails, message: 'Login successful' });

    }
    catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

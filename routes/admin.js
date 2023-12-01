//admin.js

const express = require('express');
const router = express.Router();
const path = require('path');
const knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

const db = knex(require('../db/knexfile').development);
const PORT = process.env.PORT || 8090;
require('dotenv').config()


// working
router.get('/admin', (req, res) => {
  res.status(200).json({ message: 'On Admin Page' });
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;
  
    try {
        const missingFields = [];
        if (!username) missingFields.push('username');
        if (!password) missingFields.push('password');

        if (missingFields.length > 0) {
        console.error('Missing fields:', missingFields);
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
      }
      if (!username || typeof username !== 'string' || /\d/.test(username)) {
        return res.status(400).json({ error : 'Invalid username' });
      }
      if (username != 'kunalgiri') {
        return res.status(404).json({ error : 'You are not an admin' });
      }
      const user = await db('employees').where('username', username).first();
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: 'Password does not match' });
      }
      // const userDetails = { userId: user.id, username: user.username };
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3*24*60*60 });
      
      res.status(200).json({ token, message: 'Admin Login successful' });

    }
    catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

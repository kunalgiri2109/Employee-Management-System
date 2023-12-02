// server.js
const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = express.Router();
const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const bcrypt = require('bcrypt');

require('dotenv').config()

const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const getEmployee = require('./CRUD/getEmployeeDetails');
const getAllEmployees = require('./CRUD/getAllEmployees');
const deleteEmployee = require('./CRUD/deleteEmployee');
const upsert = require('./CRUD/upsert');
const updateEmployee = require('./CRUD/updateEmployee')

app.use(router);

app.use('/login', loginRoutes); // done
app.use('/register', registerRoutes); // done
app.use('/getEmployee', getEmployee); // done
app.use('/getAllEmployees', getAllEmployees); // done
app.use('/upsert', upsert); // done
app.use('/deleteEmployee', deleteEmployee); // done
app.use('/updateEmployee', updateEmployee); // done

const db = knex(require('./db/knexfile').development);

//query params
app.get('/queryParamEmployees', async (req, res) => {
  console.log("YESSS");
  try {
    const { username, department } = req.query;
    let query = knex.select('*').from('employees');
    if (username) {
      query = query.where('username', 'like', `%${username}%`);
    }
    if(department) {
      query = query.where('department', '=', department);
    }
    const filteredEmployees = await query;
    res.json(filteredEmployees);
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
function isValidEmail(email) {
  return typeof email === 'string' && email.includes('@');
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = router;
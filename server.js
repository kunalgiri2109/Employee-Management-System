// server.js
const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const path = require('path');
const router = express.Router();
const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('dotenv').config()

const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const getEmployee = require('./CRUD/getEmployeeDetails');
const getAllEmployees = require('./CRUD/getAllEmployees');
const deleteEmployee = require('./CRUD/deleteEmployee');
const upsert = require('./CRUD/upsert');
const updateEmployee = require('./CRUD/updateEmployee');
const queryParams = require('./queryParams/queryParams');
app.use(router);

app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/getEmployee', getEmployee); 
app.use('/getAllEmployees', getAllEmployees); 
app.use('/upsert', upsert); 
app.use('/deleteEmployee', deleteEmployee); 
app.use('/updateEmployee', updateEmployee); 
app.use('/employees', queryParams);

const db = knex(require('./db/knexfile').development);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = router;
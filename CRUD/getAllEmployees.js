
const express = require('express');
const knex = require('knex');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = knex(require('../db/knexfile').development);
const { authenticateUser } = require('../authenticationMiddleware/authentication');
const { ADMIN_EMPLOYEE_MANAGEMENT_SYSTEM } = require('../authenticationMiddleware/authAdmin');

router.get('/', authenticateUser,(req, res) => {
  console.log(ADMIN_EMPLOYEE_MANAGEMENT_SYSTEM)
  if( req.user.username.email !== ADMIN_EMPLOYEE_MANAGEMENT_SYSTEM) {
    return res.status(401).json({ 'Authorization Error ': ' You are not Admin' });
  }
    db.select('*').from('employees')
      .then((employees) => {
        res.json({'All Employee Details ' : employees});
      })
      .catch((error) => {
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });

module.exports = router;
const express = require('express');
const router = express.Router();
const knex = require('knex');
const db = knex(require('../db/knexfile').development);

const { authenticateUser } = require('../authenticationMiddleware/authentication');
const { ADMIN_EMPLOYEE_MANAGEMENT_SYSTEM } = require('../authenticationMiddleware/authAdmin');

router.get('/:employeeId', authenticateUser, async (req, res) => {

  const employeeId = parseInt(req.params.employeeId, 10);
  if(!Number.isSafeInteger(employeeId)) {
      return res.status(400).json({ "Validtaion Error ": 'Invalid employee ID' });
  }
  
  if (isNaN(employeeId)) {
    return res.status(400).json({ "Validation Error ": 'Invalid employee ID' });
  }
  try {
    const employee = await db('employees').where( 'id', employeeId).first();
    if(!employee) {
      return res.status(404).json({ " Fetching Error ": ' No user found ' });
    }
    if(req.user.username.email === ADMIN_EMPLOYEE_MANAGEMENT_SYSTEM || employee.email === req.user.username.email) {
      const filteredEmployee = { ...employee, password: undefined };
      res.status(200).json({"Employee Details " : filteredEmployee});
    }
    else {
      return res.status(401).json({ 'Authorization Error ': ' You are not authorized' });
    }
  } 
  catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  

  module.exports = router;
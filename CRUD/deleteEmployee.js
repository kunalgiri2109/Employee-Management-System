
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const knex = require('knex');
const config = require('../db/knexfile');
const jwt = require('jsonwebtoken');
const db = knex(require('../db/knexfile').development);
const { authenticateUser } = require('../authenticationMiddleware/authentication');
const { ADMIN_EMPLOYEE_MANAGEMENT_SYSTEM } = require('../authenticationMiddleware/authAdmin');

router.delete('/:employeeId', authenticateUser, async (req, res) => {
    const employeeId = parseInt(req.params.employeeId, 10);
    if (isNaN(employeeId) || employeeId > Number.MAX_SAFE_INTEGER) {
      return res.status(400).json({ " Validation Error " : 'Invalid Employee ID' });
    }
    try {
      const employee = await db('employees').where({ id: employeeId }).first();
      if (!employee) {
        return res.status(404).json({ "Invalid Id " : 'Employee not found' });
      }
      if(req.user.username.email === ADMIN_EMPLOYEE_MANAGEMENT_SYSTEM) {
        await db('employees').where('id', employeeId).del();
        res.status(200).json({ " Success message " : 'Employee deleted successfully' });
      }
      else {
        return res.status(401).json({ ' Authorization Error ': ' You are not authorized' });
      }
    } catch (error) {
      console.error('Error deleting employee : ', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  module.exports = router;
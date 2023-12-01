const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const knex = require('knex');
const config = require('../db/knexfile');
const jwt = require('jsonwebtoken');
const db = knex(require('../db/knexfile').development);

router.get('/:employeeId', async (req, res) => {
    const employeeId = parseInt(req.params.employeeId, 10);
    if (!isNaN(employeeId)) {
      try {
        const employee = await db('employees').where( 'id', employeeId).first();
        if(!employee) {
          return res.status(404).json({ error: ' Cannot fetch details of other employee' });
        }
        const filteredEmployee = { ...employee, password: undefined };
        res.status(200).json(filteredEmployee);
      } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(400).json({ message: 'Invalid employee ID' });
    }
  });

  module.exports = router;
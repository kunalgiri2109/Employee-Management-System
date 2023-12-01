// const {  bcrypt, db, router } = require('../common/commonFile');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const knex = require('knex');
const config = require('../db/knexfile');
const jwt = require('jsonwebtoken');
const db = knex(require('../db/knexfile').development);
const { generateAccessToken } = require('../authService');

router.delete('/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId) || userId > Number.MAX_SAFE_INTEGER) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    // const authorizationHeader = req.headers['authorization'];
    // console.log(authorizationHeader.decoded);
    // if (!authorizationHeader) {
    //   return res.status(401).json({ message: 'Unauthorized: Missing Authorization header' });
    // }
    // const token = authorizationHeader.split(' ')[1];
    // console.log(token)
    // if (!token) {
    //   return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    // }
    try {
      const employee = await db('employees').where({ id: userId }).first();
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      // if (req.decoded.role !== 'admin') {
      //   return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      // }
      await db('employees').where('id', userId).del();
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  module.exports = router;
// const { db, jwt, router } = require('../common/commonFile');
const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = knex(require('../db/knexfile').development);

router.get('/', verifyToken,(req, res) => {

console.log("getAllEmployees2")
    db.select('*').from('employees')
      .then((employees) => {
        res.json(employees);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
  function verifyToken(req, res, next) {
    const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Unauthorized: Missing Authorization header' });
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.decoded = decoded;
    next();
  });
}

module.exports = router;
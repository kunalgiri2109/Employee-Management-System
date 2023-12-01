
// const { bcrypt, db } = require('../common/commonFile');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const knex = require('knex');
const config = require('../db/knexfile');
const jwt = require('jsonwebtoken');
const db = knex(require('../db/knexfile').development);
require('dotenv').config();


async function insertUser({
  firstName,
  lastName,
  username,
  password,
  dateOfJoining,
  address,
  email,
  isPermanent,
  department,
}) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db('employees').insert({
      first_name: firstName,
      last_name: lastName,
      username:username,
      password: hashedPassword,
      date_of_joining: dateOfJoining,
      address:address,
      email:email,
      is_permanent: !!isPermanent,
      department_name: department,

    });

  } catch (error) {
    console.error('Error during user insertion:', error);
    throw error; 
  }
}
module.exports = {
  insertUser,
};

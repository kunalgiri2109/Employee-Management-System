    
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const knex = require('knex');
const config = require('../db/knexfile');
const db = knex(config.development);
    
function checkFields(userDetails) {
    missingFields = [];

    if (!userDetails.firstName) missingFields.push('firstName');
    if (!userDetails.username) missingFields.push('username');
    if (!userDetails.password) missingFields.push('password');
    if (!userDetails.confirmPassword) missingFields.push('confirmPassword');
    if (!userDetails.dateOfJoining) missingFields.push('dateOfJoining');
    if (!userDetails.address) missingFields.push('address');
    if (!userDetails.email) missingFields.push('email');
    // if (!userDetails.isPermanent) missingFields.push('isPermanent');
    if (!userDetails.department) missingFields.push('department');
    
    return missingFields;
}

module.exports = { checkFields }

  
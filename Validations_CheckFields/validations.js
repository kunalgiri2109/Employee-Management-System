    
const express = require('express');
const router = express.Router();
const path = require('path');
const knex = require('knex');
const config = require('../db/knexfile');
const db = knex(config.development);

function validations(userDetails) {
    let errorDetails = {};
    if (!userDetails.firstName || !/^[A-Za-z]+$/.test(userDetails.firstName)) {
        errorDetails.firstName = 'Invalid first name' ;
    }
    if (!userDetails.password || userDetails.password.length < 5) {
        errorDetails.password = 'Invalid Password' ;
    }
    if (userDetails.password !== userDetails.confirmPassword) {
        errorDetails.confirmPassword = 'Password and Confirm Password do not match';
    }
    if (!userDetails.email || !/\S+@\S+\.\S+/.test(userDetails.email)) {
        errorDetails.email = 'Invalid email';
    }
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!userDetails.dateOfJoining || !dateFormatRegex.test(userDetails.dateOfJoining)) {
        errorDetails.dateOfJoining = 'Date of joining is either not formatted or empty';
    }
    if (typeof userDetails.isPermanent != 'boolean') {
        errorDetails.isPermanent = 'Select either true or false'
    }
    const validDepartments = ['IT', 'HR', 'Sales']; 
    if (!userDetails.department || !validDepartments.includes(userDetails.department)) {
        errorDetails.department = 'Invalid department'
    }
    return errorDetails;
}
module.exports = { validations }

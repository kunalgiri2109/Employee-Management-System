    
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const knex = require('knex');
const config = require('../db/knexfile');
const db = knex(config.development);

function validations(userDetails) {
    let errorDetails = {};
    if (!userDetails.firstName || !/^[A-Za-z]+$/.test(userDetails.firstName)) {
        errorDetails.firstName = 'Invalid first name' ;
        //eturn res.status(400).json({ message: 'Invalid first name' });
    }
    
    userDetails.username = (userDetails.firstName + userDetails.lastName).toLowerCase();
    if (!userDetails.username || !/^[a-z]+$/.test(userDetails.username)) {
        errorDetails.username = 'Invalid username' ;
        // return res.status(400).json({ message: 'Invalid username' });
    }
    if (!userDetails.password || userDetails.password.length < 5) {
        errorDetails.password = 'Invalid Password' ;
        // return res.status(400).json({ message: 'Password either not defined or must be at least 5 characters long' });
    }
    if (userDetails.password !== userDetails.confirmPassword) {
        errorDetails.confirmPassword = 'Password and Confirm Password do not match';
        // return res.status(400).json({ message: 'Password and Confirm Password do not match' });
    }
    if (!userDetails.email || !/\S+@\S+\.\S+/.test(userDetails.email)) {
        errorDetails.email = 'Invalid email';
        // return res.status(400).json({ message: 'Invalid email' });
    }
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!userDetails.dateOfJoining || !dateFormatRegex.test(userDetails.dateOfJoining)) {
        errorDetails.dateOfJoining = 'Date of joining is either not formatted or empty';
        // return res.status(400).json({ message: 'Date of joining is either not formatted or empty' });
    }
    if (typeof userDetails.isPermanent != 'boolean') {
        errorDetails.isPermanent = 'Select either true or false'
        // return res.status(400).json({ message: 'Invalid value for is permanent' + typeof isPermanent });
    }
    const validDepartments = ['IT', 'HR', 'Sales']; 
    if (!userDetails.department || !validDepartments.includes(userDetails.department)) {
        errorDetails.department = 'Invalid department'
        // return res.status(400).json({ message: 'Invalid department' });
    }
    console.log("error" , errorDetails);
    return errorDetails;
}
module.exports = { validations }

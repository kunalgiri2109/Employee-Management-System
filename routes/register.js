// register.js
const express = require('express');
const router = express.Router();
const knex = require('knex');
const bcrypt = require('bcrypt');
const axios = require('axios');
const Redis = require('ioredis');
const db = knex(require('../db/knexfile').development);
const elastic = require('../elasticSearch');

const { generateAccessToken } = require('../authenticationMiddleware/authService');
require('dotenv').config();
const { validations } = require('../Validations_CheckFields/validations');
const { checkFields } = require('../Validations_CheckFields/checkFields');
const { getFormattedDateTime } = require('../formatDateTime/getFormattedDateTime');

const redisClient = new Redis();

router.post('/', async (req, res) => {
    try {
      let errorLog = [], missingFields = {};
      errorLog.push(checkFields(req.body, missingFields));
      errorLog.push(validations(req.body, missingFields));
      if(errorLog.length > 2) {
        return res.status(400).json( errorLog );
      }
      const email = req.body.email;
      const lowercaseEmail = email ? email.toLowerCase() : null;
    
      const existingUser = await db('employees').where('email', lowercaseEmail);
      if (existingUser.length > 0) {
        return res.status(400).json({ error : 'Employee already registered with this email' });
      }

      const passwordToHash = req.body.password;

      if (!passwordToHash) {
        return res.status(400).json({ error: 'Password is required' });
      }
      const hashedPassword = await bcrypt.hash(passwordToHash, 10);
      const departmentDetails = await db('departments').where('deptName', req.body.department).first();
      const address = req.body.address;
      const cacheKey = 'registration:' + JSON.stringify(address);
      // console.log(cacheKey);
    
      const cachedResult = await redisClient.hget('coordinates', cacheKey);
      // console.log(cachedResult);

      let coordinates, geoJsonPoint;
      if (cachedResult) {
        coordinates = JSON.parse(cachedResult);
      }
      else {
        apiKey = "7f1270307aea4177a5b52a78a0bacac6";
      
        let addr = '';
        // console.log(address);
        for (const key in address) {
          addr += address[key] + ", ";
        }
          coordinates = await geocodeAddress(apiKey, addr);
          // console.log(cacheKey);
          await redisClient.hset('coordinates', cacheKey, JSON.stringify(coordinates));
          // await redisClient.set(cacheKey, JSON.stringify(coordinates));
        }
        geoJsonPoint = {
          type: 'Point',
          coordinates: [ coordinates.longitude, coordinates.latitude ],
        };
        // console.log(geoJsonPoint);
        const [newUser] = await db('employees').insert({
          fullname: req.body.fullname,
          email : lowercaseEmail,
          password: hashedPassword,
          contact: req.body.contact,
          dateOfBirth: req.body.dateOfBirth,
          address: req.body.address,
          isPermanent: !!req.body.isPermanent,
          skills: req.body.skills,
          location : geoJsonPoint,
          department: req.body.department,
          deptId: departmentDetails.deptId
        }).returning('id');
 
        const userDetails = {
          "fullname": req.body.fullname,
          "email" : lowercaseEmail,
          "dateOfBirth" : req.body.dateOfBirth,
          "contact" : req.body.contact,
          "address" : req.body.address,
          "skills" : req.body.skills,
          "location" : geoJsonPoint,
          "isPermanent": !! req.body.isPermanent,
          "department": req.body.department
        }
        const token = generateAccessToken(userDetails);
        
        const body = await elastic.index({
          index: 'employees',
          id : newUser.id,
          body: {id : newUser.id, ...userDetails
          },
        });
        res.status(200).json({ "token" : token });
    }
    catch (error) {
      res.status(500).json({ error: error});
    }
});
  async function geocodeAddress(apiKey, address) {
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;
   
    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        if (result.geometry) {
          const location = result.geometry;
          return { latitude: location.lat, longitude: location.lng };
        } else {
          throw new Error('Invalid response format from OpenCage API');
        }
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      throw new Error(`Geocoding failed: ${error.message}`);
    }
  }

module.exports = router;
  
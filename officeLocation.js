
const express = require('express');
const router = express.Router();
const Redis = require('ioredis');
const axios = require('axios');

const redisClient = new Redis();

router.post('/', async (req, res) => {
    try {
        const address = req.body.address;
        
        const cacheKey = 'registration:' + JSON.stringify(address);
        const cachedResult = await redisClient.get(cacheKey);
        let coordinates, geoJsonPoint;
        if (cachedResult) {
            coordinates = JSON.parse(cachedResult);
        }
        else {
        apiKey = "7f1270307aea4177a5b52a78a0bacac6";

        let addr = '';
        for (const key in address) {
            addr += address[key] + ", ";
        }
            coordinates = await geocodeAddress(apiKey, addr);
            
            await redisClient.set(cacheKey, JSON.stringify(coordinates));
        }
        geoJsonPoint = {
            type: 'Point',
            coordinates: [ coordinates.longitude, coordinates.latitude ],
        };
        const officeDetails = {
          "name": "Invansys Technologies",
          "address" : req.body.address,
          "location" : geoJsonPoint,
        }
        res.status(200).json({ officeDetails });
    }
    catch (error) {
        console.log(error)
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
  
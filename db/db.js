// db.js

const knex = require('knex');
const config = require('./knexfile');

const db = knex(config.development); // Use 'production' for a production environment
module.exports = db;
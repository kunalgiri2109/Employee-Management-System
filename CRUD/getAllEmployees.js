
const express = require('express');
const knex = require('knex');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = knex(require('../db/knexfile').development);
const elastic = require('../elasticSearch');
const { authenticateUser } = require('../authenticationMiddleware/authentication');
const { ADMIN_EMPLOYEE_MANAGEMENT_SYSTEM } = require('../authenticationMiddleware/authAdmin');

router.get('/', authenticateUser,async (req, res) => {
  if( req.user.username.email !== ADMIN_EMPLOYEE_MANAGEMENT_SYSTEM) {
    return res.status(401).json({ 'Authorization Error ': ' You are not Admin' });
  }
    const data = await elastic.search({
      index: "employees",
      query: {
        match_all: {},
      },
    });

    const result = data.hits.hits;
    let arr = result.map((ele)=>{
      delete ele._source.password
      return ele._source
    })
    console.log('output is',arr)
    return res.json({ msg: arr });

    // db.select('*').from('employees')
    //   .then((employees) => {
    //     res.json({ 'All Employees Details ' : employees});
    //   })
    //   .catch((error) => {
    //     res.status(500).json({ error: 'Internal Server Error' });
    //   });
  });

module.exports = router;
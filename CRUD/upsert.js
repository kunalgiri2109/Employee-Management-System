
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('knex');
const elastic = require('../elasticSearch');
const db = knex(require('../db/knexfile').development);

const { validationsUpsert } = require('../validations_upsert');
const { checkFields } = require('../Validations_CheckFields/checkFields');
// const { getFormattedDateTime } = require('../formatDateTime/getFormattedDateTime');
// const { generateAccessToken } = require('../authenticationMiddleware/authService');

router.put('/', async (req, res) => {
  try {
    const employeeDetails = req.body;
    let errorResponses = [], successResponses = [];
    for(const employeeDetail of employeeDetails) {
      // const validationError = validationsUpsert(employeeDetail);
      // if(Object.keys(validationError).length !== 0) {
      //   errorResponses.push(validationError);
      //   continue;
      // }
      if('id' in employeeDetail) {
        const department = await db('departments').where('deptName', employeeDetail.department).first();
        employeeDetail.deptId = department.deptId;
        await db('employees').where('id', employeeDetail.id).update( employeeDetail );
        await elastic.update({
          index: 'employees',
          id: employeeDetail.id,
          body : {
            doc : employeeDetail
          }
        });
          successResponses.push({ employeeDetail });
      }
      else {
        const lowercaseEmail = employeeDetail.email.toLowerCase();
        const existingUser = await db('employees').where('email', lowercaseEmail);
        if (existingUser.length > 0) {
            errorResponses.push('Employee already registered with this email' );
        }
        else {
          // let missingFields = [];
          // missingFields = checkFields(employeeDetail);
          // if(missingFields.length > 0) {
          //   errorResponses.push({ "Missing Fields " : missingFields });
          //   continue;
          // }
          const hashedPassword = await bcrypt.hash(employeeDetail.password, 10);
          const department = await db('departments').where('deptName', employeeDetail.department).first();
          
          employeeDetail.password = hashedPassword;
          employeeDetail.deptId = department.deptId;
          const [employeeId] = await db('employees').insert( employeeDetail ).returning('id');
         
          employeeDetail.password = undefined;
          const body = await elastic.index({
            index: 'employees',
            id : employeeId.id,
            body: {id : employeeId.id, ...employeeDetail
            },
          });
          employeeDetail.password = undefined;
          successResponses.push({ employeeDetail });
        }
      }
    }
    const response = { errorResponses, successResponses };
    return res.status(200).json(response);
  }
  catch (error) {
    console.error('Error during upsert:', error);
    res.status(500).send('Internal Server Error');
  }
  
});

module.exports = router;

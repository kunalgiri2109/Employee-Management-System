
const express = require('express');
const router = express.Router();

const knex = require('knex');
const db = knex(require('../db/knexfile').development);

router.get('/', async (req, res) => {
  try {
    const queryParams = req.query;
    if (queryParams.fullname) {
      const [operator, value] = queryParams.fullname.split(':');
      if(typeof value !== 'string') {
        return res.status(400).json({ "Validation Error " : 'Invalid value for fullname parameter' });
    }
  }
  if (queryParams.department ) {
    const [operator, value] = queryParams.department.split(':');
    if(typeof value !== 'string') {
        return res.status(400).json({ "Validation Error " : 'Invalid value for department_name parameter' });
    }
  }
  if (queryParams.email ) {
    const [operator, value] = queryParams.email.toLowerCase().split(':');
    if(!isValidEmail(value)) {
      return res.status(400).json({ "Validation Error " : 'Invalid value for email parameter' });
    }
  }
  if (queryParams.id) {
    const [operator, value] = queryParams.id.split(':');
    if(!isValidInteger(value)) {
      return res.status(400).json({ "Validation Error " : 'Invalid value for id parameter' });
    }
  }
  if(queryParams.isPermanent) {
    const [operator, value] = queryParams.isPermanent.toLowerCase().split(':');
    console.log(value + " " +  value)
     if( value != 'true' && value != 'false') {
      return res.status(400).json({  "Validation Error " : 'Invalid value for is_permanent parameter' });
    }
  }
    const employeeFilter = {};
    
    if (queryParams.fullname) {
      const [operator, value] = queryParams.fullname.toLowerCase().split(':');
      employeeFilter.fullname = { operator, value };
    }

    if (queryParams.id) {
      const [operator, value] = queryParams.id.split(':');
      employeeFilter.id = { operator, value };
    }

    if (queryParams.department) {
      const [operator, value] = queryParams.department.split(':');
      employeeFilter.department_name = { operator, value };
    }
    if (queryParams.email) {
      const [operator, value] = queryParams.email.toLowerCase().split(':');
      employeeFilter.email = { operator, value };
    }
    if (queryParams.isPermanent) {
      const [operator, value] = queryParams.isPermanent.toLowerCase().split(':');
      employeeFilter.is_permanent = { operator, value };
    }
    const employees = await db('employees')
      .where((builder) => {
        Object.entries(employeeFilter).forEach(([field, filter]) => {
          switch (filter.operator) {
            case 'eq':
              builder.where(field, filter.value);
              break;
            case 'cn':
              builder.where(field, 'ilike', `%${filter.value}%`);

              break;
            case 'gt':
              builder.where(field, '>', filter.value);
              break;
            case 'ne':
              builder.where(field, '!=', filter.value);
              break;
            case 'lt':
              builder.where(field, '<', filter.value);
              break;
            case 'le':
              builder.where(field, '<=', filter.value);
              break;
            case 'ge':
              builder.where(field, '>=', filter.value);
              break;
            default:
              builder.where(field, '=', filter.value);
          }
        });
      })
      .select('*');
      for(let i = 0; i < employees.length; i++) {
          employees[i].password = undefined;
      }
      res.status(200).json({ "Employee Details : " : employees });
      
  }
  catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
function isValidEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

function isValidInteger(value) {
  const parsedValue = parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue >= 0;
}

module.exports = router
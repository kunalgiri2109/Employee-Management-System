// server.js
const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = express.Router();
const PORT = process.env.PORT || 8080;
// const {  bodyParser, jwt, PORT } = require('./common/commonFile');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const bcrypt = require('bcrypt');

// const { insertUser } = require('./routes/insert');
// const { updateEmployee } = require('./routes/update');
require('dotenv').config()

const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const adminRoutes = require('./routes/admin');
const getEmployee = require('./CRUD/getEmployeeDetails');
const getAllEmployees = require('./CRUD/fetchAllEmployees');
const deleteEmployee = require('./CRUD/deleteEmployee');
const upsert = require('./CRUD/upsert');
const updateEmployee = require('./CRUD/updateEmployee')

// const updateRoutes = require('./routes/update');
// const authMiddleware = require('./middleware/authMiddleware');

// app.use(authMiddleware);
app.use(router);

app.use('/login', loginRoutes); // done
app.use('/register', registerRoutes); // done
app.use('/admin', adminRoutes);
app.use('/getEmployee', getEmployee); // done
app.use('/getAllEmployees', getAllEmployees); // done
app.use('/upsert', upsert); // done
app.use('/deleteEmployee', deleteEmployee); // done
app.use('/updateEmployee', updateEmployee); // done

const db = knex(require('./db/knexfile').development);

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401).json({ message: 'You are not an admin...' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403).json({ message: 'You are not an admin....' });
    req.user = user;
    next();
  });
}
// to get employee details
// app.get('/employee/:employeeId', async (req, res) => {
//   const employeeId = parseInt(req.params.employeeId, 10);
//   // console.log(typeof employeeId);
//   if (!isNaN(employeeId)) {
//     try {
//       // Fetch the employee details from the database
//       const employee = await db('employees').where( 'id', employeeId).first();
//       console.log(employee);
//       if(!employee) {
//         return res.status(404).json({ error: ' Cannot fetch details of other employee' });
//       }
//       if(employee.id != employeeId) {
//         return res.status(404).json({ error: ' You r not allowed' });
//       }

//       const filteredEmployee = { ...employee, password: undefined };

//       res.status(200).json(filteredEmployee);
//     } catch (error) {
//       console.error('Error fetching employee details:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else {
//     res.status(400).json({ message: 'Invalid employee ID' });
//   }
// });
// Admin-only endpoint
app.get('/admin-only', authenticateToken, (req, res) => {
  const { role } = req.user;
  if (role !== 'admin') return res.sendStatus(403).json({ message: 'You are not an admin bro.' });;

  res.json({ message: 'You are an admin and can access this endpoint.' });
});

// Routes
//running
app.get('/', (req, res) => {
  res.status(200).json({message : "On index page"})
});

// app.get('/fetchAllEmployees', verifyToken,(req, res) => {
//     // Fetch all employees from the database
//     db.select('*').from('employees')
//       .then((employees) => {
//         console.log(res.json(employees));
//         // return true;
//       })
//       .catch((error) => {
//         console.error('Error fetching employees:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       });
//   });

  
  // app.delete('/employees/:userId', verifyToken, async (req, res) => {
  //   const authorizationHeader = req.headers['authorization'];
  
  //   if (!authorizationHeader) {
  //     return res.status(401).json({ message: 'Unauthorized: Missing Authorization header' });
  //   }
  
  //   const token = authorizationHeader.split(' ')[1];
  
  //   if (!token) {
  //     return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  //   }
  
  //   // Existing code for jwt.verify...
  
  //   const userId = parseInt(req.params.userId, 10);
  
  //   if (isNaN(userId)) {
  //     return res.status(400).json({ message: 'Invalid user ID' });
  //   }
  
  //   try {
  //     const employee = await db('employees').where({ id: userId }).first();
  
  //     if (!employee) {
  //       return res.status(404).json({ error: 'Employee not found' });
  //     }
  
  //     // Check user role here (for example, assuming 'admin' role grants delete permission)
  //     if (req.decoded.role !== 'admin') {
  //       return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  //     }
  
  //     // Delete the employee from the database
  //     await db('employees').where('id', userId).del();
  //     res.status(200).json({ message: 'Employee deleted successfully' });
  //   } catch (error) {
  //     console.error('Error deleting employee:', error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // });

// app.put('/employee/:employeeId', async (req, res) => {
//   const employeeId = req.params.employeeId.trim();
//   const updatedDetails = req.body;
//   if (employeeId === '') {
//     return res.status(400).json({ message: 'Employee ID cannot be empty' });
//   }
//   if (isNaN(employeeId)) {
//     return res.status(400).json({ message: 'Invalid employee ID' });
//   }

//   try {
//     const existingEmployee = await db('employees').where('id', employeeId).first();

//     if (!existingEmployee) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }
//     const validFields = ['first_name', 'last_name', 'username', 'password', 'confirmPassword', 'address', 'email','isPermanent','department']; 
//     const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));
//     if (invalidFields.length > 0) {
//       return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
//     }
//     await db('employees').where('id', employeeId).update(updatedDetails);
//     const updatedEmployee = await db('employees').where('id', employeeId).first();
//     res.json({ message: 'Employee details updated successfully', updatedEmployee });
//   }
//   catch (error) {
//     console.error('Error updating employee details:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

//query params
app.get('/queryParamEmployees', async (req, res) => {
  console.log("YESSS");
  try {
    const { username, department } = req.query;
    let query = knex.select('*').from('employees');
    if (username) {
      query = query.where('username', 'like', `%${username}%`);
    }
    if(department) {
      query = query.where('department', '=', department);
    }
    const filteredEmployees = await query;
    res.json(filteredEmployees);
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
function isValidEmail(email) {
  return typeof email === 'string' && email.includes('@');
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

app.get('/admin', verifyToken, (req, res) => {
    res.send(200).json({
      message: "Admin Page "
    })
  });

  function verifyToken(req, res, next) {
    const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Unauthorized: Missing Authorization header' });
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.decoded = decoded;
    next();
  });
  }
  // completed
  // app.post('/upsert', async (req, res) => {
  //     let {
  //       employeeId, firstName, lastName, username, password, dateOfJoining, address, email, isPermanent, department,
  //     } = req.body;
  //     console.log(employeeId);
  //     let missingFields = [];
  //     if (!firstName) missingFields.push('firstName');
  //     if (!username) missingFields.push('username');
  //     if (!password) missingFields.push('password');
  //     // if (!confirmPassword) missingFields.push('confirmPassword');
  //     if (!dateOfJoining) missingFields.push('dateOfJoining');
  //     if (!address) missingFields.push('address');
  //     if (!email) missingFields.push('email');
  //     if (!isPermanent) missingFields.push('isPermanent');
  //     if (!department) missingFields.push('department');
  //   // missingFields = validation.validations(req.body);
  //    if(missingFields.length > 0) {
  //     return res.status(400).json({ error: `Missing required fields :  ${missingFields.join(', ')}` });
  //    }
  //   try {
  //     username = (firstName + lastName).toLowerCase();
  //     if(password === undefined) {
  //       return res.sendStatus(400).json({ message : "Password is required"})
  //     }
  //     if (employeeId === '' ) {
  //       return res.status(400).json({ message: 'Employee ID cannot be empty' });
  //     }
  //     if (employeeId !== undefined && employeeId.trim() === '' ) {
  //       return res.status(400).json({ message: 'Employee ID cannot be empty' });
  //     }
  //     if (employeeId != undefined && isNaN(employeeId)) {
  //       return res.status(400).json({ message: 'Invalid employee ID' });
  //     }
  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     await db.transaction(async (trx) => {
  //       if(employeeId !== undefined) {
  //         const existingEmployee = await db('employees').where('id', employeeId).first();
  //         if (!existingEmployee) {
  //           return res.status(404).json({ message: 'Employee not found' });
  //         }
  //         console.log("entering update block")
  //         await db('employees').where('id', employeeId).update({
  //           first_name: firstName,
  //           last_name: lastName,
  //           username: username,
  //           password: hashedPassword,
  //           date_of_joining: dateOfJoining,
  //           address: address,
  //           email: email,
  //           is_permanent: !!isPermanent,
  //           department_name: department,
  //         });
  //         res.status(200).json({ message: 'Upsert successful. Data updated successfully' });
  //       }
        
  //       else {
  //         console.log("entering this block");
  //         await db('employees').insert({
  //           first_name: firstName,
  //           last_name: lastName,
  //           username: username,
  //           password: hashedPassword,
  //           date_of_joining: dateOfJoining,
  //           address: address,
  //           email: email,
  //           is_permanent: !!isPermanent,
  //           department_name: department,
  //         });
  //         res.status(200).json({ message: 'Upsert successful. Data inserted successfully' });
  //       }
  //     await trx.commit();
  //     });
  // }
  //   catch (error) {
  //     console.error('Error during upsert:', error);
  //     res.status(500).send('Internal Server Error');
  //   }
  // });
  
  
  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = router;
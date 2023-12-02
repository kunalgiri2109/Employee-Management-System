
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ 'Authorization Error ': 'Missing token' });
      }
    else {
      var authorization = req.headers.authorization.split(' ')[1], decoded;
      if (!authorization) {
        return res.status(401).json({ 'Authorization Error ': 'Missing token' });
      }
      jwt.verify(authorization, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
          if (error) {
            return res.status(401).json({ 'Authorization Error ': ' Invalid token' });
          }
        req.user = decoded;
        next();
        });
      }
  };

  module.exports = { authenticateUser }
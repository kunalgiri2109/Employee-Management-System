
const jwt = require('jsonwebtoken');

function generateAccessToken(username, role) {
  return jwt.sign({ username, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

module.exports = {
  generateAccessToken,
};

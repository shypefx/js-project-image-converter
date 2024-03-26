// authenticateUser.js
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const secretKeyPath = path.join(__dirname, 'secret_key.txt');
const secretKey = fs.readFileSync(secretKeyPath, 'utf-8').trim();

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer '
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authenticateUser;

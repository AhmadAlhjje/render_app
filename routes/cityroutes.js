const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cityController = require('../Controllers/cityController');

const SECRET_KEY = 'supersecret';

// Middleware for authentication
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send("Unauthorized - No token provided");
  }

  const tokenWithoutBearer = token.split(' ')[1];
  jwt.verify(tokenWithoutBearer, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send("Unauthorized - Invalid token");
    }
    req.user = decoded;
    next();
  });
}

// Routes
router.post('/', authMiddleware, cityController.createCity);
router.get('/:id', cityController.getCity); // تم تصحيح اسم الدالة
router.put('/:id', authMiddleware, cityController.updateCity);
router.delete('/:id', authMiddleware, cityController.deleteCity);
router.get('/', cityController.getAllCities); // تأكد من وجود الدالة

module.exports = router;

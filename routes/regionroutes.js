const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const regionController = require('../Controllers/regionController');

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
router.post('/', authMiddleware, regionController.createRegion);
router.get('/:id', regionController.getRegion);
router.get('/', regionController.getAllRegions);
router.put('/:id', authMiddleware, regionController.updateRegion);
router.delete('/:id', authMiddleware, regionController.deleteRegion);

module.exports = router;

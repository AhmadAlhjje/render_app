const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const fieldOwnerController = require('../Controllers/temp');

const SECRET_KEY = 'supersecret';

// Middleware for authentication
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).send('Unauthorized - No token provided');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send('Unauthorized - Invalid token');
    }

    req.user = decoded;
    next();
  });
}

// Routes
router.get('/field_owners', authMiddleware, fieldOwnerController.getAllFieldOwners);
router.get('/field_owner/:id', authMiddleware, fieldOwnerController.getFieldOwner);
router.get('/field_by_user/:user_id', authMiddleware, fieldOwnerController.getFieldByUserId); // المسار الجديد
router.put('/field_owner/:id', authMiddleware, fieldOwnerController.updateFieldOwner);
router.delete('/field_owner/:id', authMiddleware, fieldOwnerController.deleteFieldOwner);

module.exports = router;

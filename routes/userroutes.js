const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userController = require('../Controllers/userController');

const SECRET_KEY = 'supersecret';

// Middleware للتحقق من التوكن
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
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.get('/', authMiddleware, userController.getAllUsers);

// مسار جديد لتحديث نوع المستخدم إلى field_owner
// router.patch('/:id/upgrade-to-field-owner', authMiddleware, userController.updateUserTypeToFieldOwner);

module.exports = router;

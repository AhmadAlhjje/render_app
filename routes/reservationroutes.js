const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const reservationController = require('../Controllers/reservationController');

const SECRET_KEY = 'supersecret';

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
  
    if (!authHeader) {
      return res.status(403).send("Unauthorized - No token provided");
    }
  
    // استخراج التوكن بدون كلمة "Bearer"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(403).send("Unauthorized - Malformed token");
    }
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).send("Unauthorized - Invalid token");
      }
  
      req.user = decoded;
      next();
    });
  }
  

router.post('/', authMiddleware, reservationController.createReservation);
router.get('/:id', reservationController.getReservation);
router.put('/:id', authMiddleware, reservationController.updateReservation);
router.delete('/', authMiddleware, reservationController.deleteReservation);
router.get('/field/:field_id', reservationController.getReservationsByField);
router.get('/user/:user_id', reservationController.getReservationsByUser);

module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const fieldController = require('../Controllers/fieldController');

const SECRET_KEY = 'supersecret';

// Middleware للتحقق من المصادقة باستخدام الـ JWT
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

// المسارات مع المصادقة
router.post('/', authMiddleware, fieldController.createField);
router.put('/:id', authMiddleware, fieldController.updateField);
router.delete('/:id', authMiddleware, fieldController.deleteField);
router.get('/search',authMiddleware, fieldController.searchFields);

// المسارات بدون مصادقة
router.get('/:id', fieldController.getField);
router.get('/city/:city_id', fieldController.getFieldsByCity);
router.get('/', fieldController.getAllFields);


// مسار تسجيل الدخول للحصول على الرمز
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // تحقق بسيط لتجربة تسجيل الدخول
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ id: 1, username: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({ token });
  }

  res.status(401).send('Invalid username or password');
});

module.exports = router;

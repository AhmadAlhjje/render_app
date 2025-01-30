const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'supersecret'; // نفس المفتاح المستخدم في الراوت

// (مجررررررب)

// تسجيل مستخدم جديد
exports.register = async (req, res) => {
  try {
    const { name, phone_number, password, user_type } = req.body;

    const validUserTypes = ['regular', 'field_owner', 'site_owner'];
    if (!validUserTypes.includes(user_type)) {
      return res.status(400).send('Invalid user type');
    }

    const existingUser = await db.User.findOne({ where: { phone_number } });
    if (existingUser) {
      return res.status(400).send('Phone number already registered');
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    await db.User.create({
      name,
      phone_number,
      password: hashedPassword,
      user_type,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).send('User registered');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// (مجررررررب)

// تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;
    console.log("Received login request:", { phone_number, password });

    const user = await db.User.findOne({ where: { phone_number } });
    if (!user) {
      console.log("User not found for phone number:", phone_number);
      return res.status(404).send('User not found');
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      console.log("Invalid password for user:", phone_number);
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign(
      { id: user.user_id, user_type: user.user_type },
      SECRET_KEY,
      { expiresIn: 86400 }
    );

    console.log("Token generated for user:", phone_number);
    res.status(200).send({ auth: true, token, user_type: user.user_type });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send('Server error');
  }
};

// (مجررررررب)

// استرجاع مستخدم حسب ID 
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id);
    if (!user) return res.status(404).send('User not found');
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


// (مجررررررب)

// تحديث بيانات المستخدم
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, user_type } = req.body;

    const validUserTypes = ['regular', 'field_owner', 'site_owner'];
    if (user_type && !validUserTypes.includes(user_type)) {
      return res.status(400).send('Invalid user type');
    }

    // تحديث البيانات بدون phone_number
    const [updated] = await db.User.update(
      { name, user_type },
      { where: { user_id: id } }
    );

    if (!updated) return res.status(404).send('User not found');
    res.status(200).send('User updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// (مجررررررب)

// حذف مستخدم
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.User.destroy({ where: { user_id: id } });
    if (!deleted) return res.status(404).send('User not found');
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// (مجررررررب)

// جلب جميع المستخدمين()
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll();  // استعلام لجلب جميع المستخدمين
    if (!users || users.length === 0) {
      return res.status(404).send('No users found');
    }
    res.status(200).json(users);  // إرجاع جميع المستخدمين بصيغة JSON
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// (مجررررررب)

// تعديل نوع المستخدم من regular إلى field_owner
// exports.updateUserTypeToFieldOwner = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // البحث عن المستخدم وتحديث نوعه
//     const [updated] = await db.User.update(
//       { user_type: 'field_owner' }, // تحديث نوع المستخدم
//       { where: { user_id: id, user_type: 'regular' } } // فقط إذا كان نوعه الحالي regular
//     );

//     if (!updated) return res.status(404).send('User not found or not a regular user');
//     res.status(200).send('User type updated to field_owner successfully');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// };

const multer = require('multer');
const path = require('path');
const db = require('../models');
const Sequelize = require('sequelize');

// إعدادات Multer للتخزين
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // المجلد الذي سيتم حفظ الصور فيه
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // إضافة timestamp لضمان فريدة الأسماء
  }
});

const upload = multer({ storage: storage });

// تابع إنشاء الحقل مع استقبال الصور كملفات
exports.createField = [
  upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { name, region_id, details, phone_number } = req.body;
      const { image1, image2, image3, image4 } = req.files;

      // التحقق من وجود الحقول المطلوبة
      if (!name || !region_id || !image1 || !phone_number) {
        return res.status(400).send('All fields are required');
      }

      // البحث عن المستخدم باستخدام رقم الهاتف
      const user = await db.User.findOne({ where: { phone_number } });

      if (user) {
        // إذا كان المستخدم موجودًا و نوعه ليس "field_owner"، نقوم بتحديثه
        if (user.user_type !== 'field_owner') {
          const [updated] = await db.User.update(
            { user_type: 'field_owner' },
            { where: { user_id: user.user_id, user_type: 'regular' } }
          );

          if (!updated) {
            return res.status(404).send('User not found or not a regular user');
          }
        }
      } else {
        return res.status(404).send('User with provided phone_number number not found');
      }

      // حفظ الحقل
      const field = await db.Field.create({
        name,
        region_id,
        image1: image1[0].path, // تخزين المسار المحلي للملف
        image2: image2 ? image2[0].path : null,
        image3: image3 ? image3[0].path : null,
        image4: image4 ? image4[0].path : null,
        details: details || null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // ربط الحقل بالمستخدم كمالك
      const fieldOwner = await db.FieldOwner.create({ field_id: field.field_id, user_id: user.user_id });

      res.status(201).json({ field, fieldOwner });

    } catch (err) {
      console.error('Error creating field:', err);
      res.status(500).send(`Server error: ${err.message}`);
    }
  }
];

// تابع تحديث الحقل مع استقبال الصور كملفات
exports.updateField = [
  upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, region_id, details } = req.body;
      const { image1, image2, image3, image4 } = req.files;

      // التحقق من وجود صورة واحدة على الأقل
      if (!image1 && !image2 && !image3 && !image4) {
        return res.status(400).send('At least one image must be provided');
      }

      const [updated] = await db.Field.update(
        {
          name,
          region_id,
          details,
          image1: image1 ? image1[0].path : undefined,
          image2: image2 ? image2[0].path : undefined,
          image3: image3 ? image3[0].path : undefined,
          image4: image4 ? image4[0].path : undefined
        },
        { where: { field_id: id } }
      );

      if (!updated) return res.status(404).send('Field not found');

      res.status(200).send('Field updated successfully');
    } catch (err) {
      console.error('Error updating field:', err);
      res.status(500).send('Server error');
    }
  }
];




exports.searchFields = async (req, res) => {
  try {
    const { field_name, region_name, city_name } = req.query;

    // بناء الشروط بناءً على المدخلات المرسلة
    const whereConditions = {};

    // تحقق من field_name
    if (field_name) {
      whereConditions.name = {
        [Sequelize.Op.like]: Sequelize.fn('LOWER', `%${field_name.toLowerCase()}%`)  // مقارنة باستخدام LOWER
      };
    }

    // البحث في الحقول بناءً على الشروط المرسلة
    const fields = await db.Field.findAll({
      where: whereConditions,  // هذه هي الشروط التي تم بناءها باستخدام المعلمات
      include: [
        {
          model: db.Region,
          where: region_name ? { 
            name: { 
              [Sequelize.Op.like]: Sequelize.fn('LOWER', `%${region_name.toLowerCase()}%`)  // مقارنة باستخدام LOWER
            }
          } : {}, // إذا لم يكن هناك اسم منطقة، تخطي هذا البحث
          include: [
            {
              model: db.City,
              where: city_name ? { 
                name: { 
                  [Sequelize.Op.like]: Sequelize.fn('LOWER', `%${city_name.toLowerCase()}%`)  // مقارنة باستخدام LOWER
                }
              } : {} // إذا لم يكن هناك اسم مدينة، تخطي هذا البحث
            }
          ]
        }
      ]
    });

    // إذا لم توجد أي حقول
    if (!fields || fields.length === 0) {
      return res.status(404).send('No fields found matching the search criteria');
    }

    // إرسال النتائج إلى الواجهة الأمامية
    res.status(200).json(fields);
  } catch (err) {
    console.error('Error during search:', err);
    res.status(500).send('Server error');
  }
};






// تابع الحصول على الحقل بناءً على الـ ID مع ربطه بالمناطق والمدن
exports.getField = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await db.Field.findByPk(id, {
      include: [
        {
          model: db.Region,
          include: [
            {
              model: db.City,
            }
          ]
        }
      ]
    });

    if (!field) return res.status(404).send('Field not found');

    res.status(200).send(field);
  } catch (err) {
    console.error('Error fetching field:', err);
    res.status(500).send('Server error');
  }
};

// تابع حذف الحقل بناءً على الـ ID
exports.deleteField = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.Field.destroy({ where: { field_id: id } });

    if (!deleted) return res.status(404).send('Field not found');

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting field:', err);
    res.status(500).send('Server error');
  }
};

// تابع الحصول على الحقول بناءً على الـ city_id
exports.getFieldsByCity = async (req, res) => {
  try {
    const { city_id } = req.params;

    const fields = await db.Field.findAll({ where: { city_id } });

    res.status(200).send(fields);
  } catch (err) {
    console.error('Error fetching fields by city:', err);
    res.status(500).send('Server error');
  }
};

// تابع الحصول على جميع الحقول
exports.getAllFields = async (req, res) => {
  try {
    const fields = await db.Field.findAll();
    res.status(200).send(fields);
  } catch (err) {
    console.error('Error fetching all fields:', err);
    res.status(500).send('Server error');
  }
};

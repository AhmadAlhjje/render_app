const db = require('../models');

// Get field ID by user ID
exports.getFieldByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    // البحث عن FieldOwner بناءً على user_id
    const fieldOwner = await db.FieldOwner.findOne({ where: { user_id } });

    if (!fieldOwner) {
      return res.status(404).send('Field owner not found for this user');
    }

    // البحث عن الحقل المرتبط بـ field_id
    const field = await db.Field.findByPk(fieldOwner.field_id);

    if (!field) {
      return res.status(404).send('Field not found');
    }

    // إرسال الاستجابة بالـ field_id
    res.status(200).json({ field_id: field.field_id, field_name: field.field_name });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get field owner by ID
exports.getFieldOwner = async (req, res) => {
  try {
    const { id } = req.params;

    // البحث عن FieldOwner بناءً على ID
    const fieldOwner = await db.FieldOwner.findByPk(id);

    if (!fieldOwner) {
      return res.status(404).send('Field owner not found');
    }

    // البحث عن الحقل المرتبط
    const field = await db.Field.findByPk(fieldOwner.field_id);

    // البحث عن المستخدم المرتبط
    const owner = await db.User.findByPk(fieldOwner.user_id);

    // إنشاء استجابة مخصصة تتضمن البيانات المطلوبة
    res.status(200).json({
      id: fieldOwner.id,
      field_id: field ? field.id : null,
      field_name: field ? field.name : null,
      user_id: owner ? owner.id : null,
      user_name: owner ? owner.name : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get all field owners
exports.getAllFieldOwners = async (req, res) => {
  try {
    const fieldOwners = await db.FieldOwner.findAll({
      include: [
        { model: db.Field, as: 'field' },
        { model: db.User, as: 'owner' },
      ],
    });

    res.status(200).json(fieldOwners);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update a field owner
exports.updateFieldOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { field_id, user_id } = req.body;

    const fieldOwner = await db.FieldOwner.findByPk(id);
    if (!fieldOwner) return res.status(404).send('Field owner not found');

    if (field_id) {
      const field = await db.Field.findByPk(field_id);
      if (!field) return res.status(404).send('Field not found');
      fieldOwner.field_id = field_id;
    }

    if (user_id) {
      const user = await db.User.findByPk(user_id);
      if (!user) return res.status(404).send('User not found');
      if (user.user_type !== 'field_owner')
        return res.status(400).send('User is not a field owner');
      fieldOwner.user_id = user_id;
    }

    await fieldOwner.save();
    res.status(200).json(fieldOwner);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Delete a field owner
exports.deleteFieldOwner = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.FieldOwner.destroy({ where: { id } });

    if (!deleted) return res.status(404).send('Field owner not found');

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

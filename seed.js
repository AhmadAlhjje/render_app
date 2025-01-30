const db = require('./models');

const seedData = async () => {
  try {
    // تهيئة قاعدة البيانات
    await db.sequelize.sync({ force: true }); // يمسح الجداول ويعيد إنشاؤها

    // إضافة بيانات إلى جدول المدن
    const cities = await db.City.bulkCreate([
      { name: 'حلب' },
      { name: 'دمشق' },
      { name: 'حمص' },
    ]);

    // إضافة بيانات إلى جدول المناطق
    const regions = await db.Region.bulkCreate([
      { name: 'سيف الدولة', city_id: cities[0].city_id },
      { name: 'الموغامبو', city_id: cities[1].city_id },
      { name: 'العزيزية', city_id: cities[2].city_id },
    ]);

    // إضافة بيانات إلى جدول الملاعب
    const fields = await db.Field.bulkCreate([
      { name: 'النخبة', region_id: regions[0].region_id, image1: 'https://i.pinimg.com/736x/df/f7/9b/dff79b9bbeb327932df9bde125614d7e.jpg' },
      { name: 'الاتحاد', region_id: regions[1].region_id, image1: 'https://i.pinimg.com/736x/66/0a/77/660a7707e97312b16102a637d9852819.jpg' },
      { name: 'الحرية', region_id: regions[2].region_id, image1: 'https://i.pinimg.com/736x/6d/7f/ba/6d7fba9022d11a773a6141fa427c60fc.jpg' },
    ]);

    // إضافة بيانات إلى جدول المستخدمين
    const users = await db.User.bulkCreate([
      { name: 'Ali', email: 'ali@example.com', phone_number: '123456789' },
      { name: 'Sara', email: 'sara@example.com', phone_number: '987654321' },
      { name: 'Omar', email: 'omar@example.com', phone_number: '567890123' },
    ]);

    // إضافة بيانات إلى جدول الحجوزات
    await db.Reservation.bulkCreate([
      { time: '14:00:00', date: '2023-12-25', field_id: fields[0].field_id, user_id: users[0].user_id, price: 150.0 },
      { time: '16:00:00', date: '2023-12-26', field_id: fields[1].field_id, user_id: users[1].user_id, price: 200.0 },
      { time: '18:00:00', date: '2023-12-27', field_id: fields[2].field_id, user_id: users[2].user_id, price: 250.0 },
    ]);

    console.log('Seeding successful!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await db.sequelize.close();
  }
};

seedData();



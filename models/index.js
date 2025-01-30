const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

// Import Sequelize and the database connection
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.City = require('./City')(sequelize, Sequelize);
db.Region = require('./Region')(sequelize, Sequelize);
db.Field = require('./Field')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);
db.Reservation = require('./Reservation')(sequelize, Sequelize);
db.FieldOwner = require('./FieldOwner')(sequelize, Sequelize); // استيراد الموديل الجديد

// Define associations
// City and Region
db.City.hasMany(db.Region, { foreignKey: 'city_id' });
db.Region.belongsTo(db.City, { foreignKey: 'city_id' });

// Region and Field
db.Region.hasMany(db.Field, { foreignKey: 'region_id' });
db.Field.belongsTo(db.Region, { foreignKey: 'region_id' });

// User and Reservation
db.User.hasMany(db.Reservation, { foreignKey: 'user_id' });
db.Reservation.belongsTo(db.User, { foreignKey: 'user_id' });

// Field and Reservation
db.Field.hasMany(db.Reservation, { foreignKey: 'field_id' });
db.Reservation.belongsTo(db.Field, { foreignKey: 'field_id' });

// Field and FieldOwner
db.Field.hasOne(db.FieldOwner, { foreignKey: 'field_id' });
db.FieldOwner.belongsTo(db.Field, { foreignKey: 'field_id' });

// User and FieldOwner
db.User.hasMany(db.FieldOwner, { foreignKey: 'user_id' });
db.FieldOwner.belongsTo(db.User, { foreignKey: 'user_id' });

module.exports = db;

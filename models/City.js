module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
      city_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      }
    },
    {
      timestamps: true,  // ✅ تفعيل التحديث التلقائي لـ createdAt و updatedAt
      tableName: 'cities' // ✅ تحديد اسم الجدول بشكل صريح
    }
  );

  return City;
};

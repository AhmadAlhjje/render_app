module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define('Region', {
    region_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  // إضافة قيمة افتراضية للتاريخ
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  // إضافة قيمة افتراضية للتاريخ
      allowNull: false,
    },
  }, {
    timestamps: true,  // تأكد من أن التواريخ تعمل تلقائيًا
    tableName: 'regions'
  });
  
  return Region;
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      user_type: {
        type: DataTypes.ENUM('regular', 'field_owner', 'site_owner'), // أنواع المستخدمين
        allowNull: false,
        defaultValue: 'regular', // القيمة الافتراضية
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'users',
    }
  );
  return User;
};

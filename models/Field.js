module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define('Field', {
      field_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      region_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image2: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      image3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image4: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      details: {
        type: DataTypes.TEXT, // نوع TEXT لتخزين نص طويل
        allowNull: true, // يمكن أن يكون الحقل اختياريًا
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
      timestamps: false,
      tableName: 'fields',
    }
  );
  return Field;
};

module.exports = (sequelize, DataTypes) => {
    const FieldOwner = sequelize.define('FieldOwner', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        field_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
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
        },
      },
      {
        timestamps: true,
        tableName: 'field_owners',
      }
    );
  
    return FieldOwner;
  };
  
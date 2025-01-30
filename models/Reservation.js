module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
      reservation_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      field_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: true,
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
      tableName: 'reservations',
    }
  );
  return Reservation;
};

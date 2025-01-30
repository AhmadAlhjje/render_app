const db = require('../models');

exports.createReservation = async (req, res) => {
  try {
    const { time, date, field_id,user_id  } = req.body;

    const reservation = await db.Reservation.create({
      time,
      date,
      field_id,
      user_id,
      createdAt: new Date(),  // تأكد من إضافة createdAt و updatedAt إذا لم تكن موجودة في قاعدة البيانات
      updatedAt: new Date(),
    });

    res.status(201).send('Reservation created');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await db.Reservation.findByPk(id, {
      include: [db.User, db.Field],
    });
    if (!reservation) return res.status(404).send('Reservation not found');

    res.status(200).send(reservation);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, field_id, date, time } = req.body;

    const [updated] = await db.Reservation.update(
      { user_id, field_id, date, time },
      { where: { reservation_id: id } }
    );

    if (!updated) return res.status(404).send('Reservation not found');

    res.status(200).send('Reservation updated');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { time , date } = req.body;

    const deleted = await db.Reservation.destroy({ where: { time: time , date:date } });

    if (!deleted) return res.status(404).send('Reservation not found');

    res.status(204).send();
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// (مجررررررب)
exports.getReservationsByField = async (req, res) => {
  try {
    const { field_id } = req.params;

    const reservations = await db.Reservation.findAll({ where: { field_id } });

    res.status(200).send(reservations);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getReservationsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const reservations = await db.Reservation.findAll({ where: { user_id } });

    res.status(200).send(reservations);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

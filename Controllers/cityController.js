const db = require('../models');

// Create a new city
exports.createCity = async (req, res) => {
  try {
    const { name } = req.body;

    const city = await db.City.create({ 
      name,
      createdAt: new Date(),   // تعيين التاريخ الحالي يدويًا
      updatedAt: new Date()
     });

    res.status(201).send('City created');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Get city by ID
exports.getCity = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await db.City.findByPk(id);
    if (!city) return res.status(404).send('City not found');

    res.status(200).send(city);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Get all cities
exports.getAllCities = async (req, res) => {
  try {
    const cities = await db.City.findAll();
    res.status(200).json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update a city
exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const [updated] = await db.City.update({ name }, { where: { city_id: id } });

    if (!updated) return res.status(404).send('City not found');

    res.status(200).send('City updated');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Delete a city
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.City.destroy({ where: { city_id: id } });

    if (!deleted) return res.status(404).send('City not found');

    res.status(204).send();
  } catch (err) {
    res.status(500).send('Server error');
  }
};

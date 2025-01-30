const db = require('../models');

// Create a new region
exports.createRegion = async (req, res) => {
  try {
    const { name, city_name } = req.body;

    // البحث عن المدينة باستخدام اسم المدينة
    const city = await db.City.findOne({ where: { name: city_name } });

    if (!city) {
      return res.status(404).send('City not found');
    }

    const region = await db.Region.create({
      name, 
      city_id: city.city_id, 
      createdAt: new Date(),   // تعيين التاريخ الحالي يدويًا
      updatedAt: new Date()    // تعيين التاريخ الحالي يدويًا
    });

    res.status(201).send('Region created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};



// Get a region by ID
exports.getRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await db.Region.findByPk(id);
    if (!region) return res.status(404).send('Region not found');

    res.status(200).json(region);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get all regions
exports.getAllRegions = async (req, res) => {
  try {
    const regions = await db.Region.findAll();

    res.status(200).json(regions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update a region
exports.updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city_id } = req.body;

    const [updated] = await db.Region.update({ name, city_id }, { where: { region_id: id } });

    if (!updated) return res.status(404).send('Region not found');

    res.status(200).send('Region updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Delete a region
exports.deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.Region.destroy({ where: { region_id: id } });

    if (!deleted) return res.status(404).send('Region not found');

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

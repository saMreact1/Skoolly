const School = require('../models/school.model');

exports.createSchool = async (req, res) => {
  try {
    const { name, address, schoolEmail, schoolPhone, logo } = req.body;

    const school = new School({
      name,
      address,
      schoolEmail,
      schoolPhone,
      logo,
      createdBy: req.user.id,
      tenantId: req.user.tenantId
    });

    await school.save();
    res.status(201).json({ message: 'School created successfully', school });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSchool = async (req, res) => {
  try {
    const school = await School.findOne({ tenantId: req.user.tenantId });
    if (!school) return res.status(404).json({ message: 'School not found' });

    res.json(school);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /schools/name/:name
exports.getSchoolByName = async (req, res) => {
  const { name } = req.params;
  const school = await School.findOne({ name });
  if (!school) return res.status(404).json({ message: 'School not found' });
  res.status(200).json(school);
};

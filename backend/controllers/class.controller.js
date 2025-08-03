const Class = require('../models/class.model');
const School = require('../models/school.model');

// GET all classes for the logged-in user's tenant (school)
exports.getClasses = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ message: 'Missing tenant ID' });
    }

    const classes = await Class.find({ tenantId });
    res.json(classes);
  } catch (error) {
    console.error('❌ Error getting classes:', error);
    res.status(500).json({ message: 'Server error fetching classes' });
  }
};

// CREATE a new class
exports.createClass = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ message: 'Missing tenant ID' });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Class name is required' });
    }

    const newClass = new Class({
      name,
      tenantId
    });

    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    console.error('❌ Error creating class:', error);
    res.status(500).json({ message: 'Server error creating class' });
  }
};

// GET classes by school name (for pre-registration lookup)
exports.getClassesByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const classes = await Class.find({ schoolId: tenantId }); // 👈 this line is key
    res.status(200).json(classes);
  } catch (err) {
    console.error('❌ Error fetching classes by tenant:', err);
    res.status(500).json({ message: 'Server error fetching classes.' });
  }
};
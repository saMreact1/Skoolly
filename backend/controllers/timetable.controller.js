const Timetable = require('../models/timetable.model');

exports.saveTimetable = async (req, res) => {
  try {
    const { classId, grid } = req.body;
    if (!classId || !grid) {
      return res.status(400).json({ message: 'classId and grid are required' });
    }

    const updated = await Timetable.findOneAndUpdate(
      { classId },
      { $set: { grid } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ message: 'Timetable saved', data: updated });
  } catch (err) {
    console.error('saveTimetable error:', err);
    return res.status(500).json({ message: 'Server error saving timetable' });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const { classId } = req.params;

    const doc = await Timetable.findOne({ classId });
    return res.json({ data: doc ? doc.grid : {} });
  } catch (err) {
    console.error('getTimetable error:', err);
    return res.status(500).json({ message: 'Server error fetching timetable' });
  }
};

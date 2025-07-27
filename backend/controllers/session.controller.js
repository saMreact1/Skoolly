const Session = require('../models/session.model');


exports.createSession = async (req, res) => {
  const { name, startDate, endDate } = req.body;
  const { tenantId } = req.user;

  try {
    const session = await Session.create({
      name,
      startDate,
      endDate,
      tenantId // ← This is the fix right here
    });

    res.status(201).json(session);
  } catch (err) {
    console.error('[CREATE SESSION ERROR]', err);
    res.status(400).json({ message: 'Failed to create session', error: err.message });
  }
};


exports.getSessions = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;

        const sessions = await Session.find({ tenantId }).sort({ createdAt: -1 });

        res.status(200).json({ sessions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

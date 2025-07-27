const Term = require('../models/term.model');

exports.createTerm = async (req, res) => {
    try {
        const { name, sessionId } = req.body;
        const tenantId = req.user.id; // or req.user.tenantId, if you're storing it separately

        const term = new Term({ name, sessionId, tenantId });
        await term.save();

        res.status(201).json({ message: 'Term created successfully', term });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getTerms = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const terms = await Term.find({ tenantId }).populate('sessionId').sort({ createdAt: -1 });

    res.status(200).json({ terms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

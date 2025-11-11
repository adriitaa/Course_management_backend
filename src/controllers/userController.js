const User = require('../models/User');

async function getMe(req, res) {
  res.json({ user: req.user });
}

async function updateMe(req, res) {
  try {
    const allowed = ['name', 'phoneNumber'];
    const updates = {};
    for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
      select: '-password',
    });
    res.json({ user });
  } catch {
    res.status(500).json({ message: 'Update failed' });
  }
}

module.exports = { getMe, updateMe };

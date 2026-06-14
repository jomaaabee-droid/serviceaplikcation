const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Sjukanmäl mig
router.post('/report', auth, async (req, res) => {
  const { sickUntil } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { isSick: true, sickUntil: sickUntil || null },
    { new: true }
  ).select('-password');
  res.json(user);
});

// Friskskriv mig
router.post('/recover', auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { isSick: false, sickUntil: null },
    { new: true }
  ).select('-password');
  res.json(user);
});

// Hämta sjuka i företaget
router.get('/', auth, async (req, res) => {
  const sick = await User.find({ company: req.user.company, isSick: true }).select('name sickUntil');
  res.json(sick);
});

module.exports = router;

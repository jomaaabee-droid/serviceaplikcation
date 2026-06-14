const router = require('express').Router();
const auth = require('../middleware/auth');
const Company = require('../models/Company');
const User = require('../models/User');

// Hämta eget företag
router.get('/me', auth, async (req, res) => {
  const company = await Company.findById(req.user.company);
  res.json(company);
});

// Lägg till anställd
router.post('/employees', auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password, company: req.user.company, role: 'employee' });
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Hämta alla anställda i företaget
router.get('/employees', auth, async (req, res) => {
  const users = await User.find({ company: req.user.company }).select('-password');
  res.json(users);
});

module.exports = router;

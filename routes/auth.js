const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const sign = (user) => jwt.sign(
  { id: user._id, role: user.role, company: user.company },
  process.env.JWT_SECRET || 'hemligt',
  { expiresIn: '7d' }
);

// Registrera företag + ägare
router.post('/register', async (req, res) => {
  try {
    const { companyName, name, email, password } = req.body;
    const company = await Company.create({ name: companyName, email });
    const user = await User.create({ name, email, password, company: company._id, role: 'owner' });
    res.json({ token: sign(user), user: { id: user._id, name, role: 'owner' } });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Logga in
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ error: 'Fel email eller lösenord' });
    res.json({ token: sign(user), user: { id: user._id, name: user.name, role: user.role } });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;

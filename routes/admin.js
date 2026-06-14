const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Company = require('../models/Company');
const SupportMessage = require('../models/SupportMessage');

// Middleware – endast owner eller superadmin
const adminOnly = (req, res, next) => {
  if (!['owner', 'superadmin'].includes(req.user.role))
    return res.status(403).json({ error: 'Ej behörig' });
  next();
};

const superOnly = (req, res, next) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Ej behörig' });
  next();
};

// Översikt – alla anställda + status
router.get('/overview', auth, adminOnly, async (req, res) => {
  const users = await User.find({ company: req.user.company }).select('-password');
  const company = await Company.findById(req.user.company);
  res.json({ company, users });
});

// Superadmin – lista alla företag
router.get('/companies', auth, superOnly, async (req, res) => {
  const companies = await Company.find().sort({ createdAt: -1 });
  res.json(companies);
});

// Superadmin – aktivera företag
router.post('/companies/:id/activate', auth, superOnly, async (req, res) => {
  await Company.findByIdAndUpdate(req.params.id, {
    subscriptionActive: true,
    paymentPending: false,
    subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  });
  res.json({ ok: true });
});

// Superadmin – hämta alla support-meddelanden
router.get('/support', auth, superOnly, async (req, res) => {
  const msgs = await SupportMessage.find().populate('company', 'name email').sort({ createdAt: -1 });
  res.json(msgs);
});

// Superadmin – svara på support
router.post('/support/:id/reply', auth, superOnly, async (req, res) => {
  const msg = await SupportMessage.findByIdAndUpdate(
    req.params.id,
    { reply: req.body.reply, repliedAt: new Date() },
    { new: true }
  );
  res.json(msg);
});

// Företag – skicka support-meddelande
router.post('/support', auth, async (req, res) => {
  const msg = await SupportMessage.create({
    company: req.user.company,
    content: req.body.content
  });
  res.json(msg);
});

// Företag – hämta sina egna support-meddelanden
router.get('/support/mine', auth, async (req, res) => {
  const msgs = await SupportMessage.find({ company: req.user.company }).sort({ createdAt: -1 });
  res.json(msgs);
});

// Chatta med Mistral (lokal Ollama)
router.post('/ai', auth, adminOnly, async (req, res) => {
  try {
    const { message } = req.body;
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:7b',
        messages: [{ role: 'user', content: message }],
        stream: false
      })
    });
    const data = await response.json();
    res.json({ reply: data.message?.content || 'Inget svar' });
  } catch (e) {
    res.status(500).json({ error: 'AI ej tillgänglig: ' + e.message });
  }
});

module.exports = router;

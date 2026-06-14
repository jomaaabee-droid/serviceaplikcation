const router = require('express').Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// Hämta meddelanden (till mig eller hela företaget)
router.get('/', auth, async (req, res) => {
  const msgs = await Message.find({
    company: req.user.company,
    $or: [{ to: req.user.id }, { to: null }]
  }).populate('from', 'name').sort({ createdAt: -1 }).limit(50);
  res.json(msgs);
});

// Skicka meddelande
router.post('/', auth, async (req, res) => {
  try {
    const msg = await Message.create({
      company: req.user.company,
      from: req.user.id,
      to: req.body.to || null,
      content: req.body.content
    });
    res.json(msg);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;

const router = require('express').Router();
const auth = require('../middleware/auth');
const Income = require('../models/Income');

router.get('/', auth, async (req, res) => {
  const entries = await Income.find({ company: req.user.company }).sort({ date: -1 });
  res.json(entries);
});

router.post('/', auth, async (req, res) => {
  const entry = await Income.create({ ...req.body, company: req.user.company, createdBy: req.user.id });
  res.json(entry);
});

router.delete('/:id', auth, async (req, res) => {
  await Income.findOneAndDelete({ _id: req.params.id, company: req.user.company });
  res.json({ ok: true });
});

module.exports = router;

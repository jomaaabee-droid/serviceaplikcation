const router = require('express').Router();
const auth = require('../middleware/auth');
const Reminder = require('../models/Reminder');

router.get('/', auth, async (req, res) => {
  const reminders = await Reminder.find({ company: req.user.company, user: req.user.id, done: false })
    .sort({ dueDate: 1 });
  res.json(reminders);
});

router.post('/', auth, async (req, res) => {
  const r = await Reminder.create({ ...req.body, company: req.user.company, user: req.user.id });
  res.json(r);
});

router.put('/:id/done', auth, async (req, res) => {
  const r = await Reminder.findByIdAndUpdate(req.params.id, { done: true }, { new: true });
  res.json(r);
});

router.delete('/:id', auth, async (req, res) => {
  await Reminder.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;

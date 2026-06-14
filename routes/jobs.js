const router = require('express').Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

// Hämta alla jobb för företaget
router.get('/', auth, async (req, res) => {
  const jobs = await Job.find({ company: req.user.company }).populate('assignedTo', 'name');
  res.json(jobs);
});

// Skapa jobb
router.post('/', auth, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, company: req.user.company, createdBy: req.user.id });
    res.json(job);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Uppdatera jobb (status, tilldela etc)
router.put('/:id', auth, async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, company: req.user.company },
    req.body,
    { new: true }
  );
  res.json(job);
});

// Ta bort jobb
router.delete('/:id', auth, async (req, res) => {
  await Job.findOneAndDelete({ _id: req.params.id, company: req.user.company });
  res.json({ ok: true });
});

module.exports = router;

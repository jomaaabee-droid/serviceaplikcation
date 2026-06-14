const router = require('express').Router();
const auth = require('../middleware/auth');
const Company = require('../models/Company');

const PAYMENT_INFO = {
  swish: '0705116615',
  iban: 'DE09202208000029211558',
  amount: 300,
  message: 'Prenumeration 300kr/mån'
};

// Hämta betalningsinformation
router.get('/info', auth, async (req, res) => {
  res.json(PAYMENT_INFO);
});

// Företag meddelar att de betalat – väntar på manuell bekräftelse
router.post('/notify', auth, async (req, res) => {
  await Company.findByIdAndUpdate(req.user.company, { paymentPending: true });
  res.json({ message: 'Tack! Din betalning granskas och aktiveras inom 24h.' });
});

// Du (admin) aktiverar prenumeration manuellt
router.post('/activate/:companyId', async (req, res) => {
  const { adminKey } = req.body;
  if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Ej behörig' });
  await Company.findByIdAndUpdate(req.params.companyId, {
    subscriptionActive: true,
    paymentPending: false,
    subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  });
  res.json({ ok: true });
});

module.exports = router;

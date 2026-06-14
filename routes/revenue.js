const router = require('express').Router();
const auth = require('../middleware/auth');
const Company = require('../models/Company');

// Hämta intäktsöversikt (totalt antal aktiva prenumeranter)
router.get('/overview', async (req, res) => {
  const { adminKey } = req.query;
  if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Ej behörig' });

  const Company = require('../models/Company');
  const active = await Company.countDocuments({ subscriptionActive: true });
  const pending = await Company.countDocuments({ paymentPending: true, subscriptionActive: false });
  const all = await Company.find({}, 'name subscriptionActive subscriptionEnd paymentPending createdAt');

  res.json({
    activeCount: active,
    pendingCount: pending,
    monthlyRevenue: active * 300,
    yearlyRevenue: active * 300 * 12,
    companies: all
  });
});

module.exports = router;

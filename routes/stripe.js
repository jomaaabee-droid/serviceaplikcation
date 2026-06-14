const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const Company = require('../models/Company');

// Skapa checkout för 12-månaders prenumeration
router.post('/checkout', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'sek',
          product_data: { name: '12-månaders företagsprenumeration' },
          unit_amount: 99900, // 999 kr/mån i ören
          recurring: { interval: 'month', interval_count: 12 }
        },
        quantity: 1
      }],
      customer_email: company.email,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Stripe webhook – aktivera prenumeration
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send('Webhook-fel');
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await Company.findOneAndUpdate(
      { email: session.customer_email },
      {
        subscriptionActive: true,
        subscriptionId: session.subscription,
        subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    );
  }
  res.json({ received: true });
});

module.exports = router;

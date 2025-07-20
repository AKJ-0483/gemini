const subscriptionService = require("../services/subscriptionService");

require("dotenv").config();

exports.subscribePro = async (req, res) => {
  try {
    const url = await subscriptionService.createStripeSession(req.user.id);
    res.status(200).json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  try {
    event = await stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    await subscriptionService.activateSubscription(event.data.object);
  }

  res.status(200).json({ received: true });
};

exports.getStatus = async (req, res) => {
  try {
    const status = await subscriptionService.getSubscriptionStatus(req.user.id);
    res.status(200).json({ tier: status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

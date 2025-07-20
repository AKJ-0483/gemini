const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { AppDataSource } = require("../data-source");

const subscriptionRepo = AppDataSource.getRepository("Subscription");

exports.createStripeSession = async (userId) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata: { userId },
  });

  return session.url;
};

exports.activateSubscription = async (session) => {
  const userId = session.metadata.userId;
  const stripeCustomerId = session.customer;

  const sub = subscriptionRepo.create({
    stripeSessionId: session.id,
    stripeCustomerId,
    isActive: true,
    user: { id: userId },
  });

  await subscriptionRepo.save(sub);
};

exports.getSubscriptionStatus = async (userId) => {
  const sub = await subscriptionRepo.findOneBy({ user: { id: userId } });
  return sub?.isActive ? "Pro" : "Basic";
};

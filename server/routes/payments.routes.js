const { Router } = require("express");
const stripe = require("stripe")(process.env.STRIPE_PUBLISHABLE);
const router = Router();

router.post("/", async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 10,
    currency: "eur",
  });
  res.send({
      clientSecret: paymentIntent.client_secret
  });
});

module.exports = router;

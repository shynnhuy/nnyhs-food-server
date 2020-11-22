const stripeSecret =
  "sk_test_51HpaMfDXe7CZVgBq6yzz2oAJ25pShYSdhqM99N4zabkprKjWohYrCEq1UHu3DMeAlXHEBCRwPcmVvdGDaqFSt0ZW00sS58IsNz";
const stripe = require("stripe")(stripeSecret);

module.exports = {
  async Pay(req, res) {
    const { email } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 50000,
        currency: "vnd",
        metadata: { integration_check: "accept_a_payment" },
        receipt_email: email,
      });

      res.json(paymentIntent);
    } catch (error) {
      res.json({ message: "error ", error });
    }
  },
};

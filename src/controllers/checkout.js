const stripeSecret =
  "sk_test_51HpaMfDXe7CZVgBq6yzz2oAJ25pShYSdhqM99N4zabkprKjWohYrCEq1UHu3DMeAlXHEBCRwPcmVvdGDaqFSt0ZW00sS58IsNz";
const stripe = require("stripe")(stripeSecret);
const { getDistrict } = require("../helpers");

module.exports = {
  async Pay(req, res) {
    const { items, total, customer, shipping, payment } = req.body;
    console.log(body);
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "vnd",
        metadata: { integration_check: "accept_a_payment" },
        payment_method_types: ["card"],
        receipt_email: email,
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.json({ message: "error ", error });
    }
  },

  GetDistrict(req, res) {
    const district = getDistrict();
    const { ward } = req.query;
    if (ward) {
      const wardList = district.find(
        (d) => d.slug === ward.trim().toLowerCase()
      );
      return res.json(wardList["xa-phuong"]);
    }
    return res.json(district);
  },
};

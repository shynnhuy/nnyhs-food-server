const express = require("express");
const router = express.Router();
const CheckoutCrtl = require("../controllers/checkout");

router.post("/pay", CheckoutCrtl.Pay);

module.exports = router;

const express = require("express");
const router = express.Router();

const ShopCtrl = require("../controllers/shop");
const checkAuth = require("../middlewares/checkAuth");

// router.get("/requests", checkAuth, ShopCtrl.GetAllRequest);
// router.get("/request/:id", checkAuth, ShopCtrl.GetRequest);
// router.post("/request", checkAuth, ShopCtrl.CreateRequest);
// router.patch("/request/:id", checkAuth, ShopCtrl.ChangeRequestStatus);

router.get("/", checkAuth, ShopCtrl.GetAllShop);
router.post("/", checkAuth, ShopCtrl.CreateShop);
router.get("/products", ShopCtrl.GetShopProducts);
router.get("/:id", checkAuth, ShopCtrl.GetShop);
router.patch("/:id", checkAuth, ShopCtrl.ChangeShopStatus);

module.exports = router;

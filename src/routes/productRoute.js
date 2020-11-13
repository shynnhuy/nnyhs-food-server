const express = require("express");
const router = express.Router();

const ProductCrtl = require("../controllers/product");
const checkAuth = require("../middlewares/checkAuth");
const checkRole = require("../middlewares/checkRole");
const { Administrator } = require("../helpers/Role");

const upload = require("../utils/multer");

// const upload = multer({ storage: storage, fileFilter: imageFilter });

// route.post("/addImage", upload.single("image"), ProductCrtl.addImage);

router.get("/category", ProductCrtl.GetCategory);

router.post(
  "/createCategory",
  upload.single("image"),
  ProductCrtl.CreateCategory
);

router.get("/", ProductCrtl.GetAllProducts);

router.post("/create", upload.single("image"), ProductCrtl.CreateProduct);

module.exports = router;

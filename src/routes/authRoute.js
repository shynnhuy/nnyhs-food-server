const express = require("express");
const router = express.Router();

const AuthCrtl = require("../controllers/auth");

const checkAuth = require("../middlewares/checkAuth");

router.post("/register", AuthCrtl.Register);
router.post("/login", AuthCrtl.Login);
router.get("/roles", AuthCrtl.GetRoles);
router.post("/checkToken", AuthCrtl.CheckToken);
router.post("/refreshToken", AuthCrtl.RefreshToken);

router.patch("/userData", checkAuth, AuthCrtl.ChangeUserData);
router.get("/userData", checkAuth, AuthCrtl.GetUserData);
router.post("/createRole", checkAuth, AuthCrtl.CreateRole);
router.get("/users", checkAuth, AuthCrtl.GetAllUsers);

module.exports = router;

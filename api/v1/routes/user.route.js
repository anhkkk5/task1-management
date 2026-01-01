const express = require("express");

const {
  index,
  register,
  login,
  forgotPassword,
  otpPassword,
  resetPassword,
  detail,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
router.get("/", index);
router.post("/register", register);
router.post("/login", login);
router.post("/password/forgot", forgotPassword);
router.post("/password/otp", otpPassword);
router.post("/password/reset", resetPassword);
router.get("/detail", authMiddleware.requireAuth, detail);
module.exports = router;

const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotpassword,
  resetpassword,
  addClient,
  roles,
  protect,
  readClient,
} = require("../controllers/auth");

router.route("/main").get(protect);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/forgotpassword").post(forgotpassword);

router.route("/resetpassword/:resetToken").put(resetpassword);

router.route("/new").post(addClient);

router.route("/clients").get(readClient);

module.exports = router;

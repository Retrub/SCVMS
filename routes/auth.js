const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotpassword,
  resetpassword,
  addClient,
  protect,
  readClients,
  readClient,
  deleteClient,
  updateClient,
} = require("../controllers/auth");

router.route("/main").get(protect);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/forgotpassword").post(forgotpassword);

router.route("/resetpassword/:resetToken").put(resetpassword);

router.route("/new").post(addClient);

router.route("/clients").get(readClients);

router.route("/clients-update/:id").get(readClient);

router.route("/clients/:id").delete(deleteClient);

router.route("/clients/:id").put(updateClient);

module.exports = router;

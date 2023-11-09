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
  entryClient,
  exitClient,
  readEntries,
  dashboardInfo,
} = require("../controllers/auth");

router.route("/main").get(protect);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/forgotpassword").post(forgotpassword);

router.route("/resetpassword/:resetToken").put(resetpassword);

router.route("/new").post(addClient);

router.route("/clients").get(readClients);

router.route("/read/:id").get(readClient);

router.route("/client/delete/:id").delete(deleteClient);

router.route("/client/update/:id").put(updateClient);

router.route("/clients/entry/:id").post(entryClient);

router.route("/clients/exit/:id").post(exitClient);

router.route("/clients/entries").get(readEntries);

router.route("/main/dashboard").get(dashboardInfo);

module.exports = router;

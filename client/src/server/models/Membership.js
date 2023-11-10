const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration_months: {
    type: Number,
    unique: true,
    required: [true, "Reikia pasirinkti laikotarpį"],
  },
});

const Membership = mongoose.model("Membership", membershipSchema);

module.exports = Membership;

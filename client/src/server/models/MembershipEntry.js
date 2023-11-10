const mongoose = require("mongoose");

const membershipEntrySchema = new mongoose.Schema({
  client_id: {
    type: String,
    required: true,
  },
  membership_id: {
    type: String,
    required: true,
  },
  membership_type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const MembershipEntry = mongoose.model(
  "MembershipEntry",
  membershipEntrySchema
);

module.exports = MembershipEntry;

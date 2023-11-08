const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  surname: {
    type: String,
    required: [true, "Please provide a surname"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide a  email"],
    match: [
      /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
      "Please provide a valid email",
    ],
  },
  city: {
    type: String,
  },
  birth: {
    type: String,
  },
  join_date: {
    type: Date,
  },
  duration: {
    type: Number,
    required: [true, "Please provide a username"],
  },
  valid_until: {
    type: Date,
  },
  status: {
    type: String,
  },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;

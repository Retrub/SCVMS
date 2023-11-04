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
    required: [true, "Please provide a  city"],
  },
  birth: {
    type: String,
    required: [true, "Please provide a  birth"],
  },
  join_date: {
    type: String,
    required: [true, "Please provide a username"],
  },
  sport_plan: {
    type: String,
    required: [true, "Please provide a username"],
  },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;

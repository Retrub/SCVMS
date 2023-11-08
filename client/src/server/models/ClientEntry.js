const mongoose = require("mongoose");

const clientEntrySchema = new mongoose.Schema({
  clientId: {
    type: String,
  },
  entryTime: {
    type: Date,
  },
  exitTime: {
    type: Date,
  },
});

const ClientEntry = mongoose.model("ClientEntry", clientEntrySchema);

module.exports = ClientEntry;

const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleName: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Role", roleSchema);
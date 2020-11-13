const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  identityCard: { type: String, required: true },
  categories: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  status: {
    type: String,
    enum: ["pending", "approval", "denied"],
    default: "pending",
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Shop", shopSchema);

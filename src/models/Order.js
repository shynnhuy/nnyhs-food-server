const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  items: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    required: true,
  },
  total: { type: Number, required: true },
  customer: { type: Object, required: true },
});

module.exports = mongoose.model("Category", orderSchema);

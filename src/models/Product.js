const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    shipping: { type: Boolean },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

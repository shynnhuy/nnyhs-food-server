const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model("Category", categorySchema);

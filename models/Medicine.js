const mongoose = require("mongoose");
const medicineSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  price: { type: Number, default: 0 },
  description: { type: String, default: "" },
});
module.exports = mongoose.model("Medicine", medicineSchema);

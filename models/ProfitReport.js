const mongoose = require("mongoose");
const Profit = new mongoose.Schema({
  name: { type: String, default: "" },
  pId: { type: String, default: "" },
  qty: { type: Number, default: "" },
  grandTotal: { type: Number },
  productCost: { type: Number },
  date: { type: Date },
},
{ timestamps: true }
);
module.exports = mongoose.model("Profit", Profit);

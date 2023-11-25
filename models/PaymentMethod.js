const mongoose = require("mongoose");
const paymentMethodSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);

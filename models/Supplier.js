const mongoose = require("mongoose");
const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    productIds: { type: [String], default: "" },
    returnDue: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    purchaseDue: { type: Number, default: 0 },
    purchaseTotal: { type: Number, default: 0 },
    invoiceNo: { type: String },

  },
  { timestamps: true }
);
module.exports = mongoose.model("Supplier", supplierSchema);

const mongoose = require("mongoose");
const purReportSchema = new mongoose.Schema(
  {
    supplierId: { type: String, ref: "Supplier" },
    wareHouseId: { type: String, ref: "WareHouse" },
    // grandTotal: { type: Number, required: true },
    // paidAmount: { type: Number, default: 0 },
    // dueAmount: { type: Number, default: 0 },
    // status: { type: String, default: "Unpaid" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("PurchaseReport", purReportSchema);

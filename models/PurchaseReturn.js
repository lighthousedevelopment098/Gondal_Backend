const mongoose = require("mongoose");
const purchaseReturnSchema = new mongoose.Schema(
  {
    supplierId: { type: String, default: "" },
    warehouseId: { type: String, default: "" },
    returnQty: { type: Number, default: 0 },
    setDate: { type: String, required: [true, "please provide an date"] },
    product: { type: {} },
  },
  { timestamps: true }
);
module.exports = mongoose.model("PurchaseReturn", purchaseReturnSchema);

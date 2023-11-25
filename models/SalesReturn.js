const mongoose = require("mongoose");
const salesReturnSchema = new mongoose.Schema(
  {
    customerId: { type: String, default: "" },
    warehouseId: { type: String, default: "" },
    returnQty: { type: Number, default: 0 },
    product: { type: {} },
    setDate: { type: String, },
    // setDate: { type: String, required: [true, "please provide an date"] },
  },
  { timestamps: true }
);
module.exports = mongoose.model("SalesReturn", salesReturnSchema);

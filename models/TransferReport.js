const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema(
  {
    fromWareHouseId: { type: String, ref: "WareHouse" },
    fromWareHouseName: { type: String, default: "" },
    toWareHouseId: { type: String, ref: "WareHouse" },
    toWareHouseName: { type: String, default: "" },
    productIds: { type: String, ref: "Product" },
    qty: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("TransferReport", reportSchema);

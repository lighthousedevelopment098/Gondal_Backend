const mongoose = require("mongoose");
const StockSchema = new mongoose.Schema(
    {
        productId: { type: String, ref: "product" },
        warehouseId: { type: String, ref: "WareHouse" },
        qty: Number,
    },
    { timestamps: true }
);
module.exports = mongoose.model("StockReport", StockSchema);

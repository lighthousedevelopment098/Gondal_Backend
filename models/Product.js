const mongoose = require("mongoose");
const Warehouse = require("../models/Ware-House")
const productSchema = new mongoose.Schema(
  {
    productName: { type: String, default: "" }, //
    productCode: { type: String, default: "pcode-" + Math.floor(Math.random() * 10000) },
    group: { type: mongoose.ObjectId, ref: "Group" },
    category: { type: mongoose.ObjectId, ref: "Category" },
    brand: { type: String, default: "" },
    imageUrl: { type: String, default: "" }, //
    details: { type: String, default: "" },
    productCost: { type: Number, default: 0 },
    productPrice: { type: Number, default: 0 }, //
    unitSale: { type: String, default: "" },
    unitProduct: { type: String, default: "" },
    unitPurchase: { type: String, default: "" },
    quantity: { type: Number, default: 0 }, //
    stockAlert: { type: Number },
    warehouse: [{ type: String, ref: "WareHouse" }],
    stockDetail: [{
      warehouseId: String,
      warehouseName: String,
      qty: Number
    }],
    supplier: { type: String, ref: "Supplier" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);

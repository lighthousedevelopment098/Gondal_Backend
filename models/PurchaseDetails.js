const mongoose = require("mongoose");
const purchaseSchema = new mongoose.Schema(
  {
    productName: { type: String, default: "" }, //
    productId: { type: String, default: "" }, //
    group: { type: mongoose.ObjectId, ref: "Group" },
    imageUrl: { type: String, default: "" }, //
    productCost: { type: Number, default: 0 },
    productPrice: { type: Number, default: 0 }, //
    unitProduct: { type: String, default: "" },
    quantity: { type: Number, default: 0 }, //
    whQty: { type: Number, default: 0 }, //
    setDate: { type: String },
    wh: { type: String, default: "" },
    warehouse: { type: String, ref: "WareHouse" },
    supplier: { type: String, ref: "Supplier" },
    // grandTotal: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    due: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    invoiceNo: { type: String },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Partial"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("PurchaseDetail", purchaseSchema);

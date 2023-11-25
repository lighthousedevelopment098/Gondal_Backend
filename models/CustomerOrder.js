const mongoose = require("mongoose");
const customerOrderSchema = new mongoose.Schema(
  {
    customerId: { type: String, ref: "Customer" },
    warehouseId: { type: String, ref: "WareHouse" },
    invoiceNo: { type: String, default: Date.now() },
    shipping: { type: Number, default: 0 },
    // productPrice: { type: Number, required: true },
    productCost: { type: Number, required: true },
    grandTotal: { type: Number, required: true },

    paid: { type: Number, default: 0 },
    due: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Partial"],
      default: "Paid",
    },
    setDate: { type: String, required: [true, "please provide an date"] },
    productDetail: [
      //   {
      //     proId: { type: String },
      //     proPrice: { type: Number, default: 0 },
      //     groupId: { type: String, default: "" },
      //     cartQty: { type: Number, default: 0 },
      //   },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerOrder", customerOrderSchema);

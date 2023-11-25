const mongoose = require("mongoose");
const permissionsSchema = new mongoose.Schema(
  {
    //     dashboard: { type: Boolean, default: false },
    //     /* users: {
    //     viewUser: { type: Boolean, default: false },
    //     addEdit: { type: Boolean, default: false },
    //     editUser: { type: Boolean, default: false },
    //     deleteProduct: { type: Boolean, default: false },
    //   },*/
    userRole: { type: String, default: "" },
    userId: { type: String, default: "" },
    description: { type: String, default: "" },
    allObject: { type: {}, default: "" },
    //     users: { type: {}, default: "" },
    //     products: { type: {}, default: "" },
    //     /*products: {
    //     viewProduct: { type: Boolean, default: false },
    //     addProduct: { type: Boolean, default: false },
    //     editProduct: { type: Boolean, default: false },
    //     deleteProduct: { type: Boolean, default: false },
    //     printLable: { type: Boolean, default: false },
    //   },
    // */
    //     // products:[{viewProduct:false,addProduct:false,editProduct:false,deleteProduct:false,printLable:false}],
    //     group: { type: Boolean, default: false },
    //     brand: { type: Boolean, default: false },
    //     unit: { type: Boolean, default: false },
    //     warehouse: { type: Boolean, default: false },
    //     adjustmenst: { type: {}, default: "" },
    //     transfers: { type: {}, default: "" },
    //     sales: { type: {}, default: "" },
    //     purchases: { type: {}, default: "" },
    //     quotations: { type: {}, default: "" },
    //     salesReturn: { type: {}, default: "" },
    //     purchasesReturn: { type: {}, default: "" },
    //     sellPayment: { type: {}, default: "" },
    //     purchasePayment: { type: {}, default: "" },
    //     sellReturnPayment: { type: {}, default: "" },
    //     purchaseReturnPayment: { type: {}, default: "" },
    //     client: { type: {}, default: "" },
    //     supplier: { type: {}, default: "" },
    //     accounting: { type: {}, default: "" },
    //     settings: { type: {}, default: "" },
    //     reports: { type: {}, default: "" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Permissions", permissionsSchema);

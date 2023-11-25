const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema({
  brandName: { type: String, default: "" },
  brandDetail: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
});
module.exports = mongoose.model("Brand", brandSchema);

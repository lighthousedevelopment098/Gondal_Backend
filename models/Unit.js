const mongoose = require("mongoose");
const unitSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  shortName: { type: String, default: "" },
  baseUnit: { type: String, default: "" },
});
module.exports = mongoose.model("Unit", unitSchema);

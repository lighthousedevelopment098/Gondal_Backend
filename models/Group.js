const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  grpCode: { type: String, default: "" },
  grpName: { type: String, default: "" },
});
module.exports = mongoose.model("Group", categorySchema);

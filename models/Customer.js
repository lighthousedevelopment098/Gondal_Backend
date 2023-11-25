const mongoose = require("mongoose");
const validator = require("validator");
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    city: { type: String, default: "" },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Email format is invalid",
      },
      default: "",
    },
    imageUrl: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Customer", customerSchema);

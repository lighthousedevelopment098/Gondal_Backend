const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "username must be provided"] },
    country: { type: String },
    city: { type: String },
    phone: { type: String },
    productIds: [
      {
        proId: { type: String, ref: "product" },
        groupId: { type: String },
        qty: { type: Number, default: 0 },

      },
    ],
    email: {
      type: String,
      unique: true,
      required: [true, "email must be provided"],
      validate: {
        validator: validator.isEmail,
        message: "Email format is invalid",
      },
    },
    password: { type: String, required: [true, "password must be provided"] },
    zipCode: { type: String },
  },
  { timestamps: true }
);

warehouseSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

warehouseSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("WareHouse", warehouseSchema);

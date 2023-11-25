const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, "username must be provided"] },
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
    status: { type: String, enum: ["Active", "Inactive"], default: "Inactive" },
    role: { type: String, default: "user" },
    imageUrl: { type: String, default: "" },
    warehouseId: { type: String, default: "" },
    permissionsId: { type: String, ref: "Permissions" },
  },
  { timestamps: true }
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", userSchema);

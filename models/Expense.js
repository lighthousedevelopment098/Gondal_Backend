const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number },
  description: { type: String },
  createAt: {type: String}
}, {
  timestamps: true
});

module.exports = mongoose.model("Expense", ExpenseSchema);

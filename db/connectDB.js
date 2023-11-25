const mongoose = require("mongoose");
const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    return console.log("DB connected...");
  } catch (error) {
    return console.log(`DB Connection Error: ${error}`);
  }
};
module.exports = connectDB;

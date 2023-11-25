const path = require("path");
const multer = require("multer");
const fsPromises = require("fs").promises;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
const deleteImageFromLocal = async (fileName) => {
  try {
    await fsPromises.unlink(path.join("./", "uploads", fileName));
    return true;
  } catch (error) {
    console.log(`error: ${error}`);
  }
};
module.exports = { upload, deleteImageFromLocal };

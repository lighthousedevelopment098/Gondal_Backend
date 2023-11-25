const router = require("express").Router();

const { upload } = require("../controllers/uploadsController");
const {
  isBrandExist,
  getAllBrand,
  createBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");
router.route("/").get(getAllBrand).post(upload.single("imageUrl"), createBrand);
router
  .route("/:id")
  .get(isBrandExist, getBrandById)
  .patch(isBrandExist, upload.single("imageUrl"), updateBrand)
  .delete(isBrandExist, deleteBrand);
module.exports = router;

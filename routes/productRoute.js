const router = require("express").Router();
const { upload } = require("../controllers/uploadsController");
const {
  isProductExist,
  createProduct,
  getAllProduct,
  getProductById,
  getProductByGroup,
  updateProduct,
  updateProductsPrice,
  deleteProduct,
  getProductByWareHouse,
  stockAlert
} = require("../controllers/productController");

router
  .route("/")
  .get(getAllProduct)
  .post(upload.single("imageUrl"), createProduct);
router.get("/getwhproduct/:id", getProductByWareHouse);

router.put("/updateprices", updateProductsPrice);
router
  .route("/:id")
  .get(isProductExist, getProductById)

  .patch(isProductExist, upload.single("imageUrl"), updateProduct)
  .delete(isProductExist, deleteProduct);

router.get("/bygroup/:id", getProductByGroup);
router.get("/stock/alert", stockAlert);

module.exports = router;

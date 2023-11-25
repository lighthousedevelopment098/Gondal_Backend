const router = require("express").Router();
const {
  isSupplierExist,
  createSupplier,
  getAllSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  payToSupplier,
  getAllPayment
} = require("../controllers/supplierController");

router.route("/").get(getAllSupplier).post(createSupplier);
router
  .route("/:id")
  .get(isSupplierExist, getSupplierById)
  .patch(isSupplierExist, updateSupplier)
  .delete(isSupplierExist, deleteSupplier);
router.patch('/payment/:supplierId', payToSupplier)
router.get('/getAllPayment/:id', getAllPayment)
module.exports = router;

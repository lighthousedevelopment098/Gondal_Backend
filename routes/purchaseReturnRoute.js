const router = require("express").Router();
const {
  isPurchaseReturnExist,
  createPurchaseReturn,
  getAllPurchaseReturn,
  getPurchaseReturnById,
  updatePurchaseReturn,
  deletePurchaseReturn,
  purchaseReturnController,
} = require("../controllers/purchaseReturnController");

router.post("/purchasereturn", purchaseReturnController);
router.route("/").get(getAllPurchaseReturn).post(createPurchaseReturn);
router
  .route("/:id")
  .get(isPurchaseReturnExist, getPurchaseReturnById)
  .patch(isPurchaseReturnExist, updatePurchaseReturn)
  .delete(isPurchaseReturnExist, deletePurchaseReturn);
module.exports = router;

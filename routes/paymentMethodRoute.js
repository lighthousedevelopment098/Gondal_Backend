const router = require("express").Router();
const {
  createPaymentMethod,
  getAllPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
} = require("../controllers/paymentMethodController");
router.route("/").get(getAllPaymentMethods).post(createPaymentMethod);
router
  .route("/:id")
  .get()
  .patch(updatePaymentMethod)
  .delete(deletePaymentMethod);

module.exports = router;

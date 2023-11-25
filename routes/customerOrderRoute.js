const router = require("express").Router();
const {
  isCustomerOrderExist,
  createCustomerOrder,
  getAllCustomerOrder,
  getCustomerOrderById,
  updateCustomerOrder,
  deleteCustomerOrder,
  salesReturnController,
  profitReport,
  previousOrder,
  updatePreviousOrder
} = require("../controllers/customerOrderController");

router.route("/").get(getAllCustomerOrder).post(createCustomerOrder);
router.post("/salesreturn", salesReturnController);
router
  .route("/:id")
  .get(isCustomerOrderExist, getCustomerOrderById)
  .patch(isCustomerOrderExist, updateCustomerOrder)
  .delete(isCustomerOrderExist, deleteCustomerOrder);
router.get('/profit/report', profitReport)
router.get('/previousOrder/:id/:customerId', previousOrder)
router.patch('/previousOrder/:id', updatePreviousOrder)
module.exports = router;

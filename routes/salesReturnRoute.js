const router = require("express").Router();
const {
  isSalesReturnExist,
  createSalesReturn,
  getAllSalesReturn,
  getSalesReturnById,
  updateSalesReturn,
  deleteSalesReturn,
} = require("../controllers/salesReturnController");

router.route("/").get(getAllSalesReturn).post(createSalesReturn);
router
  .route("/:id")
  .get(isSalesReturnExist, getSalesReturnById)
  .patch(isSalesReturnExist, updateSalesReturn)
  .delete(isSalesReturnExist, deleteSalesReturn);
module.exports = router;

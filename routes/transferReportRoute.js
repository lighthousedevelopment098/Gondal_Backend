const router = require("express").Router();
const {
  isTransferReportExist,
  createTransferReport,
  getAllTransferReport,
  getTransferReportById,
  updateTransferReport,
  deleteTransferReport,
} = require("../controllers/transferReportController");
router.route("/").get(getAllTransferReport).post(createTransferReport);
router
  .route("/:id")
  .get(isTransferReportExist, getTransferReportById)
  .patch(isTransferReportExist, updateTransferReport)
  .delete(isTransferReportExist, deleteTransferReport);
module.exports = router;


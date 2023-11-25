const router = require("express").Router();
const {
  isUnitExist,
  createUnit,
  getAllUnit,
  getUnitById,
  updateUnit,
  deleteUnit,
} = require("../controllers/unitController");

router.route("/").get(getAllUnit).post(createUnit);
router
  .route("/:id")
  .get(isUnitExist, getUnitById)
  .patch(isUnitExist, updateUnit)
  .delete(isUnitExist, deleteUnit);
module.exports = router;

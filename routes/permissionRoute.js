const router = require("express").Router();
const {
  createPermissions,
  updatePermissions,
  deletePermissions,
  getAllPermissions,
} = require("../controllers/permissionsController");
router.route("/").get(getAllPermissions).post(createPermissions);
router
  .route("/:id")
  .post(createPermissions)
  .patch(updatePermissions)
  .delete(deletePermissions);

module.exports = router;

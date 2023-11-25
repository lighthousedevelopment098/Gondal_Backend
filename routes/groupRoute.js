const router = require("express").Router();
const {
  createGroup,
  getAllGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  isGroupExist,
} = require("../controllers/groupController");

router.route("/").get(getAllGroup).post(createGroup);
router
  .route("/:id")
  .get(isGroupExist, getGroupById)
  .patch(isGroupExist, updateGroup)
  .delete(isGroupExist, deleteGroup);
module.exports = router;

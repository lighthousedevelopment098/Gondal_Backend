const router = require("express").Router();
const { upload } = require("../controllers/uploadsController");
const {
  isUserExist,
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser
} = require("../controllers/userController");
router.route("/").get(getAllUser).post(upload.single("imageUrl"), createUser);
router
  .route("/:id")
  .get(isUserExist, getUserById)
  .patch(isUserExist, upload.single("imageUrl"), updateUser)
  .delete(isUserExist, deleteUser);
router.post('/login', loginUser)
module.exports = router;

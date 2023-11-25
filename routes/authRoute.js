const router = require("express").Router();
const {
  signUpController,
  signInController,
} = require("../controllers/authController");
router.post("/signup", signUpController);
router.post("/signin", signInController);
module.exports = router;

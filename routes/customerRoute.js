const router = require("express").Router();

const { upload } = require("../controllers/uploadsController");
const {
  createCustomer,
  getAllCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  isCustomerExist,
} = require("../controllers/customerController");
router
  .route("/")
  .get(getAllCustomer)
  .post(upload.single("imageUrl"), createCustomer);
router
  .route("/:id")
  .get(isCustomerExist, getCustomerById)
  .patch(isCustomerExist, upload.single("imageUrl"), updateCustomer)
  .delete(isCustomerExist, deleteCustomer);
module.exports = router;

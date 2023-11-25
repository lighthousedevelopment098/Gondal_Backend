const router = require("express").Router();
const {
  getAllProductsByPurchase,
} = require("../controllers/purchaseController");
router.route("/").get().post(getAllProductsByPurchase);
router.route("/:id").get().patch().delete();
module.exports = router;

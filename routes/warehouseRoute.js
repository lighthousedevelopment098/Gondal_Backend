const router = require("express").Router();
const {
  createWareHouse,
  getAllWareHouse,
  getWareHouseById,
  updateWareHouse,
  deleteWareHouse,
  isWarehouseExist,
  shiftProductsBetweenWareHouses,
  stockReport
} = require("../controllers/warehouseController");
router.route("/").get(getAllWareHouse).post(createWareHouse);
router.patch("/wareToware", shiftProductsBetweenWareHouses);
router
  .route("/:id")
  .get(isWarehouseExist, getWareHouseById)
  .patch(isWarehouseExist, updateWareHouse)
  .delete(isWarehouseExist, deleteWareHouse);
router.get('/stockReport/get', stockReport)
module.exports = router;

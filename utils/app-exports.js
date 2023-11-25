const connectDB = require("../db/connectDB");
const warehouseRoute = require("../routes/warehouseRoute");
const productRoute = require("../routes/productRoute");
const authRoute = require("../routes/authRoute");
const userRoute = require("../routes/userRoute");
const groupRoute = require("../routes/groupRoute");
const unitRoute = require("../routes/unitRoute");
const brandRoute = require("../routes/brandRoute");
const customerRoute = require("../routes/customerRoute");
const permissionRoute = require("../routes/permissionRoute");
const supplierRoute = require("../routes/supplierRoute");
const transferReportRoute = require("../routes/transferReportRoute");
const purchaseReportRoute = require("../routes/purchaseRoute");
const purchaseDetailRoute = require("../routes/purchaseDetailRoute");
const paymentMethodRoute = require("../routes/paymentMethodRoute");
const customerOrderRoute = require("../routes/customerOrderRoute");
const salesReturnRoute = require("../routes/salesReturnRoute");
const purchaseReturnRoute = require("../routes/purchaseReturnRoute");
const errorHandlerMiddleware = require("../middlewares/errorHandler");
const notFound = require("../middlewares/notFound");

module.exports = {
  connectDB,
  warehouseRoute,
  productRoute,
  authRoute,
  userRoute,
  groupRoute,
  unitRoute,
  brandRoute,
  permissionRoute,
  customerRoute,
  supplierRoute,
  transferReportRoute,
  purchaseReportRoute,
  purchaseDetailRoute,
  paymentMethodRoute,
  customerOrderRoute,
  salesReturnRoute,
  purchaseReturnRoute,
  errorHandlerMiddleware,
  notFound,
};

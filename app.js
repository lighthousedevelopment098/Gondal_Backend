require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const app = express();
const handler = require("./utils/app-exports");
const medicineRoute = require("./routes/medicineRoute");
const categoryRoute = require("./routes/categoryRoutes");
const expenseRoute = require("./routes/expenseRoutes");
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const startServer = async () => {
  await handler.connectDB(process.env.MONGO_URL);
  app.listen(PORT, () => console.log(`server is started at port ${PORT}`));
};
//Cross origin resource sharing
app.use(cors());
app.use("/images", express.static("uploads"));
app.use("/api/v1/warehouse", handler.warehouseRoute);
app.get("/api/v1/test", (req, res) => {
  res.json('hello')
});
app.use("/api/v1/user/auth", handler.authRoute);
app.use("/api/v1/product", handler.productRoute);
app.use("/api/v1/group", handler.groupRoute);
app.use("/api/v1/unit", handler.unitRoute);
app.use("/api/v1/brand", handler.brandRoute);
app.use("/api/v1/customer", handler.customerRoute);
app.use("/api/v1/user", handler.userRoute);
app.use("/api/v1/permissions", handler.permissionRoute);
app.use("/api/v1/supplier", handler.supplierRoute);
app.use("/api/v1/transferreport", handler.transferReportRoute);
app.use("/api/v1/purchasereport", handler.purchaseReportRoute);
app.use("/api/v1/purchasedetail", handler.purchaseDetailRoute);
app.use("/api/v1/paymentmethod", handler.paymentMethodRoute);
app.use("/api/v1/customerorder", handler.customerOrderRoute);
app.use("/api/v1/salesreturn", handler.salesReturnRoute);
app.use("/api/v1/purchasereturn", handler.purchaseReturnRoute);
app.use("/api/v1/medicine", medicineRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/expense", expenseRoute);
app.use(handler.errorHandlerMiddleware);
app.use(handler.notFound);
startServer();

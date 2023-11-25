const router = require("express").Router();
const PurchaseDetailModal = require("../models/PurchaseDetails");
const ProductModal = require("../models/Product");
const { BadRequestError } = require("../errors");
const WareHouse = require("../models/Ware-House");
const Supplier = require("../models/Supplier");
const StockReport = require("../models/StockReport");
router.post("/create", async (req, res) => {
  try {
    // const purchaseDetail = req.body;
    let totalAmount = 0
    // const randomNum = Math.floor(Math.random() * 10000)
    const prodIdsArr = []
    const warehouse = await WareHouse.findOne({ _id: req.body.warehouse });
    const productIds = warehouse.productIds || []
    await Promise.all(
      req.body?.purchaseDetail?.map((item) => {
        const { _id, ...rest } = item;
        totalAmount = totalAmount + (item.productPrice * item.qty)
        prodIdsArr.push(item?.proId)
        return PurchaseDetailModal.create({

          ...rest,
          productId: item?.proId,
          productPrice: item.productPrice,
          quantity: item?.qty,
          due: item.productPrice * item.qty,
          total: item.productPrice * item.qty,
          invoiceNo: "ref-" + Math.floor(Math.random() * 10000),
          supplier: req.body.supplierId,
          warehouse: req.body.warehouse

        });
      })
    );
    await Promise.all(
      req.body?.purchaseDetail?.map((item) => {
        const { proId, qty } = item;
        return ProductModal.updateOne({ _id: proId }, {
          $inc: {
            quantity: qty,

          },
          $addToSet: {
            warehouse: req.body.warehouse,


          },
          $set: {
            supplier: req.body.supplierId
          }
        });
      })
    );
    await Promise.all(
      req.body?.purchaseDetail?.map((item) => {
        return StockReport.findOneAndUpdate({
          productId: item?.proId,
          warehouseId: req.body.warehouse,

        }, {
          $inc: {
            qty: item.qty
          },
          $set: {
            productId: item?.proId,
            warehouseId: req.body.warehouse,

          }

        }, { upsert: true })
      }));

    req.body?.purchaseDetail.map((item) => {
      const findIndex = productIds.findIndex((i) => i.proId === item?.proId)
      if (findIndex >= 0) {
        productIds[findIndex].qty += item?.qty
      } else {
        productIds.push({
          proId: item?.proId,
          qty: item?.qty
        })
      }
    })
    // warehouse.productIds = warehouse.productIds.concat(req.body?.purchaseDetail)
    warehouse.productIds = productIds
    await warehouse.save()

    await Supplier.updateOne({ _id: req.body.supplierId }, {
      $set: {
        purchaseDue: totalAmount,
        invoiceNo: "ref-" + Math.floor(Math.random() * 10000),
        purchaseTotal: totalAmount,
        prodIds: prodIdsArr,



      }
    });

    res.status(200).json({ status: 200, message: "Success" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json("Server Error");
  }
});
router.patch("/dopayment", async (req, res) => {
  try {
    const { id, paymentAmount } = req.body;

    const result = await PurchaseDetailModal.findById(id).select(
      "due paid result"
    );
    if (!paymentAmount) {
      throw new BadRequestError("Please provide paymentAmount");
    }
    if (result.due < paymentAmount) {
      throw new BadRequestError("Please provide sufficient paymentAmount");
    }
    result.due = result.due - paymentAmount;

    result.paid = result.paid + paymentAmount;
    if (result.due === 0) {
      result.paymentAmount = "Paid";
    }
    await result.save();

    res.status(200).json({ status: 200, message: "Success", data: result });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
});

router.get("/get", async (req, res) => {
  try {
    // const purchaseDetail = req.body;

    const data = await PurchaseDetailModal.find({}).populate("supplier", { name: 1 }).populate("warehouse", { name: 1 })

    res.status(200).json({ status: 200, message: "Success", data });
  } catch (error) {
    console.log("error", error);
    res.status(500).json("Server Error");
  }
});
router.get("/get/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // const { product } = req.body;

    const data = await PurchaseDetailModal.findById(id).populate("supplier").lean();

    res.status(200).json({ status: 200, message: "Success", data });
  } catch (error) {
    console.log("error", error);
    res.status(500).json("Server Error");
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const data = await PurchaseDetailModal.deleteOne({ _id: id }).lean();

    res.status(200).json({ status: 200, message: "Success", data });
  } catch (error) {
    console.log("error", error);
    res.status(500).json("Server Error");
  }
});
module.exports = router;

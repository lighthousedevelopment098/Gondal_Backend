const PurchaseReturn = require("../models/PurchaseReturn");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
const WareHouse = require("../models/Ware-House");
const PurchaseDetails = require("../models/PurchaseDetails");
const Product = require("../models/Product");
const Stock = require("../models/StockReport");
async function isPurchaseReturnExist(req, res, next) {
  let result;
  try {
    const PurchaseReturnId = req.params.id;
    result = await PurchaseReturn.findById(PurchaseReturnId);
    if (!result) {
      throw new NotFoundError("Result not found");
    }
    res.result = result;
    next();
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
}
const createPurchaseReturn = async (req, res) => {
  try {
    if (!req.body) {
      throw new BadRequestError("Bad Request fields can't be empty");
    }
    const newPurchaseReturn = await PurchaseReturn.create(req.body);
    const { __v, createdAt, updatedAt, ...PurchaseReturnInfo } =
      newPurchaseReturn._doc;
    return res.json({
      status: 200,
      message: "success",
      data: PurchaseReturnInfo,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getAllPurchaseReturn = async (req, res) => {
  try {
    const allPurchaseReturns = await PurchaseReturn.find(
      {},
      { updatedAt: 0, __v: 0 }
    );
    if (allPurchaseReturns.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }
    return res.json({ status: 200, msg: "success", data: allPurchaseReturns });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getPurchaseReturnById = async (req, res) => {
  try {
    //Get  object form isPurchaseReturnExist
    const result = res.result;
    const { __v, createdAt, updatedAt, ...PurchaseReturnInfo } = result._doc;

    return res.json({ status: 200, msg: "Success", data: PurchaseReturnInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updatePurchaseReturn = async (req, res) => {
  try {
    //Get  object form isPurchaseReturnExist
    const updatedResult = await res.result.updateOne(
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    if (!updatedResult) {
      throw new CustomAPIError("record not updated successfuly");
    }
    return res.json({ status: 200, msg: "Success", data: updatedResult });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const deletePurchaseReturn = async (req, res) => {
  try {
    //Get  object form isPurchaseReturnExist
    const deletedResult = await res.result.deleteOne();
    if (!deletedResult) {
      throw new CustomAPIError("Product not deleted successfuly");
    }
    const { __v, createdAt, updatedAt, ...resultInfo } = deletedResult._doc;
    return res.json({
      status: 200,
      msg: "Record deleted successfuly",
      data: resultInfo,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const purchaseReturnControllerr = async (req, res) => {
  try {
    const prodIds = req.body;
    let data;
    const updatePromises = prodIds.map(async (item) => {
      const customerOrderUpdate = WareHouse.updateMany(
        {
          _id: item.warehouseId,
          "productIds.proId": item.product.productId,
        },
        {
          $inc: {
            "productIds.$.qty": -item.product.returnQty,
          },
        },
        {
          new: true,
        }
      );
      const purDet = await PurchaseDetails.findByIdAndUpdate(
        item.product._id,
        {
          $inc: {
            whQty: -item.product.returnQty,
          },
        },
        { new: true }
      );
      const createSalesReturn = PurchaseReturn.create(req.body);
      await Promise.all([customerOrderUpdate, createSalesReturn, purDet]);
    });

    data = await Promise.all(updatePromises)
      .then((result) => {
        data = result;
      })
      .catch((error) => {
        console.log(error);
      });

    return res.json({ status: 200, message: "Success", data });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const purchaseReturnController = async (req, res) => {
  try {
    const prodIds = req.body;
    let data;
    const arr = []
    prodIds?.map(item => {
      arr.push(PurchaseDetails.updateOne({
        _id: item?.product?._id,
      }, {
        $inc: {
          quantity: -parseInt(item?.product?.returnQty)
        }
      }))
      arr.push(WareHouse.updateOne({
        _id: item?.warehouseId,
        "productIds.proId": item?.product?.productId
      }, {
        $inc: {
          "productIds.$.qty": -parseInt(item?.product?.returnQty)
        }
      }))
      arr.push(Product.updateOne(
        {
          _id: item.product?.productId,
        },
        {
          $inc: {
            quantity: -parseInt(item?.product?.returnQty),

          },
        }))
    })
    await Promise.all(
      prodIds?.map((item) =>
        Stock.updateOne(
          { productId: item?.product?.productId, warehouseId: item?.warehouseId, },
          { $inc: { qty: -parseInt(item?.product?.returnQty) } }
        )
      )
    );
    await PurchaseReturn.create(req.body)
    await Promise.all(arr)
    return res.json({ status: 200, message: "Success", data });
  } catch (error) {
    console.log(error);
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
module.exports = {
  createPurchaseReturn,
  getAllPurchaseReturn,
  getPurchaseReturnById,
  updatePurchaseReturn,
  deletePurchaseReturn,
  isPurchaseReturnExist,
  purchaseReturnController,
};

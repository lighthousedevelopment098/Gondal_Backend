const CustomerOrder = require("../models/CustomerOrder");
const WareHouse = require("../models/Ware-House");
const SalesReturn = require("../models/SalesReturn");
const Profit = require("../models/ProfitReport");
const Product = require("../models/Product");
const Stock = require("../models/StockReport");
// const mongoose = require('mongoose');
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
async function isCustomerOrderExist(req, res, next) {
  let result;
  try {
    const CustomerOrderId = req.params.id;
    result = await CustomerOrder.findById(CustomerOrderId);
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
const createCustomerOrder = async (req, res) => {
  const random = Math.floor(Math.random() * 10000)
  try {
    if (!req.body) {
      throw new BadRequestError("Bad Request fields can't be empty");
    }
    const { warehouseId, productDetail } = req.body;
    const findWarehouse = await WareHouse.findOne({ _id: warehouseId })
    let greaterQty = []
    productDetail.map(p => {
      const findItem = findWarehouse?.productIds?.find(w => w.proId === p._id)


      if (p.cartQty > findItem.qty) {
        greaterQty.push(p.cartQty)
      }
    })
    if (greaterQty.length > 0) {
      return res.status(401).json({ message: "Amount is not available", status: 401 })
    }
    await Promise.all(
      productDetail.map((item) =>
        WareHouse.updateOne(
          { _id: warehouseId, "productIds.proId": item._id },
          { $inc: { "productIds.$.qty": -item.cartQty } }
        )
      )
    );
    await Promise.all(
      productDetail.map((item) =>
        Product.updateOne(
          { _id: item._id },
          { $inc: { quantity: -item.cartQty } }
        )
      )
    );
    await Promise.all(
      productDetail.map((item) =>
        Stock.updateOne(
          { productId: item?._id, warehouseId },
          { $inc: { qty: -item.cartQty } }
        )
      )
    );


    await Promise.all(
      productDetail.map((item) => {
        let total = item.cartQty * item.productPrice
        let cost = item.cartQty * item.productCost
        return Profit.updateOne({
          pId: item._id
        },
          {
            $set: {
              pId: item._id,
              name: item.productName
            },
            $inc: {
              productCost: cost,
              grandTotal: total,
              qty: item.cartQty,
            }
          }, { upsert: true })
      })
    );
    req.body.due = req.body.grandTotal;
    const newCustomerOrder = await CustomerOrder.create({
      ...req.body,
      productDetail,
      profit: req.body.grandTotal - req.body.productCost,
      invoiceNo: "ref-" + random
    });
    const { __v, updatedAt, ...CustomerOrderInfo } = newCustomerOrder._doc;
    return res.json({
      status: 200,
      message: "Success",
      data: CustomerOrderInfo,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getAllCustomerOrder = async (req, res) => {
  try {
    const allCustomerOrders = await CustomerOrder.find(
      {},
      { updatedAt: 0, __v: 0 }
    ).populate("customerId").populate("warehouseId");
    if (allCustomerOrders.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }
    return res.json({ status: 200, msg: "success", data: allCustomerOrders });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getCustomerOrderById = async (req, res) => {
  try {
    //Get  object form isCustomerOrderExist
    const result = res.result;
    const { __v, createdAt, updatedAt, ...CustomerOrderInfo } = result._doc;

    return res.json({ status: 200, msg: "Success", data: CustomerOrderInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updateCustomerOrder = async (req, res) => {
  try {
    //Get  object form isCustomerOrderExist
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
const deleteCustomerOrder = async (req, res) => {
  try {
    //Get  object form isCustomerOrderExist
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

const salesReturnControllerr = async (req, res) => {
  try {
    const prodIds = req.body;
    let data;
    const updatePromises = prodIds.map(async (item) => {
      // Perform updates for CustomerOrder collection
      const customerOrderUpdate = CustomerOrder.updateMany(
        {
          customerId: item.customerId,
          "productDetail._id": item.product._id,
        },
        {
          $inc: {
            "productDetail.$.cartQty": -item.returnQty,
            grandTotal: -(item.returnQty * item.product.productPrice)
          },
        },
        {
          new: true,
        }
      );

      // Perform updates for WareHouse collection
      const wareHouseUpdate = WareHouse.updateMany(
        {
          _id: item.warehouseId,
          "productIds.proId": item.product._id,
        },
        {
          $inc: {
            "productIds.$.qty": item.returnQty,
          },
        },
        {
          new: true,
        }
      );
      const createSalesReturn = SalesReturn.create(item);
      // Wait for both updates to complete
      await Promise.all([
        customerOrderUpdate,
        wareHouseUpdate,
        createSalesReturn,
      ]);
    });

    await Promise.all(updatePromises)
      .then((result) => {
        data = result;
      })
      .catch((error) => {
        console.log(error);
      });
    await Promise.all(prodIds.map(item => {
      return WareHouse.updateOne({
        _id: item?.warehouseId?._id,
        "productIds.proId": item?.product?._id
      }, {
        $inc: {
          "productIds.$.qty": item.returnQty
        }
      })
    }))
    return res.json({ status: 200, message: "Success", data });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const salesReturnController = async (req, res) => {
  try {
    const prodIds = req.body;
    console.log(prodIds)
    let data;
    const arr = []

    prodIds.map((item) => {
      let total = item.returnQty * item?.product?.productPrice;
      let cost = item.returnQty * item?.product.productCost
      arr.push(Profit.updateOne({ pId: item?.product?._id }, {
        $inc: {
          qty: -item.returnQty,
          productCost: -cost,
          grandTotal: -total,
        }
      }
      ))
    })


    prodIds?.map(item => {
      let returnPrice = parseInt(item.returnQty * item.product.productPrice)
      arr.push(WareHouse.updateOne({
        _id: item?.warehouseId?._id,
        "productIds.proId": item?.product?._id
      }, {
        $inc: {
          "productIds.$.qty": parseInt(item?.returnQty)
        }
      }))
      arr.push(CustomerOrder.updateOne(
        {
          customerId: item?.customerId,
          "productDetail._id": item.product._id,
          invoiceNo: item?.invoiceNo
        },
        {
          $inc: {
            "productDetail.$.cartQty": -parseInt(item.returnQty),
            grandTotal: -returnPrice,
            due: -returnPrice
          },
        }))
      arr.push(Product.updateOne(
        {
          _id: item.product?._id,
        },
        {
          $inc: {
            quantity: parseInt(item.returnQty),

          },
        }))
      arr.push(SalesReturn.create(item))

    })
    await Promise.all(
      prodIds?.map((item) =>
        Stock.updateOne(
          { productId: item?.product?._id, warehouseId: item?.warehouseId?._id, },
          { $inc: { qty: item?.returnQty } }
        )
      )
    );

    await Promise.all(arr)
    return res.json({ status: 200, message: "Success", data });
  } catch (error) {
    console.log(error);
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};


const profitReport = async (req, res) => {
  try {
    const data = await Profit.aggregate([

      {
        $group: {
          _id: "$pId",
          totalSale: {
            $sum: "$grandTotal"
          },
          totalCost: {
            $sum: "$productCost"
          },
          totalQty: {
            $sum: "$qty"
          },
          name: {
            $first: "$name"
          },
          invoiceNo:"$date"
        }
      },
    ])

    return res.json({ status: 200, message: "Success", data });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const previousOrder = async (req, res) => {
  try {
    const data = await CustomerOrder.findOne({ _id: { $lt: req.params.id }, customerId: req.params.customerId }).sort({ _id: -1 })
    // const findIndex = data.findIndex((i) => i.customerId === req.params.id)
    // const order = findIndex >= 1 ? data[findIndex - 1] : data[0]
    return res.json({ status: 200, message: "Success", data });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updatePreviousOrder = async (req, res) => {
  try {
    const data = await CustomerOrder.updateOne({ _id: req.params.id }, { $set: { ...req.body } })

    return res.json({ status: 200, message: "Success", data });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};



module.exports = {
  createCustomerOrder,
  getAllCustomerOrder,
  getCustomerOrderById,
  updateCustomerOrder,
  deleteCustomerOrder,
  isCustomerOrderExist,
  salesReturnController,
  profitReport,
  previousOrder,
  updatePreviousOrder

};

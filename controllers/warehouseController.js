const WareHouse = require("../models/Ware-House");
const Product = require("../models/Product");
const Report = require("../models/TransferReport");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
const StockReport = require("../models/StockReport");
async function isWarehouseExist(req, res, next) {
  let result;
  try {
    const wareId = req.params.id;
    result = await WareHouse.findById(wareId);
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
const createWareHouse = async (req, res) => {
  try {
    const { name, country, email, city, phone, zipCode } = req.body;
    if (!name | !country | !email | !city | !phone | !zipCode) {
      throw new BadRequestError("Bad Request fields can't be empty");
    }
    const newWareHouse = await WareHouse.create(req.body);
    const { __v, createdAt, updatedAt, ...warehouseInfo } = newWareHouse._doc;
    return res.json({ status: 200, message: "success", data: warehouseInfo });
  } catch (error) {
    let status = error.statusCode || 500;
    let message = error.message || "Internal Server Error";
    // if (error.code === 11000) {
    //   message = "email already existed";
    // }
    return res.json({ message: message, status: status });
  }
};

const getAllWareHouse = async (req, res) => {
  try {
    const allWareHouses = await WareHouse.find(
      {},
      { createdAt: 0, updatedAt: 0, __v: 0, password: 0 }
    );
    if (allWareHouses.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }
    return res.json({ status: 200, message: "success", data: allWareHouses });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getWareHouseById = async (req, res) => {
  try {
    //Get  object form isWareHouseExist
    const result = res.result;
    const { __v, createdAt, updatedAt, password, ...warehouseInfo } =
      result._doc;

    return res.json({ status: 200, message: "Success", data: warehouseInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updateWareHouse = async (req, res) => {
  try {
    //Get  object form isWareHouseExist
    const updatedResult = await res.result.updateOne(
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );
    if (!updatedResult) {
      throw new CustomAPIError("Product not updated successfuly");
    }
    return res.json({ status: 200, message: "Success", data: updatedResult });
  } catch (error) {
    let status = error.statusCode || 500;
    let message = error.message || "Internal Server Error";
    if (error.code === 11000) {
      message = "email duplication error";
    }
    return res.json({ message: message, status: status });
  }
};
const deleteWareHouse = async (req, res) => {
  try {
    const warehouse = res.result?.productIds

    const totalQuantity = warehouse.reduce((acc, p) => {
      return acc + parseInt(p?.qty)
    }, 0)

    if (totalQuantity > 0) {
      return res.status(401).json({ msg: "Cannot delete", status: 401 })
    }
    const deletedResult = await res.result.deleteOne();
    if (!deletedResult) {
      throw new CustomAPIError("Product not deleted successfuly");
    }
    return res.json({
      status: 200,
      message: "Record deleted successfuly",
      data: deletedResult,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const shiftProductsBetweenWareHouse = async (req, res) => {
  try {
    const { prodIds, toWareHouseId, fromWareHouseId, remainingQty } = req.body;
    const productIdsArray = await WareHouse.findById(fromWareHouseId, {
      productIds: 1,
    });
    let isGreater;
    let isNull;
    productIdsArray.productIds.map(async (item, index) => {
      if (!item.qty) {
        isNull = true;

        return;
      }
      var i = prodIds[index] ? index : prodIds.length - 1;
      if (prodIds[i].qty > item.qty) {
        isGreater = true;
        return;
      }
    });

    if (isGreater) {
      throw new BadRequestError("quantity is greater than available");
    }
    if (isNull) {
      throw new BadRequestError("please provide an quantity");
    }
    let total;
    prodIds.map(async (item) => {
      total = await WareHouse.updateMany(
        { _id: fromWareHouseId, "productIds.proId": item.proId },
        { $inc: { "productIds.$.qty": -item.qty } },
        { new: true }
      );
      await Product.updateMany(
        { _id: item.proId },
        {
          $push: {
            warehouse: toWareHouseId,
          },
        },
        { new: true }
      );
      await Report.create({
        fromWareHouseId: fromWareHouseId,
        toWareHouseId: toWareHouseId,
        productIds: item.proId,
        qty: item.qty,
      });
    });
    const pushedResult = await WareHouse.findByIdAndUpdate(
      toWareHouseId,
      {
        $push: { productIds: prodIds },
      },
      { new: true }
    );
    if (!pushedResult) {
      throw new CustomAPIError("Products not transfer successfuly");
    }
    return res.json({ status: 200, message: "Success", data: "Task Success" });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const shiftProductsBetweenWareHouses = async (req, res) => {
  try {
    const { prodIds, toWareHouseId, fromWareHouseId } = req.body;
    const warehouseTo = await WareHouse.findOne({ _id: toWareHouseId });
    const warehouseFrom = await WareHouse.findOne({ _id: fromWareHouseId });
    let greaterQty = []
    prodIds.map((it) => {
      const findItem = warehouseFrom?.productIds?.find(i => i.proId === it.proId)

      if (it.qty > findItem.qty) {
        greaterQty.push(it.qty)
      }
    })
    if (greaterQty.length > 0) {
      return res.status(401).json({ status: 401, message: "Amount not available" })
    }
    let proFromArr = warehouseFrom.productIds
    prodIds.map((item) => {
      const findIndex = proFromArr.findIndex(p => p.proId === item.proId)

      if (findIndex >= 0) {
        proFromArr[findIndex].qty -= item.qty
      }
    })
    warehouseFrom.productIds = proFromArr
    await warehouseFrom.save()

    let proArr = warehouseTo.productIds
    prodIds.map((item) => {
      const findIndex = proArr.findIndex(p => p.proId === item.proId)

      if (findIndex >= 0) {
        proArr[findIndex].qty += item.qty
      } else {
        proArr.push({ proId: item.proId, qty: item.qty })
      }
    })
    warehouseTo.productIds = proArr
    await warehouseTo.save()
    await Promise.all(prodIds.map(item => Report.create({
      fromWareHouseId: fromWareHouseId,
      toWareHouseId: toWareHouseId,
      productIds: item.proId,
      qty: item.qty,
    })))
    await Promise.all(prodIds.map(item => Product.updateOne({ _id: item.proId }, { $addToSet: { warehouse: toWareHouseId } })))
    // await Promise.all(prodIds.map(item => Product.updateOne({ _id: item.proId }, { $addToSet: { warehouse: toWareHouseId }, $inc: { quantity: -item.qty } })))



    return res.json({ status: 200, message: "Success", data: "Task Success" });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const sendProductsFromWarehouse = async (req, res) => {
  try {
    const { fromId, toId, prodIds, qty } = req.body;
    const allIds = await WareHouse.findById(fromId, {
      productIds: 1,
    });
    let prod;
    allIds.map(async (id) => {
      prod = await Product.findById(id, { quantity: 1, productName: 1 });
      if (qty < prod.quantity) {
        throw new CustomAPIError(`Insufficient fro ${prod.productName}`);
      }
    });
    if (allIds.length < prodIds.length) {
      throw CustomAPIError("Products not found");
    }

    if (prodIds.length !== allIds.length) {
      return res.json({ message: "Products not existed" });
    }
    return res.json({ data: allIds });
    if (proids.length <= 0) {
      throw new CustomAPIError("Data not found");
    }
    const result = await WareHouse.findByIdAndUpdate(
      toId,
      { $push: { productsId: proids } },
      { new: true }
    );
    if (result.length <= 0) {
      throw new CustomAPIError("Task Failed");
    }
    return res.json({ status: 200, message: "Success", data: result });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const stockReport = async (req, res) => {
  try {
    // const data = await StockReport.aggregate([

    //   {
    //     $group: {
    //       _id: "$warehouseId",
    //       detail: {
    //         $push: "$warehouseId"
    //       },
    //       totalQty: {
    //         $sum: "$qty",

    //       }

    //     }
    //   },

    // ])
    const data = await WareHouse.aggregate([
      {
        $unwind: "$productIds"
      },
      {
        $group: {
          _id: { pId: "$productIds.proId", warehouseId: "$_id" },
          totalQty: {
            $sum: "$productIds.qty"
          },
          name: {
            $first: "$name"
          }
        }
      },
    ])

    const a = await WareHouse.populate(data, { path: "productIds.proId" });

    res.status(200).json({ msg: "success", data: a })
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
module.exports = {
  createWareHouse,
  getAllWareHouse,
  getWareHouseById,
  updateWareHouse,
  deleteWareHouse,
  isWarehouseExist,
  shiftProductsBetweenWareHouses,
  sendProductsFromWarehouse,
  stockReport
};

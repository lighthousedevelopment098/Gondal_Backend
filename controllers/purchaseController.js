const PurchaseReport = require("../models/purchasesReport");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const WareHouse = require("../models/Ware-House");
const { deleteImageFromLocal } = require("../controllers/uploadsController");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
async function isPurchaseReportExist(req, res, next) {
  let result;
  try {
    const custmId = req.params.id;
    result = await PurchaseReport.findById(custmId);
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
const createPurchaseReport = async (req, res) => {
  try {
    if (!req.body) {
      throw new BadRequestError("Bad Request please fields can't be empty");
    }
    const newPurchaseReport = await PurchaseReport.create(req.body);
    const { __v, createdAt, updatedAt, ...PurchaseReportInfo } =
      newPurchaseReport._doc;
    return res.json({
      status: 200,
      message: "success",
      data: PurchaseReportInfo,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getAllProductsByPurchase = async (req, res) => {
  try {
    const { supplierId, warehouseId } = req.body;
    const allPurchaseProducts = await Product.aggregate([
      {
        $match: {
          supplier: supplierId,
        },
      },
      {
        $unwind: "$warehouse",
      },
      {
        $match: {
          warehouse: warehouseId,
        },
      },
    ]);
    let qtyResult;
    await Promise.all(
      allPurchaseProducts.map((item) =>
        WareHouse.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(warehouseId),
            },
          },
          {
            $unwind: "$productIds",
          },

          {
            $match: {
              "productIds.proId": item._id.toHexString(),
            },
          },
          {
            $project: {
              "productIds.qty": 1,
              "productIds.proId": 1,
            },
          },
        ])
      )
    )
      .then((relt) => {
        qtyResult = relt;
      })
      .catch((error) => console.log(error));

    if (allPurchaseProducts.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }

    return res.json({
      status: 200,
      msg: "success",
      data: [{ allPurchaseProducts }, { qtyResult }],
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getPurchaseReportById = async (req, res) => {
  try {
    //Get  object form isPurchaseReportExist
    const result = res.result;
    const { __v, createdAt, updatedAt, ...PurchaseReportInfo } = result._doc;

    return res.json({ status: 200, msg: "Success", data: PurchaseReportInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updatePurchaseReport = async (req, res) => {
  try {
    //Get  object form isPurchaseReportExist
    const updatedResult = await res.result.updateOne(
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );
    if (!updatedResult) {
      throw new CustomAPIError("custmduct not updated successfuly");
    }
    return res.json({ status: 200, msg: "Success", data: updatedResult });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const deletePurchaseReport = async (req, res) => {
  try {
    const deletedResult = await res.result.deleteOne();
    if (!deletedResult) {
      throw new CustomAPIError("Product not deleted successfuly");
    }

    const { __v, createdAt, updatedAt, ...resultInfo } = deletedResult._doc;
    const imageUrl = resultInfo.imageUrl;
    const isDeleted = await deleteImageFromLocal(imageUrl);
    if (isDeleted) {
      console.log("Image Deleted from local-server");
    }
    return res.json({
      status: 200,
      msg: `Record deleted successfully ${isDeleted}`,
      data: deletedInfo,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getReportBySuppAndWarehouse = async (req, res) => {
  try {
    const { supplierId, warehouseId } = req.body;
    const resportResult = await Product.aggregate([
      {
        $match: { supplier: supplierId },
      },
      { $unwind: "$warehouse" },
      {
        $match: { warehouse: warehouseId },
      },
    ]);
    return res.json({ status: 200, msg: "Success", data: resportResult });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

module.exports = {
  createPurchaseReport,
  getAllProductsByPurchase,
  getPurchaseReportById,
  updatePurchaseReport,
  deletePurchaseReport,
  isPurchaseReportExist,
  getReportBySuppAndWarehouse,
};

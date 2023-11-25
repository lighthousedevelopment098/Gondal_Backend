const TransferReport = require("../models/TransferReport");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const WareHouse = require("../models/Ware-House");
const { deleteImageFromLocal } = require("../controllers/uploadsController");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
async function isTransferReportExist(req, res, next) {
  let result;
  try {
    const custmId = req.params.id;
    result = await TransferReport.findById(custmId);
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
const createTransferReport = async (req, res) => {
  try {
    if (!req.body) {
      throw new BadRequestError("Bad Request please fields can't be empty");
    }
    const newTransferReport = await TransferReport.create(req.body);
    const { __v, createdAt, updatedAt, ...TransferReportInfo } =
      newTransferReport._doc;
    return res.json({
      status: 200,
      message: "success",
      data: TransferReportInfo,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getAllTransferReport = async (req, res) => {
  try {
    const allTransferReports = await TransferReport.find(
      {},
      { createdAt: 0, updatedAt: 0, __v: 0 }
    )
      .populate("fromWareHouseId", { name: 1 })
      .populate("toWareHouseId", { name: 1 })
      .populate("productIds");
    if (allTransferReports.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }

    const proData = await Promise.all(
      allTransferReports.map((item) => Product.findById(item.productIds))
    );
    allTransferReports.productIds = proData;
    return res.json({
      status: 200,
      msg: "success",
      data: allTransferReports,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getTransferReportById = async (req, res) => {
  try {
    //Get  object form isTransferReportExist
    const result = res.result;
    const { __v, createdAt, updatedAt, ...TransferReportInfo } = result._doc;

    return res.json({ status: 200, msg: "Success", data: TransferReportInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updateTransferReport = async (req, res) => {
  try {
    //Get  object form isTransferReportExist
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
const deleteTransferReport = async (req, res) => {
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
  createTransferReport,
  getAllTransferReport,
  getTransferReportById,
  updateTransferReport,
  deleteTransferReport,
  isTransferReportExist,
  getReportBySuppAndWarehouse,
};

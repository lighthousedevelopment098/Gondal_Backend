const Product = require("../models/Product");
const WareHouse = require("../models/Ware-House");
const Group = require("../models/Group");
const mongoose = require("mongoose");
const Supplier = require("../models/Supplier");
const { deleteImageFromLocal } = require("../controllers/uploadsController");
const fs = require("fs");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
async function isProductExist(req, res, next) {
  if (!req.body) {
    throw new BadRequestError("Body cannot be empty...");
  }
  let result;
  try {
    const proId = req.params.id;
    result = await Product.findById(proId).populate("group");
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
const createProduct = async (req, res) => {
  try {
    // update
    if (!req.file) {
      throw new BadRequestError("Please choose image file");
    } else {
      // update
      const imageUrl = req.file.filename;
      // update
      req.body.imageUrl = imageUrl;
    }

    if (!req.body) {
      throw new BadRequestError("Bad Request fields can't be empty");
    }
    const newProduct = await Product.create(req.body);
    const { __v, createdAt, updatedAt, ...ProductInfo } = newProduct._doc;

    return res.json({
      status: 200,
      message: "success",
      data: ProductInfo,
      // wareResult: result,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    if (allProducts.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }
    return res.json({ status: 200, msg: "success hello", data: allProducts });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const transferBetweenWareHouses = async (req, res) => {
  try {
    const warehouseId = req.params.id;
    const productResult = await Product.find(
      { warehouse: warehouseId },
      { _id: 1, imageUrl: 1, productName: 1, productPrice: 1, group: 1 }
    );

    const quantity = await WareHouse.find(
      {
        "productIds.id": productResult[0]._id,
      },
      { productIds: 1 }
    );
    const groupResult = await Group.find({
      _id: productResult[0].group,
    });
    return res.json({
      status: 200,
      msg: "success",
      data: { quantity, groupResult, ...productResult },
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const getProductByWareHouse = async (req, res) => {
  try {
    const warehouseId = req.params.id;
    const selectedWareHouse = await WareHouse.findById(warehouseId, {
      createdAt: 0,
      __v: 0,
      updatedAt: 0,
      _id: 0,
    });
    const productResult = await Product.find(
      {
        warehouse: {
          $elemMatch: {
            $eq: warehouseId,
          },
        },
      },
      {
        _id: 1,
        imageUrl: 1,
        productName: 1,
        productPrice: 1,
        unitProduct: 1,
        warehouse: 1
      }
    ).populate("group", { __v: 0, grpCode: 0 }).populate({ path: "warehouse" }).populate("supplier");

    //     const warehouse = await WareHouse.findOne({_id:warehouseId})
    // const proIds = warehouse
    // productResult.map((item) => {
    //   item.warehouse = selectedWareHouse;
    // });

    return res.json({
      status: 200,
      msg: "success",
      data: productResult,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const getProductById = async (req, res) => {
  try {
    //Get  object form isProductExist
    const result = res.result;
    const { __v, createdAt, updatedAt, ...ProductInfo } = result._doc;

    return res.json({ status: 200, msg: "Success", data: ProductInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getProductByGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const result = await Product.find(
      { group: groupId },
      { productName: 1, imageUrl: 1, productPrice: 1, quantity: 1 }
    );
    if (result.length <= 0) {
      throw new NotFoundError("Product not found");
    }
    return res.json({ status: 200, message: "Success", data: result });
  } catch (error) {
    const status = error.statusCode || 500;

    return res.json({ status: status, message: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    //Get  object form isProductExist
    if (!req.file.filename) {
    } else {
      const imageUrl = req.file.filename;
      req.body.imageUrl = imageUrl;
    }
    const updatedResult = await res.result.updateOne(
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );

    if (!updatedResult) {
      throw new CustomAPIError("Product not updated successfuly");
    }
    return res.json({ status: 200, msg: "Success", data: updatedResult });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updateProductsPrice = async (req, res) => {
  try {
    const { ids, price } = req.body;
    if (ids.length <= 0 || !price) {
      throw new BadRequestError("Bad Request Error");
    }
    ids.map(async (item) => {
      await Product.findByIdAndUpdate(
        item,
        { $set: { productPrice: price } },
        { new: true }
      );
    });

    return res.json({ status: 200, message: "Prices updated" });
  } catch (error) {
    const status = error.statusCode || 500;

    return res.json({ message: `${error.message}`, status: status });
  }
};
const deleteProduct = async (req, res) => {
  try {
    //Get  object form isProductExist
    if (res.result?.quantity > 0) {
      return res.status(401).json({ msg: "Cannot Delete", status: 401 })
    }
    const deletedResult = await res.result.deleteOne();
    if (!deletedResult) {
      throw new CustomAPIError("Product not deleted successfuly");
    }

    const { __v, createdAt, updatedAt, ...resultInfo } = deletedResult._doc;
    const imageUrl = resultInfo.imageUrl;
    if (!fs.existsSync("./uploads")) {
      console.log("Uploads directory does not exist");
    }
    const isDeleted = await deleteImageFromLocal(imageUrl);
    if (isDeleted) {
      console.log("image deleted form local-server");
    }
    return res.json({
      status: 200,
      msg: `Record deleted successfuly${isDeleted}`,
      data: resultInfo,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const stockAlert = async (req, res) => {

  try {
    // const data = await Product.find({});
    // const a = await Promise.all(data.map((item) => Product.find({ quantity: { $lte: item.stockAlert } })))
    const data = await Product.aggregate([
      {
        "$match": {
          "$expr": {
            "$lte": [
              "$quantity",
              "$stockAlert"
            ]
          }
        }
      }
    ])
    res.status(200).json({ msg: "success", data })
  } catch (error) {

    res.status(500).json({ msg: "fail", error })
  }

};
module.exports = {
  isProductExist,
  createProduct,
  getAllProduct,
  getProductById,
  getProductByGroup,
  updateProduct,
  updateProductsPrice,
  deleteProduct,
  getProductByWareHouse,
  stockAlert
};

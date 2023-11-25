const Customer = require("../models/Customer");
const { deleteImageFromLocal } = require("../controllers/uploadsController");

const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
async function isCustomerExist(req, res, next) {
  let result;
  try {
    const custmId = req.params.id;
    result = await Customer.findById(custmId);
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
const createCustomer = async (req, res) => {
  try {
    // if (!req.file) {
    //   throw new BadRequestError(
    //     "Bad Request please please choose an image file"
    //   );
    // }
    if (!req.body) {
      throw new BadRequestError("Bad Request please fields can't be empty");
    }
    if (req.file) {
      const imageUrl = req.file.filename;
      req.body.imageUrl = imageUrl;
    }
    // const imageUrl = req.file.filename;
    // req.body.imageUrl = imageUrl;
    const newCustomer = await Customer.create(req.body);

    const { __v, createdAt, updatedAt, ...CustomerInfo } = newCustomer._doc;
    return res.json({ status: 200, message: "success", data: CustomerInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getAllCustomer = async (req, res) => {
  try {
    const allCustomers = await Customer.find(
      {},
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );
    if (allCustomers.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }
    return res.json({ status: 200, msg: "success", data: allCustomers });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getCustomerById = async (req, res) => {
  try {
    //Get  object form isCustomerExist
    const result = res.result;
    const { __v, createdAt, updatedAt, ...CustomerInfo } = result._doc;

    return res.json({ status: 200, msg: "Success", data: CustomerInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updateCustomer = async (req, res) => {
  try {
    //Get  object form isCustomerExist
    // if (!req.file.filename) {
    // } else {
    //   const imageUrl = req.file.filename;
    //   req.body.imageUrl = imageUrl;
    // }
    const updatedResult = await res.result.updateOne(
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );
    if (!updatedResult) {
      throw new CustomAPIError("customer not updated successfuly");
    }
    return res.json({ status: 200, msg: "Success", data: updatedResult });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const deleteCustomer = async (req, res) => {
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
      // data: deletedInfo,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
module.exports = {
  createCustomer,
  getAllCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  isCustomerExist,
};

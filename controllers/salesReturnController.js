const SalesReturn = require("../models/SalesReturn");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
async function isSalesReturnExist(req, res, next) {
  let result;
  try {
    const SalesReturnId = req.params.id;
    result = await SalesReturn.findById(SalesReturnId);
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
const createSalesReturn = async (req, res) => {
  try {
    if (!req.body) {
      throw new BadRequestError("Bad Request fields can't be empty");
    }

    const newSalesReturn = await SalesReturn.create(req.body);
    const { __v, createdAt, updatedAt, ...SalesReturnInfo } =
      newSalesReturn._doc;
    return res.json({ status: 200, message: "success", data: SalesReturnInfo });

  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getAllSalesReturn = async (req, res) => {
  try {
    const allSalesReturns = await SalesReturn.find(
      {},
      { updatedAt: 0, __v: 0 }
    );
    if (allSalesReturns.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }
    return res.json({ status: 200, msg: "success", data: allSalesReturns });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getSalesReturnById = async (req, res) => {
  try {
    //Get  object form isSalesReturnExist
    const result = res.result;
    const { __v, createdAt, updatedAt, ...SalesReturnInfo } = result._doc;

    return res.json({ status: 200, msg: "Success", data: SalesReturnInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updateSalesReturn = async (req, res) => {
  try {
    //Get  object form isSalesReturnExist
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
const deleteSalesReturn = async (req, res) => {
  try {
    //Get  object form isSalesReturnExist
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
module.exports = {
  createSalesReturn,
  getAllSalesReturn,
  getSalesReturnById,
  updateSalesReturn,
  deleteSalesReturn,
  isSalesReturnExist,
};

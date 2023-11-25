const Unit = require("../models/Unit");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
async function isUnitExist(req, res, next) {
  let result;
  try {
    const unitId = req.params.id;
    result = await Unit.findById(unitId);
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
const createUnit = async (req, res) => {
  try {
    if (!req.body) {
      throw new BadRequestError("Bad Request fields can't be empty");
    }
    const newUnit = await Unit.create(req.body);
    const { __v, createdAt, updatedAt, ...UnitInfo } = newUnit._doc;
    return res.json({ status: 200, message: "success", data: UnitInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getAllUnit = async (req, res) => {
  try {
    const allUnits = await Unit.find(
      {},
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );
    if (allUnits.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }
    return res.json({ status: 200, msg: "success", data: allUnits });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getUnitById = async (req, res) => {
  try {
    //Get Single Unit from isUnitExist
    const result = res.result;
    const { __v, createdAt, updatedAt, ...UnitInfo } = result._doc;

    return res.json({ status: 200, msg: "Success", data: UnitInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updateUnit = async (req, res) => {
  try {
    //Get  object form isUnitExist
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
const deleteUnit = async (req, res) => {
  try {
    //Get  object form isUnitExist
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
  createUnit,
  getAllUnit,
  getUnitById,
  updateUnit,
  deleteUnit,
  isUnitExist,
};

const Group = require("../models/Group");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
async function isGroupExist(req, res, next) {
  let result;
  try {
    const groupId = req.params.id;
    result = await Group.findById(groupId);
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
const createGroup = async (req, res) => {
  try {
    if (!req.body) {
      throw new BadRequestError("Bad Request fields can't be empty");
    }
    const newGroup = await Group.create(req.body);
    const { __v, createdAt, updatedAt, ...GroupInfo } = newGroup._doc;
    return res.json({ status: 200, message: "success", data: GroupInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getAllGroup = async (req, res) => {
  try {
    const allGroups = await Group.find(
      {},
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );
    if (allGroups.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }
    return res.json({ status: 200, msg: "success", data: allGroups });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getGroupById = async (req, res) => {
  try {
    //Get  object form isGroupExist
    const result = res.result;
    const { __v, createdAt, updatedAt, ...GroupInfo } = result._doc;

    return res.json({ status: 200, msg: "Success", data: GroupInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updateGroup = async (req, res) => {
  try {
    //Get  object form isGroupExist
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
const deleteGroup = async (req, res) => {
  try {
    //Get  object form isGroupExist
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
  createGroup,
  getAllGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  isGroupExist,
};

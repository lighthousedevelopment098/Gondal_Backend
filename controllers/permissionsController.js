const Permissions = require("../models/Permissions");
const User = require("../models/User");
const { BadRequestError, CustomAPIError } = require("../errors");

const getAllPermissions = async (req, res) => {
  try {
    const permId = req.params.id;
    const allPermissions = await Permissions.find();
    return res.json({ status: 200, message: "Sucess", data: allPermissions });
  } catch (error) {
    return res.json({ status: 500, message: error.message });
  }
};
const createPermissions = async (req, res) => {
  try {
    if (!req.body) {
      throw new BadRequestError("Bad Request fileds are required");
    }
    const newPermissions = await Permissions.create(req.body);
    if (!newPermissions) {
      throw new CustomAPIError("permissions not created successfuly");
    }
    const { __v, createdAt, updatedAt, ...resultInfo } = newPermissions._doc;
    let updatedUser;
    let result = 0;
    const userId = req.body.userId;
    if (userId === "all") {
      const allUserIds = await User.find().select("_id");

      allUserIds.map(async (item) => {
        await User.findByIdAndUpdate(
          item._id,
          { $set: { permissionsId: resultInfo._id } },
          { new: true }
        );
      });
      return res.json({ data: allUserIds });
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { permissionsId: resultInfo._id, role: req.body.userRole } },
        { new: true }
      );
    }
    return res.json({
      status: 200,
      message: `permissions assigned to ${updatedUser?.fullName}`,
      data: resultInfo,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.json({ status: status, message: error.message });
  }
};
const updatePermissions = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new BadRequestError("please provide an id");
    }
    const permId = req.params.id;
    const updatedPermission = await Permissions.findByIdAndUpdate(
      permId,
      { $set: req.body },
      { new: true }
    );
    if (!updatedPermission) {
      throw new CustomAPIError(
        "somthing went wrong,permissions not updated successfuly"
      );
    }
    const { __v, createdAt, updatedAt, ...updatedInfo } =
      updatedPermission._doc;
    return res.json({ status: 200, message: "Success", data: updatedInfo });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.json({ status: status, message: error.message });
  }
};

const deletePermissions = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new BadRequestError("please provide an id");
    }
    const permId = req.params.id;
    const deletedPermission = await Permissions.findByIdAndDelete(permId);
    if (!deletedPermission) {
      throw new CustomAPIError("permissions not deleted successfuly");
    }
    const { __v, createdAt, updatedAt, ...deletedInfo } =
      deletedPermission._doc;
    return res.json({ status: 200, message: "Success", data: deletedInfo });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.json({ status: status, message: error.message });
  }
};
module.exports = {
  getAllPermissions,
  createPermissions,
  updatePermissions,
  deletePermissions,
};

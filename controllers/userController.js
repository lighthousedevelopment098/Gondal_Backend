const User = require("../models/User");
const Permissions = require("../models/Permissions");
const bcrypt = require('bcryptjs')
const { deleteImageFromLocal } = require("../controllers/uploadsController");
const {
  BadRequestError,
  NotFoundError,
  CustomAPIError,
  UnAuthenticatedError,
} = require("../errors");
async function isUserExist(req, res, next) {
  let result;
  try {
    const custmId = req.params.id;

    result = await User.findById(custmId);
    if (!result) {
      throw new NotFoundError("Result not found");
    }
    res.result = result;
    next();
  } catch (error) {
    const status = error.statusCode || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
}
const createUser = async (req, res) => {
  try {
    let imageUrl
    if (req.file) {
      imageUrl = req.file.filename;
      // throw new BadRequestError("please choose an image file");
    }
    if (!req.body) {
      throw new BadRequestError("fields can't be empty");
    }


    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist) {
      const isDeleted = await deleteImageFromLocal(imageUrl);
      if (isDeleted) {
        console.log("Email existed,Image Deleted from local-server");
      }
      throw new UnAuthenticatedError("email already existed");
    }
    req.body.imageUrl = imageUrl;
    const newUser = await User.create(req.body);
    const { __v, createdAt, updatedAt, ...UserInfo } = newUser._doc;
    return res.json({ status: 200, message: "Success", data: UserInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find(
      {},
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );
    if (allUsers.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }
    return res.json({ status: 200, msg: "success", data: allUsers });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};


const getUserById = async (req, res) => {
  try {
    //Get  object form isUserExist
    const result = await User.findOne({ _id: req.params.id }).populate("permissionsId");
    console.log(result);
    const { __v, createdAt, updatedAt, ...UserInfo } = result._doc;

    return res.json({ status: 200, msg: "Success", data: UserInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updateUser = async (req, res) => {
  try {
    //Get  object form isUserExist
    console.log(req.body);
    if (req.file?.filename) {
      const imageUrl = req.file?.filename;
      req.body.imageUrl = imageUrl;
    }
    const updatedResult = await User.updateOne({ _id: req.params.id },
      {
        $set: { ...req.body },
      },
      { new: true, runValidators: true }
    );
    if (!updatedResult) {
      throw new CustomAPIError("customer not updated successfuly");
    }
    return res.json({ status: 200, msg: "Success", data: updatedResult });
  } catch (error) {
    let status = error.statusCode || 500;
    let message = error.message || "Internal Server Error";
    if (error.code === 11000) {
      message = "email duplication error";
    }
    return res.json({ message: message, status: status });
  }
};
const deleteUser = async (req, res) => {
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
      data: resultInfo,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const loginUser = async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const verifyPassword = user ?
      await bcrypt.compare(password, user?.password) :
      null;

    if (!email || !password) {
      res.status(401).json("please fill data");
    } else if (verifyPassword) {

      const findRoles = await Permissions.findById(user?._id)
      res.status(200).json({
        status: 200, user: {
          email: user?.email,
          name: user?.fullName,
          status: user?.status,
          imageUrl: user?.imageUrl,
          role: user?.role
        }, roles: findRoles
      });
    } else {

      res.status(404).json({ msg: "invalid credentials" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }

}
module.exports = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  isUserExist,
  loginUser
};

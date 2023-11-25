const User = require("../models/User");
const { BadRequestError, UnAuthenticatedError } = require("../errors");

const signUpController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Bad Request, fields can't be empty");
    }
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      throw new UnAuthenticatedError(
        "User email already existed,choose another account"
      );
    }
    const newUser = await User.create(req.body);
    const { __v, createdAt, updatedAt, ...userInfo } = newUser._doc;
    return res.json({ status: 200, msg: "Success", data: userInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const signInController = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new BadRequestError("Bad Request fields can't be empty");
      }
      const user = await User.findOne({ email: email }).populate("permissionsId");
      if (!user) {
        throw new UnAuthenticatedError("email is invalid");
      }
      const isMatched = await user.comparePassword(password);
      if (!isMatched) {
        throw new UnAuthenticatedError("password is invalid");
      }
      delete user.password
      return res.json({ status: 200, msg: `Logged in Success`, data: user });
    } catch (error) {
      const status = error.status || 500;
      return res.json({
        message: `${error.message}`,
        status: status,
      });
    }
};

module.exports = { signInController, signUpController };

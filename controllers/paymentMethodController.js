const PaymentMethod = require("../models/PaymentMethod");
const { BadRequestError, CustomAPIError } = require("../errors");
const createPaymentMethod = async (req, res) => {
  try {
    const { title } = req.body;

    const result = await PaymentMethod.create({ title: title });

    if (!result) {
      throw new CustomAPIError("Not created");
    }

    return res.json({ status: 200, message: "Success", data: result });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const getAllPaymentMethods = async (req, res) => {
  try {
    const { title } = req.body;

    const result = await PaymentMethod.find();

    if (result.length <= 0) {
      throw new CustomAPIError("collection is empty");
    }

    return res.json({ status: 200, message: "Success", data: result });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updatePaymentMethod = async (req, res) => {
  try {
    const { title } = req.body;

    const result = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!result) {
      throw new CustomAPIError("Not created");
    }

    return res.json({ status: 200, message: "Success", data: result });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const deletePaymentMethod = async (req, res) => {
  try {
    const { title } = req.body;

    const result = await PaymentMethod.findByIdAndDelete(req.params.id);

    if (!result) {
      throw new CustomAPIError("Not created");
    }
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
module.exports = {
  createPaymentMethod,
  getAllPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
};

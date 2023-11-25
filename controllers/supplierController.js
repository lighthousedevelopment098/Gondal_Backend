const Supplier = require("../models/Supplier");
const PurchaseDetail = require('../models/PurchaseDetails')
const PaymentHistory = require('../models/PaymentHistory')
const fs = require("fs");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
async function isSupplierExist(req, res, next) {
  if (!req.body) {
    throw new BadRequestError("Body cannot be empty...");
  }
  let result;
  try {
    const proId = req.params.id;
    result = await Supplier.findById(proId);
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
const createSupplier = async (req, res) => {
  try {
    if (!req.body) {
      throw new BadRequestError("Bad Request fields can't be empty");
    }
    const newSupplier = await Supplier.create(req.body);
    const { __v, createdAt, updatedAt, ...SupplierInfo } = newSupplier._doc;
    return res.json({ status: 200, message: "success", data: SupplierInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getAllSupplier = async (req, res) => {

  try {
    const allSuppliers = await Supplier.find(
      {},
      { updatedAt: 0, __v: 0 }
    );
    if (allSuppliers.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }
    return res.json({ status: 200, msg: "success", data: allSuppliers });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const result = await res.result;
    const { __v, createdAt, updatedAt, ...SupplierInfo } = result._doc;

    return res.json({ status: 200, msg: "Success", data: SupplierInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const updateSupplier = async (req, res) => {
  try {
    //Get  object form isSupplierExist
    const updatedResult = await res.result.updateOne(
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );

    if (!updatedResult) {
      throw new CustomAPIError("Supplier not updated successfuly");
    }
    return res.json({ status: 200, msg: "Success", data: updatedResult });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const payToSupplier = async (req, res) => {
  try {
    //Get  object form isSupplierExist
    const payment = req.body.payment
    const supplierId = req.params.supplierId
    const purchaseArr = await PurchaseDetail.find({ supplier: supplierId, paymentStatus: "Unpaid" })
    const arr = []
    let amountToPay = req.body.payment


    purchaseArr.map((item) => {

      if (amountToPay <= 0) {
        console.log("000000000");
        return
      } else if (amountToPay < item.due) {

        console.log("if");
        console.log(amountToPay)
        arr.push(PurchaseDetail.updateOne({ _id: item._id }, { $inc: { due: -amountToPay, paid: amountToPay } }))
        amountToPay = 0
      } else if (amountToPay >= item.due) {
        amountToPay = amountToPay - item.due
        arr.push(PurchaseDetail.updateOne({ _id: item._id }, {
          $set: { due: 0, paymentStatus: "Paid" },
          $inc: { paid: item.due }
        }))
        console.log(amountToPay)
        console.log("else");
      }
    })

    const updatedResult = await Supplier.findOne(
      { _id: supplierId, purchaseDue: { $gt: 0 } });
    updatedResult.paid += payment
    updatedResult.purchaseDue -= payment
    await updatedResult.save()
    await PaymentHistory.create({
      supplierId,
      amount: payment,
      paymentMethod: req.body.method
    })
    await Promise.all(arr)
    return res.json({ status: 200, msg: "Success", data: updatedResult });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const deleteSupplier = async (req, res) => {
  try {
    //Get  object form isSupplierExist
    if (res.result?.purchaseDue === 0) {

      const deletedResult = await res.result.deleteOne();
      const { __v, createdAt, updatedAt, ...resultInfo } = deletedResult._doc;
      return res.json({
        status: 200,
        msg: `Record deleted successfuly`,
        data: resultInfo,
      });
    }
    else {
      throw new CustomAPIError("Amount is pending");
    }
    // if (!deletedResult) {
    //   throw new CustomAPIError("Supplier not deleted successfuly");
    // }


  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const getAllPayment = async (req, res) => {
  try {
    //Get  object form isSupplierExist
    const data = await PaymentHistory.find({ supplierId: req.params.id }).populate("supplierId").limit(10)
    return res.json({
      status: 200,
      data,
    });



  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
module.exports = {
  isSupplierExist,
  createSupplier,
  getAllSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  payToSupplier,
  getAllPayment
};

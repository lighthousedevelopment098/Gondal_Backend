const Brand = require("../models/Brand");
const { deleteImageFromLocal } = require("../controllers/uploadsController");
const fs = require("fs");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
async function isBrandExist(req, res, next) {
  let result;
  try {
    const BrandId = req.params.id;
    result = await Brand.findById(BrandId);
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
const createBrand = async (req, res) => {
  try {
    if (!req.file) {
      throw new BadRequestError("Please choose image file");
    }
    if (!req.body) {
      throw new BadRequestError("Bad Request fields can't be empty");
    }
    const imageUrl = req.file.filename;
    req.body.imageUrl = imageUrl;
    const newBrand = await Brand.create(req.body);
    const { __v, createdAt, updatedAt, ...BrandInfo } = newBrand._doc;
    return res.json({ status: 200, message: "success", data: BrandInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getAllBrand = async (req, res) => {
  // const BrandId=req.params.id;
  try {
    const allBrands = await Brand.find(
      {},
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );
    if (allBrands.length <= 0) {
      throw new NotFoundError("Collection is empty");
    }
    return res.json({ status: 200, msg: "success", data: allBrands });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};

const getBrandById = async (req, res) => {
  try {
    //Get Single Brand from isBrandExist
    const result = res.result;
    const { __v, createdAt, updatedAt, ...BrandInfo } = result._doc;

    return res.json({ status: 200, msg: "Success", data: BrandInfo });
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
// const updateBrand = async (req, res) => {
//   try {
//     if (req.file.filename) {
//       const imageUrl = req.file.filename;
//       req.body.imageUrl = imageUrl;
//     }
//     const updatedResult = await res.result.updateOne(
//       {
//         $set: req.body,
//       },
//       {
//         new: true,
//       }
//     );
//     return res.json({ status: 200, msg: "Success", data: updatedResult });
//   } catch (error) {
//     const status = error.status || 500;
//     return res.json({ message: `${error.message}`, status: status });
//   }
// };
const updateBrand = async (req, res) => {
  try {
    const {id} = req.params;
    if(req.file){
      req.body.imageUrl = req.file.filename
    }
    const findBrand = await Brand.findByIdAndUpdate(id, req.body, {new: true});
    return res.status(200).json({status: 200, data: findBrand});
  } catch (error) {
    const status = error.status || 500;
    return res.json({ message: `${error.message}`, status: status });
  }
};
const deleteBrand = async (req, res) => {
  try {
    //Get  object form isBrandExist
    const deletedResult = await res.result.deleteOne();
    if (!deletedResult) {
      throw new CustomAPIError("Product not deleted successfuly");
    }
    const { __v, createdAt, updatedAt, ...resultInfo } = deletedResult._doc;
    const imageUrl = resultInfo.imageUrl;
    if (!fs.existsSync("./uploads")) {
    }
    const isDeleted = await deleteImageFromLocal(imageUrl);
    if (isDeleted) {
      console.log("image deleted from local-server");
    }
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
  createBrand,
  getAllBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
  isBrandExist,
};

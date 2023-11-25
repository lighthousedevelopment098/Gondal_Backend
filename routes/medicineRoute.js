const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const Medicine = require("../models/Medicine");
router.post("/create", async (req, res) => {
  try {
    console.log("medicine created called");
    await Medicine.create(req.body);
    res.status(200).json({ status: true, data: "Created Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});
router.get("/get", async (req, res) => {
  try {
    console.log("medicine get called");
    const data = await Medicine.find();
    res.status(200).json({ status: true, data });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    console.log("Id=>", req.params.id);

    console.log("medicine updated called");
    await Medicine.findByIdAndUpdate(
      req?.params?.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ status: true, data: "Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    console.log("medicine deleted called");
    await Medicine.deleteOne({ _id: req?.params.id });
    res.status(200).json({ status: true, data: "Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});
module.exports = router;

const router = require('express').Router();
const ExpenseModal = require('../models/Expense');

router.post('/create', async (req, res) => {
  try {
    if(!req.body.amount || !req.body.description){
      return res.json({status: 404, message: "Fill All Fields"})
    }
    const data = await ExpenseModal.create(req.body);
    return res.status(201).json({ status: 200, message: "Expense created successfully", data });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Failed to create expense", error: error.message });
  }
});

router.get('/getAll', async (req, res) => {
  try {
    const data = await ExpenseModal.find({});
    res.status(200).json({ status: 200, message: "Success", data });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Failed to retrieve expenses", error: error.message });
  }
});

router.get('/getById/:id', async (req, res) => {
  try {
    const data = await ExpenseModal.findOne({ _id: req.params.id });
    if (!data) {
      return res.status(404).json({ status: 404, message: "Expense not found" });
    }
    res.status(200).json({ status: 200, message: "Success", data });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Failed to retrieve the expense", error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const data = await ExpenseModal.findByIdAndUpdate(id, req.body, {new: true});
    if (!data) {
      return res.status(404).json({ status: 404, message: "Expense not found or no modifications were made" });
    }
    res.status(200).json({ status: 200, message: "Expense updated successfully", data });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Failed to update expense", error: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const data = await ExpenseModal.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ status: 404, message: "Expense not found or already deleted" });
    }
    res.status(200).json({ status: 200, message: "Expense deleted successfully", data });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Failed to delete expense", error: error.message });
  }
});

module.exports = router;

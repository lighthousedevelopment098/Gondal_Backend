const router = require('express').Router()
const CategoryModal = require('../models/Category')
router.get('/getAll', async (req, res) => {
    try {
        const data = await CategoryModal.find({})
        res.status(200).json({ msg: "Success", data })
    } catch (error) {
        res.status(500).json({ msg: "fail", error })
    }
})
router.get('/getById/:id', async (req, res) => {
    try {
        const data = await CategoryModal.findOne({ _id: req.params.id })
        res.status(200).json({ msg: "Success", data })
    } catch (error) {
        res.status(500).json({ msg: "fail", error })
    }
})
router.post('/create', async (req, res) => {
    try {
        const data = await CategoryModal.create({ ...req.body })
        res.status(200).json({ status: 200, msg: "Success", data })
    } catch (error) {
        res.status(500).json({ status: 500, msg: "fail", error })
    }
})
router.patch('/update/:id', async (req, res) => {
    try {
        const data = await CategoryModal.updateOne({ _id: req.params.id }, {
            $set: { name: req.body.name }
        })
        res.status(200).json({ status: 200, msg: "Success", data })
    } catch (error) {
        res.status(500).json({ msg: "fail", error })
    }
})
router.delete('/delete/:id', async (req, res) => {
    try {
        const data = await CategoryModal.deleteOne({ _id: req.params.id })
        res.status(200).json({ msg: "Success", data })
    } catch (error) {
        res.status(500).json({ msg: "fail", error })
    }
})
module.exports = router
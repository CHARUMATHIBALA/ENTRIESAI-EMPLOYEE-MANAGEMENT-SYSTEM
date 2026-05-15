
const express = require('express')
const router = express.Router()
const Employee = require('../models/Employee')

// GET /api/employee?q=search
router.get('/', async (req, res) => {
  try {
    const { q } = req.query
    let filter = {}
    if (q) {
      const regex = new RegExp(q, 'i')
      filter = { $or: [{ name: regex }, { email: regex }, { dept: regex }] }
    }
    const employees = await Employee.find(filter).sort({ createdAt: -1 })
    res.json(employees)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const employee = new Employee(req.body)
    const saved = await employee.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { _id, __v, ...updateData } = req.body
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    if (!updated) return res.status(404).json({ message: 'Employee not found' })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Employee not found' })
    res.json({ message: 'Employee deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

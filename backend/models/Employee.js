
const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  dept: { type: String },
  salary: { type: Number },
  joiningDate: { type: Date },
  position: { type: String }
})

module.exports = mongoose.model('Employee', employeeSchema)

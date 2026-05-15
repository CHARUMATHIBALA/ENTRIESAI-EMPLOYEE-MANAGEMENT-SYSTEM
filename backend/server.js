
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const employeeRoutes = require('./routes/employeeRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/employee', employeeRoutes)
app.use('/api/auth', authRoutes)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employeedb'
const PORT = process.env.PORT || 5000

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  
  
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

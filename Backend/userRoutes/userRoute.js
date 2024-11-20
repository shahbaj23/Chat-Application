const express = require('express')
const protectedRoute = require('../middleware/protectedRoute')
const getUsers = require('../controllers/userControllers')

const router = express.Router()

router.get('/users', protectedRoute, getUsers)

module.exports = router